'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneOutgoing, Mic, Volume2, VolumeX, Pause, PhoneOff, User, Activity, AlertTriangle, Calendar as CalendarIcon, CheckCircle2, Clock, Users, BarChart3, Phone, Play, ArrowUpRight, Trash2, XCircle } from 'lucide-react';

const RESCHEDULE_SCRIPT = [
  { speaker: 'AI', text: 'Hello Robert, I am calling from Medi-Sched AI regarding your upcoming appointment. Are you still able to make it?' },
  { speaker: 'User', text: 'Actually, I need to reschedule. I have to work late.', delay: 3000 },
  { speaker: 'System', text: 'Action: Real-time slot fetching triggered...', delay: 1000, icon: <Activity size={14}/>, color: 'var(--accent-color)' },
  { speaker: 'AI', text: 'I can help with that. I checked our calendar and see an opening this Thursday at 2:00 PM. Does that work?', delay: 2000 },
  { speaker: 'User', text: 'Yes, Thursday at 2:00 PM is perfect.', delay: 3000 },
  { speaker: 'System', text: 'Action: Slot booked successfully in DB.', delay: 1000, icon: <CalendarIcon size={14}/>, color: 'var(--success)' },
  { speaker: 'AI', text: 'Great, your appointment is moved to Thursday at 2:00 PM. Have a great day!', delay: 2000 },
  { speaker: 'System', text: 'Call Ended - Success', delay: 1000, end: true }
];

const FALLBACK_SCRIPT = [
  { speaker: 'AI', text: 'Hello Esther, I am calling from Medi-Sched AI to confirm your MRI scan tomorrow at 9 AM.' },
  { speaker: 'User', text: 'Hi. I noticed my insurance changed to Medicare Part B yesterday. Do I need pre-authorization?', delay: 3000 },
  { speaker: 'System', text: 'Intent Recognized: Complex Billing Issue (Confidence: 34%)', delay: 1500, icon: <AlertTriangle size={14}/>, color: 'var(--warning)' },
  { speaker: 'AI', text: 'I understand. Insurance changes can be tricky. Let me transfer you to a human specialist who can assist you right away.', delay: 2000 },
  { speaker: 'System', text: 'Status: Agent Fallback Required', delay: 1500, fallback: true }
];

const CONFIRMATION_SCRIPT = [
  { speaker: 'AI', text: 'Good morning, this is Medi-Sched AI calling for Liam Sterling. Am I speaking with Liam?' },
  { speaker: 'User', text: 'Yes, this is Liam.', delay: 2500 },
  { speaker: 'AI', text: 'Great. I am calling to confirm your dental checkup tomorrow at 3:00 PM with Dr. Patel. Can you still make it?', delay: 2000 },
  { speaker: 'User', text: 'Yes, I will be there.', delay: 2500 },
  { speaker: 'System', text: 'Status: Appointment Confirmed in DB', delay: 1000, icon: <CheckCircle2 size={14}/>, color: 'var(--success)' },
  { speaker: 'AI', text: 'Perfect. Please remember to bring your insurance card. See you tomorrow!', delay: 2000 },
  { speaker: 'System', text: 'Call Ended - Success', delay: 1000, end: true }
];

const BILLING_SCRIPT = [
  { speaker: 'AI', text: 'Hello Oscar, this is Medi-Sched AI. I am calling regarding an outstanding balance of forty-five dollars from your last visit.' },
  { speaker: 'User', text: 'Oh, I thought my insurance covered that.', delay: 3000 },
  { speaker: 'AI', text: 'I see. It looks like there was a small co-pay required. Would you like to pay now via our secure automated link?', delay: 2000 },
  { speaker: 'User', text: 'Can you send me the link?', delay: 2500 },
  { speaker: 'System', text: 'Action: Secure Payment Link Sent via SMS', delay: 1000, icon: <CheckCircle2 size={14}/>, color: 'var(--success)' },
  { speaker: 'AI', text: 'I have just sent it to your mobile. Thank you for your time!', delay: 2000 },
  { speaker: 'System', text: 'Call Ended - Success', delay: 1000, end: true }
];

