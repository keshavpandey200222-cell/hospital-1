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

@app.post("/ai/chat")
async def ai_chat(data: SymptomInput):
    msg = data.symptoms.lower()
    
    # Intent: SOS / Emergency
    if any(k in msg for k in ['help', 'dying', 'emergency', 'accident', 'bleeding', 'unconscious']):
        return {
            "reply": "🚨 EMERGENCY DETECTED. I'm triggering the SOS system and alerting the nearest ambulance. Stay calm.",
            "intent": "SOS",
            "action": "TRIGGER_SOS"
        }
    
    # Intent: Symptom Check
    if 'pain' in msg or 'fever' in msg or 'cough' in msg or 'ache' in msg:
        specialist = "General Physician"
        if 'chest' in msg or 'heart' in msg: specialist = "Cardiologist"
        elif 'brain' in msg or 'head' in msg: specialist = "Neurologist"
        elif 'bone' in msg or 'fracture' in msg: specialist = "Orthopedic"
        
        return {
            "reply": f"It sounds like you're experiencing some discomfort. Based on your symptoms, I recommend consulting a {specialist}. Would you like to view our top-rated specialists?",
            "intent": "SYMPTOM_CHECK",
            "specialist": specialist,
            "action": "SUGGEST_BOOKING"
        }

    # Intent: Booking
    if any(k in msg for k in ['book', 'appointment', 'visit', 'see doctor']):
        return {
            "reply": "I can help you schedule a visit. Which department or specialist are you looking for today?",
            "intent": "BOOKING",
            "action": "NAVIGATE_APPOINTMENTS"
        }

    # Intent: Reminders / Medicine
    if any(k in msg for k in ['medicine', 'pill', 'remind', 'schedule', 'dose']):
        return {
            "reply": "Checking your clinical schedule... You have 3 active prescriptions. Would you like to see your medication tracker?",
            "intent": "REMINDERS",
            "action": "SHOW_MED_TRACKER"
        }

    # Default
    return {
        "reply": "I'm Nexus AI, your health assistant. I can help you check symptoms, book appointments, or trigger emergency services. How can I assist you right now?",
        "intent": "GENERAL",
        "action": "NONE"
    }

@app.post("/ai/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    return {"transcript": "[AI SCRIBE TRANSCRIPT] Sample transcript data."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
