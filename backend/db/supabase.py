import httpx
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

async def fetch_time_logs(swimmer_id: str, event: str):
    url = f"{SUPABASE_URL}/rest/v1/time_logs"
    params = {
        "swimmer_id": f"eq.{swimmer_id}",
        "event": f"eq.{event}",
        "order": "log_date.asc",
        "select": "log_date,time_seconds"
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params=params)
        return response.json()

async def fetch_swimmer(swimmer_id: str):
    url = f"{SUPABASE_URL}/rest/v1/swimmers"
    params = {
        "id": f"eq.{swimmer_id}",
        "select": "*"
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params=params)
        print("SWIMMER STATUS:", response.status_code)
        print("SWIMMER RESPONSE:", response.text)
        data = response.json()
        return data[0] if data else None