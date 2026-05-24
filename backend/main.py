from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.predict import router as predict_router
from routes.feedback import router as feedback_router

app = FastAPI(title="Swimlytics AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/api")
app.include_router(feedback_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Swimlytics AI Backend is running"}