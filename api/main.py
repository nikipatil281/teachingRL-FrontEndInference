from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import onnxruntime as ort
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Enable CORS for frontend (allows requests from localhost:5173/5174)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
model_path = os.path.join(os.path.dirname(__file__), "../public/model.onnx")
if not os.path.exists(model_path):
    print(f"WARNING: Model not found at {model_path}")
    session = None
else:
    try:
        session = ort.InferenceSession(model_path)
        print(f"Model loaded from {model_path}")
    except Exception as e:
        print(f"Failed to load model: {e}")
        session = None

class PredictionRequest(BaseModel):
    price: float
    weather: str
    nearby_event: int

@app.post("/predict")
def predict(req: PredictionRequest):
    if session is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        # Prepare inputs exactly as the model expects
        # Names: price_set_by_player, weather, nearby_event
        # Types: float32, string, float32
        
        input_feeds = {
            "price_set_by_player": np.array([[req.price]], dtype=np.float32),
            "weather": np.array([[req.weather]], dtype=object),
            "nearby_event": np.array([[float(req.nearby_event)]], dtype=np.float32)
        }
        
        output_name = session.get_outputs()[0].name
        result = session.run([output_name], input_feeds)
        predicted_customers = float(result[0][0])
        
        return {"predicted_customers": max(0, predicted_customers)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "ML API Running", "model_loaded": session is not None}