const PREOP_SCRIPT = [
  { speaker: 'AI', text: 'Hello Diego, this is Medi-Sched AI. I am calling with your pre-operative instructions for your surgery on Monday.' },
  { speaker: 'User', text: 'Yes, I am listening.', delay: 2000 },
  { speaker: 'AI', text: 'Important: Please do not eat or drink anything after midnight on Sunday. Also, remember to arrive at least one hour early.', delay: 3000 },
  { speaker: 'User', text: 'Got it. No food after midnight and arrive early.', delay: 2500 },
  { speaker: 'AI', text: 'Exactly. Do you have any other questions?', delay: 2000 },
  { speaker: 'User', text: 'No, thank you.', delay: 2000 },
  { speaker: 'AI', text: 'Excellent. We will see you on Monday morning.', delay: 2000 },
  { speaker: 'System', text: 'Call Ended - Success', delay: 1000, end: true }
];

const LAB_SCRIPT = [
  { speaker: 'AI', text: 'Hello Isla, this is Medi-Sched AI. Your lab results from Dr. Miller are now available for review.' },
  { speaker: 'User', text: 'Are they okay?', delay: 2500 },
  { speaker: 'AI', text: 'Dr. Miller has reviewed them and says everything is within the normal range. No follow-up is needed at this time.', delay: 3000 },
  { speaker: 'User', text: 'That is great news. Thank you!', delay: 2000 },
  { speaker: 'AI', text: 'You are very welcome. Have a wonderful day!', delay: 2000 },
  { speaker: 'System', text: 'Call Ended - Success', delay: 1000, end: true }
];

const REFILL_SCRIPT = [
  { speaker: 'AI', text: 'Hello Nathaniel, this is Medi-Sched AI. I am calling to let you know your prescription refill has been approved.' },
  { speaker: 'User', text: 'Which pharmacy was it sent to?', delay: 3000 },
  { speaker: 'AI', text: 'It was sent to the CVS on West Main Street. It should be ready for pickup by 4 PM today.', delay: 2500 },
  { speaker: 'User', text: 'Perfect, thank you.', delay: 2000 },
  { speaker: 'AI', text: 'Is there anything else I can help with?', delay: 2000 },
  { speaker: 'User', text: 'No, that is all.', delay: 2000 },
  { speaker: 'AI', text: 'Goodbye, Nathaniel.', delay: 1500 },
  { speaker: 'System', text: 'Call Ended - Success', delay: 1000, end: true }
];

const FOLLOWUP_SCRIPT = [
  { speaker: 'AI', text: 'Hello Zara, this is Medi-Sched AI. Dr. Reyes would like to schedule a follow-up visit in two weeks.' },
  { speaker: 'User', text: 'Can we do it on a Tuesday morning?', delay: 3000 },
  { speaker: 'AI', text: 'Let me check... Yes, I have Tuesday, November 10th at 10:15 AM available. Does that work?', delay: 2500 },
  { speaker: 'User', text: 'Yes, that works.', delay: 2000 },
  { speaker: 'System', text: 'Action: Follow-up booked in system', delay: 1000, icon: <CalendarIcon size={14}/>, color: 'var(--success)' },
  { speaker: 'AI', text: 'I have scheduled that for you. You will receive a reminder closer to the date.', delay: 2000 },
  { speaker: 'System', text: 'Call Ended - Success', delay: 1000, end: true }
];

const VACCINE_SCRIPT = [
  { speaker: 'AI', text: 'Hello Caleb, this is Medi-Sched AI. We are calling to let you know that the seasonal flu vaccine is now available.' },
  { speaker: 'User', text: 'Do I need an appointment or can I just walk in?', delay: 3000 },
  { speaker: 'AI', text: 'You can just walk in anytime between 9 AM and 4 PM, Monday through Friday.', delay: 2500 },
  { speaker: 'User', text: 'Okay, I will come by tomorrow.', delay: 2000 },
  { speaker: 'AI', text: 'Wonderful. We look forward to seeing you.', delay: 2000 },
  { speaker: 'System', text: 'Call Ended - Success', delay: 1000, end: true }
];

const REFERRAL_SCRIPT = [
  { speaker: 'AI', text: 'Hello Mila, this is Medi-Sched AI. Your referral to the cardiology specialist has been processed.' },
  { speaker: 'User', text: 'Which doctor am I seeing?', delay: 3000 },
  { speaker: 'AI', text: 'You have been referred to Dr. Santoro. Their office will call you within 48 hours to set up an appointment.', delay: 3000 },
  { speaker: 'User', text: 'Okay, thank you for the update.', delay: 2000 },
  { speaker: 'AI', text: 'My pleasure. Goodbye, Mila.', delay: 1500 },
  { speaker: 'System', text: 'Call Ended - Success', delay: 1000, end: true }
];

