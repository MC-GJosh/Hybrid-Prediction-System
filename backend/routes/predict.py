from fastapi import APIRouter
from pydantic import BaseModel
from db.supabase import fetch_time_logs, fetch_swimmer
from ml.model import predict_time

router = APIRouter()

class PredictRequest(BaseModel):
    swimmer_id: str
    event: str

@router.post("/predict")
async def predict(request: PredictRequest):
    swimmer = await fetch_swimmer(request.swimmer_id)
    if not swimmer:
        return {"error": "Swimmer not found"}

    time_logs = await fetch_time_logs(request.swimmer_id, request.event)
    if len(time_logs) < 2:
        return {"error": "Not enough time logs. Need at least 2 entries."}

    result = predict_time(time_logs)
    if not result:
        return {"error": "Could not generate prediction"}

    return {
        "swimmer": swimmer["full_name"],
        "event": request.event,
        **result
    }