from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String, default="Doctor")
    enable_notifications = Column(Boolean, default=True)

class QueueItem(Base):
    __tablename__ = "queue_items"

    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String)
    type = Column(String)
    time = Column(String)
    phone = Column(String)
    user_email = Column(String)

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    date = Column(String) # YYYY-MM-DD
    time = Column(String) # HH:MM
    duration = Column(Integer)
    status = Column(String) # confirmed, pending, conflict
    notes = Column(String, default="")
    phone = Column(String, default="")
    email = Column(String, default="")
    user_email = Column(String) # For persistence per account

class CallLog(Base):
    __tablename__ = "call_logs"

    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    duration = Column(String)
    tags = Column(JSON) # List of strings
    summary = Column(String)
    call_type = Column(String)
    transcript = Column(JSON) # List of dicts {speaker, time, text}
