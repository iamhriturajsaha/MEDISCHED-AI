import whisper
import os

# Load model once
model = None

def get_model():
    global model
    if model is None:
        # Using 'base' for a balance between speed and accuracy
        model = whisper.load_model("base")
    return model

async def transcribe_audio(file_path: str):
    """
    Transcribes an audio file using OpenAI Whisper.
    """
    if not os.path.exists(file_path):
        return "Audio file not found."
    
    current_model = get_model()
    result = current_model.transcribe(file_path)
    return result["text"]
