from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import anthropic
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

router = APIRouter()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class FeedbackRequest(BaseModel):
    swimmer_name: str
    event: str
    predicted_time: float
    best_case: float
    worst_case: float
    trend: str
    confidence: str
    data_points: int
    avg_fatigue: Optional[float] = None
    avg_sleep: Optional[float] = None
    attendance_rate: Optional[float] = None
    avg_volume: Optional[float] = None
    target_time: Optional[float] = None
    recent_delta: Optional[float] = None
    std_deviation: Optional[float] = None
    target_date: Optional[str] = None
    personal_best: Optional[float] = None

@router.post("/feedback")
async def feedback(request: FeedbackRequest):

    training_info = ""
    if request.avg_fatigue is not None:
        training_info += f"\n- Average fatigue score: {request.avg_fatigue}/10"
    if request.avg_sleep is not None:
        training_info += f"\n- Average sleep hours: {request.avg_sleep} hrs"
    if request.attendance_rate is not None:
        training_info += f"\n- Attendance rate: {request.attendance_rate}%"
    if request.avg_volume is not None:
        training_info += f"\n- Average training volume: {request.avg_volume}m per session"

    target_info = ""
    if request.target_time:
        gap = round(request.predicted_time - request.target_time, 2)
        if gap > 0:
            target_info = (
                f"\nTarget time: {request.target_time}s "
                f"(currently projected {gap}s slower than target)"
            )
        else:
            target_info = (
                f"\nTarget time: {request.target_time}s "
                f"(currently projected to meet or exceed target)"
            )

    metrics_info = ""
    if request.recent_delta is not None:
        metrics_info += f"\nRecent delta: {request.recent_delta}s"
    if request.std_deviation is not None:
        metrics_info += f"\nStandard deviation: {request.std_deviation}s"

    # Calculate days until race
    days_until_race = None
    if request.target_date:
        from datetime import datetime
        try:
            race_date = datetime.strptime(request.target_date, "%Y-%m-%d")
            today = datetime.today()
            days_until_race = (race_date - today).days
        except:
            pass

    # PB gap
    pb_info = ""
    if request.personal_best:
        pb_gap = round(request.predicted_time - request.personal_best, 2)
        if pb_gap > 0:
            pb_info = f"\nPersonal Best: {request.personal_best}s (swimmer is {pb_gap}s away from PB)"
        else:
            pb_info = f"\nPersonal Best: {request.personal_best}s (swimmer is projected to beat their PB)"

    # Race timing
    race_info = ""
    if days_until_race is not None:
        if days_until_race < 0:
            race_info = f"\nTarget race date has passed."
        elif days_until_race == 0:
            race_info = f"\nRace is TODAY."
        elif days_until_race <= 7:
            race_info = f"\nDays until race: {days_until_race} days (race week — taper phase)"
        elif days_until_race <= 21:
            race_info = f"\nDays until race: {days_until_race} days (sharpen and race-pace focus)"
        else:
            race_info = f"\nDays until race: {days_until_race} days (build phase)"

    prompt = f"""
You are an elite swimming performance analyst writing a concise report for a swim coach.

SWIMMER DATA
Name: {request.swimmer_name}
Event: {request.event}
Predicted time: {request.predicted_time}s
Best case: {request.best_case}s
Worst case: {request.worst_case}s
Performance trend: {request.trend}
Prediction confidence: {request.confidence}
Time logs analyzed: {request.data_points}
{target_info}
{metrics_info}
{pb_info}
{race_info}

TRAINING CONTEXT
{training_info if training_info else "No training log data available."}

Write exactly 3 concise sentences addressed to the coach covering:
1. What the current data suggests about the swimmer's readiness and progression
2. One specific training adjustment based on trend, fatigue, days until race, or PB gap
3. One concrete action before the next race including timeline if race date is known

Rules:
- Address the coach directly
- Refer to the swimmer by name in third person
- Only mention fatigue, sleep, attendance if data exists
- Only mention race date if target_date is provided
- Only mention PB if personal_best is provided
- Be specific, practical, and data-driven
- No bullet points, headers, or motivational language
- Do not invent missing information
- Keep under 100 words"""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=350,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return {
        "feedback": message.content[0].text
    }