from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="NexusHealth ML Service")

class SymptomInput(BaseModel):
    symptoms: str

class DiseasePredictionInput(BaseModel):
    features: list[float]

@app.get("/")
def read_root():
    return {"status": "ML Service is running"}

@app.post("/predict/specialist")
def predict_specialist(data: SymptomInput):
    # TODO: Simple NLP / Keyword Matching to route symptoms to a specialist
    symptoms = data.symptoms.lower()
    if 'chest' in symptoms or 'heart' in symptoms:
        return {"specialist": "Cardiologist"}
    elif 'fever' in symptoms or 'headache' in symptoms:
        return {"specialist": "General Physician"}
    return {"specialist": "General Physician"}

@app.post("/predict/disease")
def predict_disease(data: DiseasePredictionInput):
    # TODO: Load Scikit-learn model and predict (e.g. Heart Disease dataset)
    # model.predict([data.features])
    return {"predicted_disease": "Example Disease", "confidence": 0.85}

@app.post("/ai/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # TODO: Implement OpenAI Whisper logic
    # transcript = whisper_model.transcribe(file.file)
    return {"transcript": "[AI SCRIBE TRANSCRIPT] Patient reported mild headache and fever for 2 days. Prescribing paracetamol."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