const ALL_SCRIPTS = [RESCHEDULE_SCRIPT, FALLBACK_SCRIPT, CONFIRMATION_SCRIPT, BILLING_SCRIPT, PREOP_SCRIPT, LAB_SCRIPT, REFILL_SCRIPT, FOLLOWUP_SCRIPT, VACCINE_SCRIPT, REFERRAL_SCRIPT];
const ALL_NAMES = ['Robert Fox', 'Esther Howard', 'Liam Sterling', 'Olivia Chen', 'Marcus Wellington', 'Sophia Patel', 'Helena Park', 'Diego Salazar', 'Freya Jensen', 'Zara Kapoor'];
const ALL_INTENTS = ['Appointment Reschedule', 'General Query', 'Appointment Confirmation', 'Lab Results', 'Prescription Refill', 'No-Show Follow-up'];

const CALL_QUEUE = [
  { id: 'q1', name: 'Olivia Chen', type: 'Appointment Reminder', time: '2:30 PM', phone: '+1 (555) 123-4567' },
  { id: 'q2', name: 'Marcus Wellington', type: 'Lab Results Ready', time: '2:35 PM', phone: '+1 (555) 234-5678' },
  { id: 'q3', name: 'Sophia Patel', type: 'Prescription Refill', time: '2:40 PM', phone: '+1 (555) 345-6789' },
  { id: 'q4', name: 'Nathaniel Rossi', type: 'Follow-up Reminder', time: '2:45 PM', phone: '+1 (555) 456-7890' },
  { id: 'q5', name: 'Ava Sinclair', type: 'Insurance Verification', time: '2:50 PM', phone: '+1 (555) 567-8901' },
];

const CALL_HISTORY = [
  { name: 'David Chen', outcome: 'Confirmed', duration: '01:42', time: '10:15 AM' },
  { name: 'Emily Brown', outcome: 'Voicemail', duration: '00:32', time: '10:22 AM' },
  { name: 'Sarah Lee', outcome: 'Rescheduled', duration: '03:15', time: '10:30 AM' },
  { name: 'James Wilson', outcome: 'Confirmed', duration: '01:58', time: '10:45 AM' },
  { name: 'Maria Garcia', outcome: 'No Answer', duration: '00:00', time: '10:52 AM' },
];

const EXTRA_NAMES = ['Helena Park', 'Oscar Ramirez', 'Freya Jensen', 'Caleb Whitmore', 'Isla Nakamura', 'Diego Salazar', 'Mila Okonkwo', 'Felix Bergström', 'Zara Kapoor', 'Theo Beaumont', 'Luna Ferretti', 'Jasper Oakes'];
const EXTRA_TYPES = ['Appointment Reminder', 'Lab Results Ready', 'Prescription Refill', 'Follow-up Reminder', 'Insurance Verification', 'Post-Op Check-in', 'Billing Inquiry', 'Test Results'];
const OUTCOMES = ['Confirmed', 'Rescheduled', 'Voicemail', 'No Answer'];

