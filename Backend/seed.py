import models
from database import SessionLocal, engine
import datetime

# Create tables
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed_data():
    # Seed a default user if not exists
    user = db.query(models.User).filter(models.User.email == "hrituraj.s@medisched.ai").first()
    if not user:
        new_user = models.User(
            name="Hrituraj Saha",
            email="hrituraj.s@medisched.ai",
            password="1234567890",
            role="Admin",
            enable_notifications=True
        )
        db.add(new_user)
        print("Seeded user: Hrituraj Saha")

    # Seed some sample call logs if empty or add more
    if db.query(models.CallLog).count() < 10:
        logs = [
            models.CallLog(
                patient_name="Eleanor Vance",
                duration="1m 12s",
                tags=["Confirmed", "Procedure"],
                summary="Patient confirmed the MRI procedure for Tuesday at 10 AM.",
                call_type="Outbound",
                transcript=[
                    {"speaker": "AI", "time": "0:01", "text": "Hello, this is MediSched AI calling for Eleanor Vance."},
                    {"speaker": "Patient", "time": "0:05", "text": "Yes, this is Eleanor."},
                    {"speaker": "AI", "time": "0:10", "text": "I'm calling to confirm your MRI appointment for Tuesday."}
                ]
            ),
            models.CallLog(
                patient_name="Dr. Jonathan Reyes",
                duration="3m 45s",
                tags=["Insurance", "Query"],
                summary="Discussion regarding insurance coverage for the new heart valve procedure.",
                call_type="Inbound",
                transcript=[
                    {"speaker": "Provider", "time": "0:01", "text": "Hello, I have a question about the Sinclair case."},
                    {"speaker": "AI", "time": "0:06", "text": "Certainly, Dr. Reyes. How can I assist you today?"}
                ]
            ),
            models.CallLog(
                patient_name="Samantha Hughes",
                duration="2m 30s",
                tags=["Reschedule", "MRI"],
                summary="Patient requested to move their MRI from Friday to next Monday.",
                call_type="Outbound",
                transcript=[
                    {"speaker": "AI", "time": "0:01", "text": "Hello Samantha, I'm calling about your MRI scan."},
                    {"speaker": "Patient", "time": "0:05", "text": "Hi, can we move that to Monday?"}
                ]
            ),
            models.CallLog(
                patient_name="Liam Sterling",
                duration="1m 45s",
                tags=["Confirmed", "Checkup"],
                summary="Routine dental checkup confirmed for tomorrow.",
                call_type="Outbound",
                transcript=[
                    {"speaker": "AI", "time": "0:01", "text": "Hi Liam, confirming your dental checkup."}
                ]
            ),
            models.CallLog(
                patient_name="Olivia Chen",
                duration="4m 10s",
                tags=["Lab Results", "Follow-up"],
                summary="Discussed recent blood work results and scheduled a follow-up with Dr. Miller.",
                call_type="Inbound",
                transcript=[
                    {"speaker": "Patient", "time": "0:01", "text": "I'm calling to get my lab results."}
                ]
            ),
            models.CallLog(
                patient_name="Marcus Wellington",
                duration="2m 15s",
                tags=["Prescription", "Refill"],
                summary="Processed refill for blood pressure medication.",
                call_type="Outbound",
                transcript=[
                    {"speaker": "AI", "time": "0:01", "text": "Calling about your prescription refill."}
                ]
            ),
            models.CallLog(
                patient_name="Sophia Patel",
                duration="3m 20s",
                tags=["No-Show", "Follow-up"],
                summary="Followed up on missed appointment, rescheduled for Thursday.",
                call_type="Outbound",
                transcript=[
                    {"speaker": "AI", "time": "0:01", "text": "We missed you at your appointment today."}
                ]
            ),
            models.CallLog(
                patient_name="Helena Park",
                duration="1m 55s",
                tags=["Reminder", "Post-Op"],
                summary="Post-operative check-in call. Patient reports no complications.",
                call_type="Outbound",
                transcript=[
                    {"speaker": "AI", "time": "0:01", "text": "Just checking in after your surgery."}
                ]
            )
        ]
        db.add_all(logs)
        print(f"Seeded {len(logs)} call logs.")
    
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_data()