export default function Calls() {
  const [isTwilioModalOpen, setIsTwilioModalOpen] = useState(false);
  const [twilioForm, setTwilioForm] = useState({ name: '', phone: '', purpose: 'appointment reminder', bookAppointment: false, apptDate: '', apptTime: '' });
  const [notification, setNotification] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [queue, setQueue] = useState(CALL_QUEUE);
  const [history, setHistory] = useState(CALL_HISTORY);
  const [stats, setStats] = useState({ total: 47, completed: 31, success: 26, failed: 5, avgDuration: '2:12' });

  // Sync Persistent Queue from Backend
  useEffect(() => {
    const syncQueue = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('aura_session') || '{}');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/queue?email=${user.email || ''}`);
        if (response.ok) {
          const data = await response.json();
          setQueue(data);
        }
      } catch (e) {
        console.error("Queue sync error:", e);
      }
    };
    syncQueue();
    const interval = setInterval(syncQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sync History and Stats from Backend
  useEffect(() => {
    const syncData = async () => {
      if (isPaused) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/logs`);
        if (response.ok) {
          const data = await response.json();
          // Transform backend logs to history format
          const formatted = data.map(log => ({
            id: log.id,
            name: log.patient_name,
            outcome: log.tags.includes('Confirmed') ? 'Confirmed' : log.tags.includes('Reschedule') ? 'Rescheduled' : 'Completed',
            duration: log.duration,
            time: log.date ? new Date(log.date.endsWith('Z') ? log.date : log.date + 'Z').toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'Just Now'
          })).reverse().slice(0, 10);
          setHistory(formatted);
          setStats(prev => ({ ...prev, completed: data.length }));
        }
      } catch (e) {
        console.error("Error syncing history:", e);
      }
    };
    syncData();
    const interval = setInterval(syncData, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);
  

  const handleLiveCall = async (e) => {
    e.preventDefault();
    if (!twilioForm.name || !twilioForm.phone) return;

    // Phone Number Validation
    const phoneRegex = /^(\+?\d{1,4}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/;
    if (!phoneRegex.test(twilioForm.phone)) {
      setNotification({ message: 'Invalid phone number. Please enter a valid format.', type: 'error' });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    // Time Restriction (8 AM to 6 PM)
    if (twilioForm.bookAppointment) {
      if (!twilioForm.apptTime || twilioForm.apptTime < '08:00' || twilioForm.apptTime > '18:00') {
        setNotification({ message: 'Please select a time between 8 AM and 6 PM.', type: 'error' });
        setTimeout(() => setNotification(null), 5000);
        return;
      }
    }
    
    setIsCalling(true);
    try {
      const user = JSON.parse(localStorage.getItem('aura_session') || '{}');

      if (twilioForm.bookAppointment) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: twilioForm.name,
            type: twilioForm.purpose,
            date: twilioForm.apptDate,
            time: twilioForm.apptTime,
            duration: 30,
            status: 'confirmed',
            phone: twilioForm.phone,
            user_email: user.email
          })
        });
      }

      const queueResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: twilioForm.name,
          phone: twilioForm.phone,
          type: "Outbound AI Call",
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          user_email: user.email
        })
      });

      if (!queueResponse.ok) throw new Error('Failed to save to queue');

      // 2. Real Twilio Call (if applicable)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: twilioForm.name, phone: twilioForm.phone, purpose: twilioForm.purpose })
      });
      const data = await response.json();
      
      if (data.status === 'error') {
        setNotification({ message: `Queue Saved, but Call Failed: ${data.message}`, type: 'error' });
        setTimeout(() => setNotification(null), 8000);
      } else {
        const msg = twilioForm.bookAppointment 
          ? 'Success! Appointment saved and call initiated.' 
          : 'Success! Call initiated.';
        setNotification({ message: msg, type: 'success' });
        setTimeout(() => setNotification(null), 5000);
      }

      // 3. Save Log
      const durationStr = `${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 60)}s`;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: twilioForm.name,
          duration: durationStr,
          tags: ["Live", "AI Agent"],
          summary: data.message,
          call_type: "Outbound",
          transcript: [{ speaker: "System", time: "0:01", text: "Task created in queue." }]
        })
      });

      setIsTwilioModalOpen(false);
      setTwilioForm({ name: '', phone: '', purpose: 'appointment reminder', bookAppointment: false, apptDate: '', apptTime: '' });
    } catch (error) {
      console.error('Error:', error);
      setNotification({ message: 'Failed to process request.', type: 'error' });
    }
    setIsCalling(false);
  };

  const handleAddToQueueOnly = async () => {
    if (!twilioForm.name || !twilioForm.phone) return;

    // Phone Number Validation
    const phoneRegex = /^(\+?\d{1,4}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/;
    if (!phoneRegex.test(twilioForm.phone)) {
      setNotification({ message: 'Invalid phone number. Please enter a valid format.', type: 'error' });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    // Time Restriction (8 AM to 6 PM)
    if (twilioForm.bookAppointment) {
      if (!twilioForm.apptTime || twilioForm.apptTime < '08:00' || twilioForm.apptTime > '18:00') {
        setNotification({ message: 'Please select a time between 8 AM and 6 PM.', type: 'error' });
        setTimeout(() => setNotification(null), 5000);
        return;
      }
    }

    setIsCalling(true);
    try {
      const user = JSON.parse(localStorage.getItem('aura_session') || '{}');

      if (twilioForm.bookAppointment) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: twilioForm.name,
            type: twilioForm.purpose,
            date: twilioForm.apptDate,
            time: twilioForm.apptTime,
            duration: 30,
            status: 'confirmed',
            phone: twilioForm.phone,
            user_email: user.email
          })
        });
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: twilioForm.name,
          phone: twilioForm.phone,
          type: "Queued for later",
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          user_email: user.email
        })
      });
      setNotification({ message: `Patient added to your persistent queue!`, type: 'success' });
      setTimeout(() => setNotification(null), 5000);
      setIsTwilioModalOpen(false);
      setTwilioForm({ name: '', phone: '', purpose: 'appointment reminder', bookAppointment: false, apptDate: '', apptTime: '' });
    } catch (e) {
      setNotification({ message: 'Failed to save appointment.', type: 'error' });
    }
    setIsCalling(false);
  };

  return (
    <div className="animate-fade-in content-padding" style={{ padding: '40px 48px', height: '100%', position: 'relative' }}>
      <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' }}>
      
      {/* Custom In-App Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={{ 
              position: 'fixed', 
              top: '24px', 
              left: '50%', 
              zIndex: 9999,
              background: notification.type === 'success' ? '#30D158' : '#FF453A',
              color: 'white',
              padding: '12px 24px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ padding: '40px 48px' }}>
      <header className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="text-gradient">Automated Outbound Calling</h1>
          <p className="text-muted" style={{ marginTop: '8px' }}>Monitor AI agents making calls, step in if required.</p>
        </div>
        <div className="flex-center" style={{ gap: '16px' }}>
          <button className="btn-primary" onClick={() => setIsPaused(!isPaused)} style={{ background: isPaused ? 'var(--success)' : 'var(--danger)', color: 'white' }}>
            {isPaused ? <><Play size={18} /> Resume Calling</> : <><Pause size={18} /> Pause All Calling</>}
          </button>
          <button className="btn-accent" onClick={() => setIsTwilioModalOpen(true)} style={{ background: '#FFFFFF', color: '#000000', border: 'none', boxShadow: 'var(--shadow-glow)', padding: '12px 24px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
            <PhoneOutgoing size={18} /> Call Patient
          </button>
        </div>
      </header>

      {/* Live Stats Bar */}
      <div className="grid-4" style={{ marginBottom: '24px', gap: '16px' }}>
        {[
          { label: 'Total Queued', value: stats.total, icon: <Users size={18} color="var(--accent-color)" />, bg: 'rgba(209,209,214,0.08)' },
          { label: 'Completed', value: stats.completed, icon: <CheckCircle2 size={18} color="var(--success)" />, bg: 'rgba(48,209,88,0.08)' },
          { label: 'Success Rate', value: `${Math.round(stats.success / Math.max(stats.completed, 1) * 100)}%`, icon: <ArrowUpRight size={18} color="var(--success)" />, bg: 'rgba(48,209,88,0.08)' },
          { label: 'Avg Duration', value: stats.avgDuration, icon: <Clock size={18} color="var(--warning)" />, bg: 'rgba(255,159,10,0.08)' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ background: s.bg, border: '3px solid var(--glass-border)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '8px', background: 'var(--glass-bg)', borderRadius: '10px' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700 }}>{s.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* TWILIO MODAL */}
      <AnimatePresence>
        {isTwilioModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsTwilioModalOpen(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg-secondary)', border: '3px solid var(--glass-border)', borderRadius: '24px', width: '100%', maxWidth: '420px', padding: '40px', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(48,209,88,0.15) 0%, rgba(48,209,88,0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '2px solid rgba(48,209,88,0.2)' }}>
                  <PhoneOutgoing size={28} color="var(--success)" />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Call Patient</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>Enter the patient's details to initiate an automated AI call.</p>
              </div>
              
              <form onSubmit={handleLiveCall} className="flex-column" style={{ gap: '20px' }}>
                <div className="flex-column" style={{ gap: '8px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Patient Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      required
                      type="text" 
                      value={twilioForm.name}
                      onChange={(e) => setTwilioForm({...twilioForm, name: e.target.value})}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', borderRadius: '12px', padding: '14px 14px 14px 42px', color: 'white', fontSize: '15px', transition: 'border-color 0.2s' }} 
                      placeholder="E.g., John Doe"
                      onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                      onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                    />
                  </div>
                </div>
                <div className="flex-column" style={{ gap: '8px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Purpose of Call</label>
                  <select 
                    value={twilioForm.purpose} 
                    onChange={(e) => setTwilioForm({...twilioForm, purpose: e.target.value})}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', borderRadius: '12px', padding: '14px', color: 'white', fontSize: '15px', cursor: 'pointer' }}
                  >
                    <option value="appointment reminder" style={{ background: '#000' }}>Appointment Reminder</option>
                    <option value="procedure confirmation" style={{ background: '#000' }}>Procedure Confirmation</option>
                    <option value="clinical follow up" style={{ background: '#000' }}>Clinical Follow-up</option>
                    <option value="prescription refill update" style={{ background: '#000' }}>Prescription Refill Update</option>
                    <option value="imaging lab results" style={{ background: '#000' }}>Imaging Lab Results</option>
                    <option value="cardiology referral" style={{ background: '#000' }}>Cardiology Referral</option>
                    <option value="insurance verification" style={{ background: '#000' }}>Insurance Verification</option>
                    <option value="post operative check" style={{ background: '#000' }}>Post-Operative Check</option>
                  </select>
                </div>
                <div className="flex-column" style={{ gap: '8px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      required
                      type="tel" 
                      value={twilioForm.phone}
                      onChange={(e) => setTwilioForm({...twilioForm, phone: e.target.value})}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', borderRadius: '12px', padding: '14px 14px 14px 42px', color: 'white', fontSize: '15px', transition: 'border-color 0.2s' }} 
                      placeholder="+1 (555) 123-4567"
                      onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
                      onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                    />
                  </div>
                </div>

                <div className="flex-column" style={{ gap: '8px', marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'white' }}>
                    <input 
                      type="checkbox" 
                      checked={twilioForm.bookAppointment}
                      onChange={(e) => setTwilioForm({...twilioForm, bookAppointment: e.target.checked})}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-color)' }}
                    />
                    <span>Book Appointment & Save to Calendar</span>
                  </label>
                </div>

                {twilioForm.bookAppointment && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ display: 'flex', gap: '16px', marginTop: '4px' }}
                  >
                    <div className="flex-column" style={{ gap: '8px', flex: 1 }}>
                      <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Date</label>
                      <input 
                        required={twilioForm.bookAppointment}
                        type="date" 
                        value={twilioForm.apptDate}
                        onChange={(e) => setTwilioForm({...twilioForm, apptDate: e.target.value})}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', borderRadius: '12px', padding: '14px', color: 'white', fontSize: '15px' }} 
                      />
                    </div>
                    <div className="flex-column" style={{ gap: '8px', flex: 1 }}>
                      <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Time</label>
                      <input 
                        required={twilioForm.bookAppointment}
                        type="time" 
                        min="08:00"
                        max="18:00"
                        value={twilioForm.apptTime}
                        onChange={(e) => setTwilioForm({...twilioForm, apptTime: e.target.value})}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', borderRadius: '12px', padding: '14px', color: 'white', fontSize: '15px' }} 
                      />
                    </div>
                  </motion.div>
                )}
                                <div className="flex-column" style={{ gap: '12px', marginTop: '8px' }}>
                  <button 
                    type="submit" 
                    disabled={isCalling} 
                    style={{ width: '100%', padding: '16px', borderRadius: '14px', background: isCalling ? 'var(--text-muted)' : 'var(--success)', border: 'none', color: 'white', fontWeight: 700, fontSize: '16px', cursor: isCalling ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: isCalling ? 'none' : '0 4px 20px rgba(48,209,88,0.4)', transition: 'all 0.2s' }}
                  >
                    <PhoneOutgoing size={18} />
                    {isCalling ? 'Processing...' : 'Initiate AI Call Now'}
                  </button>

                  <button 
                    type="button" 
                    onClick={handleAddToQueueOnly}
                    disabled={isCalling}
                    style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '2px solid var(--glass-border)', color: 'white', fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    <CalendarIcon size={18} color="var(--accent-color)" />
                    Save & Add to Queue Only
                  </button>

                  <button type="button" onClick={() => setIsTwilioModalOpen(false)} style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Live Calls Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <CallSimulator id={1} name="Robert Fox" intent="Appointment Reschedule" script={RESCHEDULE_SCRIPT} defaultStatus="In Progress" paused={isPaused} />
        <CallSimulator id={2} name="Esther Howard" intent="General Query" script={FALLBACK_SCRIPT} defaultStatus="In Progress" paused={isPaused} />
        <CallSimulator id={3} name="Liam Sterling" intent="Appointment Confirmation" script={CONFIRMATION_SCRIPT} defaultStatus="In Progress" paused={isPaused} />
      </div>

      {/* Bottom: Queue + History */}
      <div className="grid-2" style={{ gap: '24px' }}>
        {/* Call Queue */}
        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3>Call Queue</h3>
            <span className="badge badge-accent" style={{ gap: '4px' }}>{queue.length} Waiting</span>
          </div>
          <div className="flex-column" style={{ gap: '10px', maxHeight: '320px', overflowY: 'auto', paddingRight: '6px' }}>
            {queue.map((q, i) => (
              <div key={q.id} className="flex-between" style={{ padding: '12px 14px', background: 'var(--glass-bg)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                <div className="flex-center" style={{ gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{q.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{q.type}</div>
                  </div>
                </div>
                <div className="flex-center" style={{ gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{q.time}</span>
                  <button 
                    onClick={async () => {
                      if (confirm('Cancel this appointment?')) {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/queue/${q.id}`, { method: 'DELETE' });
                        if (response.ok) {
                          setNotification({ message: 'Appointment cancelled successfully', type: 'success' });
                          setTimeout(() => setNotification(null), 3000);
                        }
                      }
                    }}
                    style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
            {queue.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Queue empty.</div>}
          </div>
        </motion.div>

        {/* Call History */}
        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3>Recent Call History</h3>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>{history.length} Calls</span>
          </div>
          <div className="flex-column" style={{ gap: '10px', maxHeight: '320px', overflowY: 'auto', paddingRight: '6px' }}>
            {history.map((h, i) => (
              <div key={i} className="flex-between" style={{ padding: '12px 14px', background: 'var(--glass-bg)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                <div className="flex-center" style={{ gap: '12px' }}>
                  <div className="flex-center" style={{ width: '32px', height: '32px', borderRadius: '50%', background: h.outcome === 'Confirmed' ? 'rgba(48,209,88,0.1)' : h.outcome === 'Rescheduled' ? 'rgba(255,159,10,0.1)' : 'rgba(255,255,255,0.05)' }}>
                    {h.outcome === 'Confirmed' ? <CheckCircle2 size={14} color="var(--success)" /> : h.outcome === 'Rescheduled' ? <CalendarIcon size={14} color="var(--warning)" /> : <PhoneOff size={14} color="var(--text-muted)" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{h.name}</div>
                    <div style={{ fontSize: '12px', color: h.outcome === 'Confirmed' ? 'var(--success)' : h.outcome === 'Rescheduled' ? 'var(--warning)' : 'var(--text-muted)' }}>{h.outcome}</div>
                  </div>
                </div>
                <div className="flex-center" style={{ gap: '12px' }}>
                  <div className="flex-column" style={{ alignItems: 'flex-end', gap: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{h.duration}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{h.time}</span>
                  </div>
                  <button 
                    onClick={async () => {
                      if (h.id && confirm('Delete this record?')) {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/logs/${h.id}`, { method: 'DELETE' });
                        if (response.ok) {
                          setNotification({ message: 'Call record deleted from database', type: 'success' });
                          setTimeout(() => setNotification(null), 3000);
                        }
                      } else {
                        setHistory(prev => prev.filter((_, idx) => idx !== i));
                      }
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      </div>
      </div>
      </div>
  );
}

function CallSimulator({ id, name, intent, script, defaultStatus, paused }) {
  const [currentScript, setCurrentScript] = useState(script);
  const [currentName, setCurrentName] = useState(name);
  const [currentIntent, setCurrentIntent] = useState(intent);
  const [lines, setLines] = useState([script[0]]);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState(defaultStatus);
  const [duration, setDuration] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const scrollRef = useRef(null);

  // Timer
  useEffect(() => {
    if (isFinished || paused || status === 'Agent Handled') return;
    const interval = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, [isFinished, paused, status]);

  // Script Runner
  useEffect(() => {
    if (step >= currentScript.length || paused || status === 'Agent Handled') return;
    const currentLine = currentScript[step];
    
    if (currentLine.speaker === 'AI') {
      // Audio simulation disabled to prevent overlapping with manual playback
    }
    
    const timer = setTimeout(() => {
      setLines(prev => [...prev, currentLine]);
      
      if (currentLine.fallback) {
        setStatus('Agent Fallback');
        setIsFinished(true);
        setTimeout(() => {
          const idx = Math.floor(Math.random() * ALL_SCRIPTS.length);
          const newScript = ALL_SCRIPTS[idx];
          setCurrentScript(newScript);
          setCurrentName(ALL_NAMES[Math.floor(Math.random() * ALL_NAMES.length)]);
          setCurrentIntent(ALL_INTENTS[idx % ALL_INTENTS.length]);
          setLines([newScript[0]]);
          setStep(1);
          setStatus(defaultStatus);
          setDuration(0);
          setIsFinished(false);
          setRestartKey(k => k + 1);
        }, 6000);
      } else if (currentLine.end) {
        setStatus('Completed Successfully');
        setIsFinished(true);
        setTimeout(() => {
          const idx = Math.floor(Math.random() * ALL_SCRIPTS.length);
          const newScript = ALL_SCRIPTS[idx];
          setCurrentScript(newScript);
          setCurrentName(ALL_NAMES[Math.floor(Math.random() * ALL_NAMES.length)]);
          setCurrentIntent(ALL_INTENTS[idx % ALL_INTENTS.length]);
          setLines([newScript[0]]);
          setStep(1);
          setStatus(defaultStatus);
          setDuration(0);
          setIsFinished(false);
          setRestartKey(k => k + 1);
        }, 5000);
      } else {
        setStep(s => s + 1);
      }
    }, currentLine.delay || 1000);

    return () => clearTimeout(timer);
  }, [step, currentScript, paused, status]);

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleTakeOver = () => {
    setStatus('Agent Handled');
    setLines(prev => [...prev, { speaker: 'System', text: 'Human Agent Joined the Call.', icon: <User size={14}/>, color: 'var(--accent-color)' }]);
    
    setTimeout(() => {
      const idx = Math.floor(Math.random() * ALL_SCRIPTS.length);
      const newScript = ALL_SCRIPTS[idx];
      setCurrentScript(newScript);
      setCurrentName(ALL_NAMES[Math.floor(Math.random() * ALL_NAMES.length)]);
      setCurrentIntent(ALL_INTENTS[idx % ALL_INTENTS.length]);
      setLines([newScript[0]]);
      setStep(1);
      setStatus(defaultStatus);
      setDuration(0);
      setIsFinished(false);
      setRestartKey(k => k + 1);
    }, 5000);
  };
  const formatDuration = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  let borderColor = 'var(--accent-color)';
  if (status === 'Agent Fallback') borderColor = 'var(--warning)';
  if (status === 'Completed Successfully' || status === 'Agent Handled') borderColor = 'var(--success)';

  return (
    <motion.div 
      className="glass-card flex-column"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ 
        borderTop: '1px solid var(--glass-border)', 
        borderRight: '1px solid var(--glass-border)', 
        borderBottom: '1px solid var(--glass-border)', 
        borderLeft: `4px solid ${borderColor}`, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '450px', 
        background: 'rgba(10, 10, 12, 0.7)' 
      }}
    >
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div className="flex-center" style={{ gap: '16px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}>
            <User size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{currentName}</h3>
            <div className="flex-center" style={{ gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
              <span className="flex-center" style={{ gap: '4px', color: paused ? 'var(--text-muted)' : borderColor }}>
                <Activity size={14} /> {paused ? 'Paused' : status}
              </span>
              • {formatDuration(duration)}
            </div>
          </div>
        </div>
        <div className="flex-center" style={{ gap: '12px' }}>
          {status === 'In Progress' && !paused && (
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: 'var(--radius-full)' }} onClick={handleTakeOver}>
              Take Over
            </button>
          )}
          
          <AnimatePresence>
            {status === 'Agent Fallback' && (
              <motion.button 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                onClick={handleTakeOver}
                className="btn-primary" 
                style={{ background: 'var(--warning)', color: 'black', animation: 'pulse 1.5s infinite' }}
              >
                Take Over Call
              </motion.button>
            )}
          </AnimatePresence>

          {(status === 'Completed Successfully' || status === 'Agent Handled') && (
            <div style={{ color: 'var(--success)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <CheckCircle2 size={18}/> Done
            </div>
          )}

          {!isFinished && status !== 'Agent Fallback' && (
            <button className="btn-icon" style={{ color: 'var(--danger)', borderColor: 'rgba(255,69,58,0.3)' }}><PhoneOff size={18} /></button>
          )}
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '16px', border: '1px solid var(--glass-border)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Live Transcript</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Initial Intent: {currentIntent}</div>
        </div>
        
        <div ref={scrollRef} className="flex-column" style={{ gap: '16px', overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
          <AnimatePresence>
            {lines.map((line, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}
              >
                {line.speaker === 'System' ? (
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '8px', width: '100%', display: 'flex', gap: '8px', color: line.color || 'var(--text-muted)', fontSize: '13px', borderLeft: `2px solid ${line.color || 'var(--glass-border)'}` }}>
                    {line.icon} {line.text}
                  </div>
                ) : (
                  <>
                    <span style={{ color: line.speaker === 'AI' ? 'var(--accent-color)' : 'white', fontWeight: 600, minWidth: '40px', paddingTop: '2px' }}>
                      {line.speaker}:
                    </span>
                    <span style={{ color: line.speaker === 'AI' ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: 1.5 }}>
                      {line.text}
                    </span>
                  </>
                )}
              </motion.div>
            ))}
            
            {!isFinished && (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 style={{ display: 'flex', gap: '12px' }}
               >
                 <span style={{ minWidth: '40px' }}></span>
                 <span style={{ width: '16px', height: '16px', background: 'var(--text-muted)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1s infinite' }}></span>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.7; }
        }
      `}} />
    </motion.div>
  );
}
