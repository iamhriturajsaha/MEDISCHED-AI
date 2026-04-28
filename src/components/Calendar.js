'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, AlertTriangle, User, Clock, Calendar as CalendarIcon, X, Send, Activity, Trash2, Search, CheckCircle2, XCircle, Edit3, Phone, Mail, Video } from 'lucide-react';

const SERVICES = {
  'General Consultation': { duration: 60, color: '#2997ff' },
  'Specialist Visit': { duration: 60, color: '#a259ff' },
  'X-Ray Imaging': { duration: 30, color: '#34c759' },
  'MRI Scan': { duration: 90, color: '#ff9f0a' },
  'Ultrasound': { duration: 45, color: '#30d158' },
  'Blood Test / Phlebotomy': { duration: 15, color: '#ff453a' },
  'Physiotherapy': { duration: 60, color: '#bf5af2' },
  'Dental Checkup': { duration: 30, color: '#64d2ff' },
  'Vaccination': { duration: 15, color: '#ffd60a' },
  'Follow-up': { duration: 30, color: '#ff9f0a' },
};

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const dayAfter = new Date(Date.now() + 172800000).toISOString().split('T')[0];

const INITIAL_APPOINTMENTS = [
  { id: 1, name: 'John Doe', type: 'General Consultation', date: today, time: '09:00', duration: 60, status: 'confirmed', phone: '+1 (555) 234-5678', email: 'john.doe@email.com', notes: 'First visit. Complains of back pain.' },
  { id: 2, name: 'Alice Smith', type: 'Follow-up', date: today, time: '10:00', duration: 30, status: 'pending', phone: '+1 (555) 876-5432', email: 'alice.s@email.com', notes: 'Post-surgery follow-up. Check wound healing.' },
  { id: 3, name: 'Bob Johnson', type: 'X-Ray Imaging', date: today, time: '11:00', duration: 30, status: 'confirmed', phone: '+1 (555) 111-2233', email: 'bob.j@email.com', notes: 'Left knee x-ray ordered by Dr. Patel.' },
  { id: 4, name: 'Maria Garcia', type: 'Blood Test / Phlebotomy', date: today, time: '13:00', duration: 15, status: 'confirmed', phone: '+1 (555) 444-5566', email: 'maria.g@email.com', notes: 'Routine CBC and lipid panel.' },
  { id: 5, name: 'James Wilson', type: 'Physiotherapy', date: today, time: '14:00', duration: 60, status: 'pending', phone: '+1 (555) 777-8899', email: 'j.wilson@email.com', notes: 'Shoulder rehab session #4.' },
  { id: 6, name: 'Sarah Lee', type: 'Dental Checkup', date: today, time: '15:00', duration: 30, status: 'confirmed', phone: '+1 (555) 999-0011', email: 'sarah.lee@email.com', notes: 'Annual dental cleaning.' },
  { id: 7, name: 'David Chen', type: 'MRI Scan', date: tomorrow, time: '09:00', duration: 90, status: 'confirmed', phone: '+1 (555) 222-3344', email: 'd.chen@email.com', notes: 'Brain MRI. Claustrophobia — sedate if needed.' },
  { id: 8, name: 'Emily Brown', type: 'Vaccination', date: tomorrow, time: '11:00', duration: 15, status: 'pending', phone: '+1 (555) 555-6677', email: 'emily.b@email.com', notes: 'Flu shot + COVID booster.' },
  { id: 9, name: 'Michael Torres', type: 'Specialist Visit', date: dayAfter, time: '10:00', duration: 60, status: 'confirmed', phone: '+1 (555) 888-9900', email: 'm.torres@email.com', notes: 'Cardiology consult. History of arrhythmia.' },
  { id: 10, name: 'Lisa Anderson', type: 'Ultrasound', date: dayAfter, time: '14:00', duration: 45, status: 'confirmed', phone: '+1 (555) 333-4455', email: 'lisa.a@email.com', notes: 'Abdominal ultrasound. Fasting required.' },
];

function generateTimeSlots() {
  const slots = [];
  for (let i = 8; i <= 18; i++) {
    slots.push(`${i.toString().padStart(2, '0')}:00`);
    slots.push(`${i.toString().padStart(2, '0')}:30`);
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

export default function Calendar() {
  const [view, setView] = useState('Daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');

  const currentDateStr = currentDate.toISOString().split('T')[0];

  // Form State
  const [formData, setFormData] = useState({
    name: '', type: 'General Consultation', time: '09:00', date: currentDateStr, status: 'confirmed', phone: '', email: ''
  });

  // Keep modal date in sync if user navigates before opening
  useEffect(() => {
    if (!isModalOpen) {
      setFormData(prev => ({ ...prev, date: currentDateStr }));
    }
  }, [currentDateStr, isModalOpen]);

  const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  const monthYearStr = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'Daily') {
      newDate.setDate(currentDate.getDate() + direction);
    } else if (view === 'Weekly') {
      newDate.setDate(currentDate.getDate() + (direction * 7));
    } else {
      newDate.setMonth(currentDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch Appointments from Backend
  useEffect(() => {
    const fetchAppts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('aura_session') || '{}');
        const response = await fetch(`http://127.0.0.1:8080/api/appointments?email=${user.email || ''}`);
        if (response.ok) {
          const data = await response.json();
          // Fallback to initial if DB is empty for a better first experience
          setAppointments(data.length > 0 ? data : INITIAL_APPOINTMENTS);
        }
      } catch (e) {
        console.error("Error fetching appointments:", e);
      }
    };
    fetchAppts();
  }, []);

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    const duration = SERVICES[formData.type].duration;
    
    const newStart = parseTime(formData.time);
    const newEnd = newStart + duration;
    
    const dayAppointments = appointments.filter(a => a.date === formData.date);
    
    let hasConflict = false;
    for (let appt of dayAppointments) {
      const apptStart = parseTime(appt.time);
      const apptEnd = apptStart + appt.duration;
      if (newStart < apptEnd && newEnd > apptStart) {
        hasConflict = true;
        break;
      }
    }

    if (hasConflict) {
      const proceed = window.confirm("Warning: Overlap detected. Continue?");
      if (!proceed) return;
    }

    const user = JSON.parse(localStorage.getItem('aura_session') || '{}');
    const newAppt = {
      name: formData.name,
      type: formData.type,
      date: formData.date,
      time: formData.time,
      duration: duration,
      status: hasConflict ? 'conflict' : formData.status,
      user_email: user.email,
      notes: "",
      phone: formData.phone || "+1 (555) 000-0000",
      email: formData.email || "patient@example.com"
    };

    try {
      const response = await fetch('http://127.0.0.1:8080/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppt)
      });
      if (response.ok) {
        const savedAppt = await response.json();
        setAppointments([...appointments, savedAppt]);
        setIsModalOpen(false);
        setFormData({ name: '', type: 'General Consultation', time: '09:00', date: currentDateStr, status: 'confirmed', phone: '', email: '' });
        showToast("Appointment saved to database");
      }
    } catch (e) {
      showToast("Error saving appointment");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/appointments/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setAppointments(appointments.filter(a => a.id !== id));
        if (selectedAppt?.id === id) setSelectedAppt(null);
        showToast("Appointment deleted");
      }
    } catch (e) {
      showToast("Error deleting appointment");
    }
  };

  const handleRemind = async (patientName) => {
    try {
      showToast(`AI agent calling ${patientName}...`);
      const appt = appointments.find(a => a.name === patientName);
      const phone = appt?.phone || "+1 (555) 000-0000";

      await fetch('http://127.0.0.1:8080/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: patientName, 
          phone: phone,
          message: `Reminder for upcoming appointment with MediSched AI.`
        })
      });
      showToast("Reminder sent successfully");
    } catch (e) {
      showToast("Error sending reminder");
    }
  };

  const handleToggleStatus = async (id) => {
    const appt = appointments.find(a => a.id === id);
    if (!appt) return;
    const nextStatus = appt.status === 'confirmed' ? 'pending' : 'confirmed';
    
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (response.ok) {
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: nextStatus } : a));
        if (selectedAppt?.id === id) setSelectedAppt(prev => ({...prev, status: nextStatus}));
        showToast('Status updated');
      }
    } catch (e) {
      showToast('Error updating status');
    }
  };

  const handleSaveNotes = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/appointments/${selectedAppt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: tempNotes })
      });
      if (response.ok) {
        setAppointments(appointments.map(a => a.id === selectedAppt.id ? { ...a, notes: tempNotes } : a));
        setSelectedAppt(prev => ({ ...prev, notes: tempNotes }));
        setEditingNotes(false);
        showToast('Notes saved');
      }
    } catch (e) {
      showToast('Error saving notes');
    }
  };

  function parseTime(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  // --- View Data Generators ---
  const filteredAppointments = appointments.filter(a => {
    const matchSearch = !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const currentDayAppointments = filteredAppointments.filter(a => a.date === currentDateStr).sort((a, b) => parseTime(a.time) - parseTime(b.time));

  const todayStats = {
    total: appointments.filter(a => a.date === currentDateStr).length,
    confirmed: appointments.filter(a => a.date === currentDateStr && a.status === 'confirmed').length,
    pending: appointments.filter(a => a.date === currentDateStr && a.status === 'pending').length,
  };

  function getWeekDates() {
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay(); 
    return Array.from({length: 7}).map((_, i) => new Date(curr.getFullYear(), curr.getMonth(), first + i));
  }
  const weekDates = getWeekDates();

  function getMonthData() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }
  const monthData = getMonthData();

  return (
    <div className="animate-fade-in content-padding" style={{ padding: '40px 48px', position: 'relative', height: '900px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: '50%', 
              zIndex: 9999,
              background: '#30D158',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '12px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              pointerEvents: 'none'
            }}
          >
            <CheckCircle2 size={20} />
            <span style={{ letterSpacing: '0.01em' }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header style={{ marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div>
            <h1 className="text-gradient">Smart Calendar</h1>
            <p className="text-muted" style={{ marginTop: '8px' }}>Manage appointments, detect conflicts, and send reminders.</p>
          </div>
          <div className="flex-center" style={{ gap: '16px' }}>
            <div style={{ background: 'var(--glass-bg)', border: '2px solid var(--glass-border)', borderRadius: '8px', padding: '4px', display: 'flex' }}>
              {['Daily', 'Weekly', 'Monthly'].map(v => (
                <button 
                  key={v}
                  onClick={() => setView(v)}
                  style={{ 
                    padding: '6px 16px', 
                    borderRadius: '6px', 
                    background: view === v ? 'var(--glass-hover)' : 'transparent',
                    color: view === v ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: view === v ? 600 : 500,
                    transition: 'all 0.2s'
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
            <button className="btn-accent" onClick={() => setIsModalOpen(true)} style={{ background: '#FFFFFF', color: '#000000', border: 'none', boxShadow: 'var(--shadow-glow)', padding: '12px 24px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
              <Plus size={18} /> Make an Appointment
            </button>
          </div>
        </div>
        {/* Search & Filter Bar */}
        <div className="flex-center" style={{ gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search patients or service..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', background: 'var(--glass-bg)', border: '2px solid var(--glass-border)', padding: '10px 14px 10px 40px', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '14px' }} />
          </div>
          {['all', 'confirmed', 'pending'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '8px 16px', borderRadius: '8px', background: filterStatus === s ? (s === 'confirmed' ? 'rgba(48,209,88,0.15)' : s === 'pending' ? 'rgba(255,159,10,0.15)' : 'rgba(255,255,255,0.1)') : 'transparent', color: filterStatus === s ? (s === 'confirmed' ? 'var(--success)' : s === 'pending' ? 'var(--warning)' : 'white') : 'var(--text-muted)', border: '2px solid var(--glass-border)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}>
              {s === 'all' ? `All (${todayStats.total})` : s === 'confirmed' ? `Confirmed (${todayStats.confirmed})` : `Pending (${todayStats.pending})`}
            </button>
          ))}
        </div>
      </header>

      <motion.div 
        className="glass-panel flex-column" 
        style={{ flex: 1, padding: '24px', overflow: 'hidden' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex-between" style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid var(--glass-border)' }}>
          <div className="flex-center" style={{ gap: '16px' }}>
            <button className="btn-icon" onClick={() => navigateDate(-1)}><ChevronLeft size={20} /></button>
            <h2 style={{ fontSize: '20px', minWidth: '220px', textAlign: 'center' }}>
              {view === 'Daily' ? formattedDate : view === 'Weekly' ? `Week of ${weekDates[0].toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}` : monthYearStr}
            </h2>
            <button className="btn-icon" onClick={() => navigateDate(1)}><ChevronRight size={20} /></button>
            <button className="btn-icon" style={{ fontSize: '12px', width: 'auto', padding: '0 12px' }} onClick={() => setCurrentDate(new Date())}>Today</button>
          </div>
          <div className="flex-center" style={{ gap: '12px' }}>
            <span className="badge badge-success">{todayStats.confirmed} Confirmed</span>
            <span className="badge" style={{ background: 'rgba(255,159,10,0.15)', color: 'var(--warning)' }}>{todayStats.pending} Pending</span>
            <span className="badge badge-danger">{filteredAppointments.filter(a => a.status === 'conflict').length} Conflicts</span>
          </div>
        </div>

        {/* --- DAILY VIEW --- */}
        {view === 'Daily' && (
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '12px' }}>
            {TIME_SLOTS.map((time) => {
              const slotAppointments = currentDayAppointments.filter(a => a.time === time);
              const isHour = time.endsWith(':00');
              if (!isHour && slotAppointments.length === 0) return null;

              return (
                <div key={time} style={{ display: 'flex', gap: '24px', minHeight: '80px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', paddingTop: '16px', flexShrink: 0 }}>
                  <div style={{ width: '80px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '14px', paddingTop: '8px' }}>{time}</div>
                  
                  <div style={{ flex: 1, display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    {slotAppointments.length === 0 && isHour && (
                      <div 
                        onClick={() => { setFormData({ ...formData, time, date: currentDateStr }); setIsModalOpen(true); }}
                        style={{ width: '100%', height: '100%', minHeight: '60px', border: '1px dashed var(--glass-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 24px', color: 'var(--text-muted)', opacity: 0.5, cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = 'var(--glass-hover)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.background = 'transparent'; }}
                      >
                        <Plus size={14} style={{ marginRight: '8px' }} /> Available Slot
                      </div>
                    )}
                    {slotAppointments.map(appt => (
                      <AppointmentCard 
                        key={appt.id} 
                        appointment={appt} 
                        onRemind={() => handleRemind(appt.name)} 
                        onDelete={() => handleDelete(appt.id)}
                        onToggleStatus={() => handleToggleStatus(appt.id)}
                        onSelect={() => { setSelectedAppt(appt); setTempNotes(appt.notes || ''); setEditingNotes(false); }}
                        isSelected={selectedAppt?.id === appt.id}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- WEEKLY VIEW --- */}
        {view === 'Weekly' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', flex: 1, overflowY: 'auto' }}>
            {weekDates.map((date, i) => {
              const dayStr = date.toISOString().split('T')[0];
              const dayAppts = appointments.filter(a => a.date === dayStr).sort((a,b) => parseTime(a.time) - parseTime(b.time));
              const isToday = dayStr === new Date().toISOString().split('T')[0];

              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderRight: i < 6 ? '2px solid var(--glass-border)' : 'none', paddingRight: i < 6 ? '12px' : '0' }}>
                  <div style={{ textAlign: 'center', padding: '12px', background: isToday ? 'var(--glass-hover)' : 'transparent', borderRadius: '8px', borderBottom: isToday ? '2px solid var(--accent-color)' : '2px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: isToday ? 'var(--accent-color)' : 'white' }}>{date.getDate()}</div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                    {dayAppts.map(appt => (
                      <div key={appt.id} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', borderLeft: `3px solid ${SERVICES[appt.type]?.color || 'white'}`, fontSize: '12px' }}>
                        <div style={{ fontWeight: 600 }}>{appt.time}</div>
                        <div style={{ color: 'var(--text-muted)' }}>{appt.name}</div>
                      </div>
                    ))}
                    <button 
                      onClick={() => { setFormData({ ...formData, date: dayStr }); setIsModalOpen(true); }}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px dashed var(--glass-border)', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', background: 'transparent' }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- MONTHLY VIEW --- */}
        {view === 'Monthly' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)', fontSize: '14px' }}>{d}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', flex: 1 }}>
              {monthData.map((date, i) => {
                if (!date) return <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}></div>;
                
                const dayStr = date.toISOString().split('T')[0];
                const dayAppts = appointments.filter(a => a.date === dayStr);
                const isToday = dayStr === new Date().toISOString().split('T')[0];

                return (
                  <div 
                    key={i} 
                    onClick={() => { setCurrentDate(date); setView('Daily'); }}
                    style={{ 
                      background: 'var(--glass-bg)', 
                      border: isToday ? '1px solid var(--accent-color)' : '2px solid var(--glass-border)', 
                      borderRadius: '8px', 
                      padding: '8px',
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--glass-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--glass-bg)'}
                  >
                    <div style={{ fontWeight: 600, color: isToday ? 'var(--accent-color)' : 'white', marginBottom: '8px' }}>{date.getDate()}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {dayAppts.slice(0, 3).map(appt => (
                         <div key={appt.id} style={{ fontSize: '10px', padding: '2px 4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                           {appt.time} {appt.name}
                         </div>
                      ))}
                      {dayAppts.length > 3 && (
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>+{dayAppts.length - 3} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </motion.div>

      {/* Patient Detail Sidebar */}
      <AnimatePresence>
        {selectedAppt && (
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} style={{ position: 'fixed', top: 0, right: 0, width: '380px', height: '100vh', background: 'var(--bg-secondary)', borderLeft: '2px solid var(--glass-border)', padding: '32px', zIndex: 50, overflowY: 'auto', boxShadow: '-20px 0 60px rgba(0,0,0,0.5)' }}>
            <div className="flex-between" style={{ marginBottom: '24px' }}>
              <h3>Patient Details</h3>
              <button className="btn-icon" onClick={() => setSelectedAppt(null)}><X size={18} /></button>
            </div>
            <div className="flex-center" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(41,151,255,0.1)', color: 'var(--accent-color)', marginBottom: '16px' }}><User size={28} /></div>
            <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>{selectedAppt.name}</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              <span className={`badge ${selectedAppt.status === 'confirmed' ? 'badge-success' : 'badge-accent'}`} style={{ cursor: 'pointer' }} onClick={() => handleToggleStatus(selectedAppt.id)}>{selectedAppt.status === 'confirmed' ? <><CheckCircle2 size={12} /> Confirmed</> : <><Clock size={12} /> Pending</>}</span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>{selectedAppt.type}</span>
            </div>
            <div className="flex-column" style={{ gap: '16px', marginBottom: '24px' }}>
              <div className="flex-center" style={{ gap: '12px', justifyContent: 'flex-start' }}><CalendarIcon size={16} color="var(--text-muted)" /><span style={{ fontSize: '14px' }}>{selectedAppt.date} at {selectedAppt.time}</span></div>
              <div className="flex-center" style={{ gap: '12px', justifyContent: 'flex-start' }}><Clock size={16} color="var(--text-muted)" /><span style={{ fontSize: '14px' }}>{selectedAppt.duration} minutes</span></div>
              {selectedAppt.phone && <div className="flex-center" style={{ gap: '12px', justifyContent: 'flex-start' }}><Phone size={16} color="var(--text-muted)" /><span style={{ fontSize: '14px' }}>{selectedAppt.phone}</span></div>}
              {selectedAppt.email && <div className="flex-center" style={{ gap: '12px', justifyContent: 'flex-start' }}><Mail size={16} color="var(--text-muted)" /><span style={{ fontSize: '14px' }}>{selectedAppt.email}</span></div>}
              <div className="flex-center" style={{ gap: '12px', justifyContent: 'flex-start', marginTop: '12px', padding: '12px', background: 'rgba(41,151,255,0.05)', borderRadius: '8px', border: '1px solid rgba(41,151,255,0.2)' }}>
                <Video size={18} style={{ color: '#2997ff' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Telehealth Access</span>
                  {selectedAppt.meetLink ? (
                    <a href={selectedAppt.meetLink} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#2997ff', textDecoration: 'underline', wordBreak: 'break-all' }}>
                      {selectedAppt.meetLink}
                    </a>
                  ) : (
                    <button 
                      onClick={() => {
                        const link = `https://meet.google.com/abc-defg-${Math.random().toString(36).substring(2, 5)}`;
                        setAppointments(appointments.map(a => a.id === selectedAppt.id ? { ...a, meetLink: link } : a));
                        setSelectedAppt(prev => ({ ...prev, meetLink: link }));
                        showToast('Google Meet link generated!');
                      }}
                      style={{ background: 'none', border: 'none', color: '#2997ff', fontSize: '13px', fontWeight: 600, padding: 0, textAlign: 'left', cursor: 'pointer' }}
                    >
                      + Generate Google Meet Link
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div className="flex-between" style={{ marginBottom: '8px' }}><h4 style={{ fontSize: '14px' }}>Clinical Notes</h4><button onClick={() => { if (editingNotes) handleSaveNotes(); else { setTempNotes(selectedAppt.notes || ''); setEditingNotes(true); }}} style={{ fontSize: '12px', color: editingNotes ? 'var(--success)' : 'var(--accent-color)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>{editingNotes ? <><CheckCircle2 size={12} /> Save</> : <><Edit3 size={12} /> Edit</>}</button></div>
              {editingNotes ? <textarea value={tempNotes} onChange={e => setTempNotes(e.target.value)} style={{ width: '100%', minHeight: '100px', background: 'var(--glass-bg)', border: '2px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px', resize: 'vertical' }} /> : <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--glass-bg)', padding: '12px', borderRadius: '8px' }}>{selectedAppt.notes || 'No notes.'}</p>}
            </div>
            <div className="flex-column" style={{ gap: '8px' }}>
              <button onClick={() => handleRemind(selectedAppt.name)} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '2px solid var(--glass-border)', color: 'white', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Send size={14} /> Send Reminder</button>
              <button onClick={() => { handleDelete(selectedAppt.id); }} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,69,58,0.1)', border: '1px solid rgba(255,69,58,0.2)', color: 'var(--danger)', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Trash2 size={14} /> Cancel Appointment</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '32px', boxShadow: 'var(--shadow-glass)' }}
            >
              <div className="flex-between" style={{ marginBottom: '24px' }}>
                <h2>Schedule Appointment</h2>
                <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
              </div>

              <form onSubmit={handleAddAppointment} className="flex-column" style={{ gap: '20px' }}>
                <div className="flex-column" style={{ gap: '8px' }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Patient Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ background: 'var(--bg-primary)', border: '2px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white' }} 
                    placeholder="E.g., Jane Doe"
                  />
                </div>

                <div className="grid-2" style={{ gap: '16px' }}>
                  <div className="flex-column" style={{ gap: '8px' }}>
                    <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      style={{ background: 'var(--bg-primary)', border: '2px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white' }} 
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="flex-column" style={{ gap: '8px' }}>
                    <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      style={{ background: 'var(--bg-primary)', border: '2px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white' }} 
                      placeholder="patient@email.com"
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '16px' }}>
                  <div className="flex-column" style={{ gap: '8px' }}>
                    <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Service Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      style={{ background: 'var(--bg-primary)', border: '2px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white' }}
                    >
                      {Object.keys(SERVICES).map(s => <option key={s} value={s}>{s} ({SERVICES[s].duration}m)</option>)}
                    </select>
                  </div>
                  <div className="flex-column" style={{ gap: '8px' }}>
                    <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      style={{ background: 'var(--bg-primary)', border: '2px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white' }}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '16px' }}>
                  <div className="flex-column" style={{ gap: '8px' }}>
                    <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Date</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      style={{ background: 'var(--bg-primary)', border: '2px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white' }} 
                    />
                  </div>
                  <div className="flex-column" style={{ gap: '8px' }}>
                    <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Time Slot</label>
                    <select 
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      style={{ background: 'var(--bg-primary)', border: '2px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white' }}
                    >
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex-center" style={{ gap: '16px', marginTop: '16px' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'transparent', border: '2px solid var(--glass-border)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#30D158', border: 'none', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(48,209,88,0.4)', transition: 'all 0.2s' }}>Save Appointment</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AppointmentCard({ appointment, onRemind, onDelete, onToggleStatus, onSelect, isSelected }) {
  let bgColor = 'rgba(41, 151, 255, 0.1)';
  let borderColor = 'rgba(41, 151, 255, 0.3)';
  let textColor = SERVICES[appointment.type]?.color || 'var(--accent-color)';

  if (appointment.status === 'pending') {
    bgColor = 'rgba(255, 159, 10, 0.1)';
    borderColor = 'rgba(255, 159, 10, 0.3)';
    textColor = 'var(--warning)';
  } else if (appointment.status === 'conflict') {
    bgColor = 'rgba(255, 69, 58, 0.1)';
    borderColor = 'rgba(255, 69, 58, 0.3)';
    textColor = 'var(--danger)';
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onSelect}
      style={{ 
        background: bgColor, 
        border: isSelected ? '1px solid var(--accent-color)' : `1px solid ${borderColor}`, 
        borderRadius: '12px', 
        padding: '16px', 
        flex: 1,
        minWidth: '300px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isSelected ? '0 0 20px rgba(209,209,214,0.15)' : appointment.status === 'conflict' ? '0 0 15px rgba(255,69,58,0.2)' : 'none'
      }}
    >
      {appointment.status === 'conflict' && (
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '6px 12px', background: 'var(--danger)', color: 'white', borderBottomLeftRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertTriangle size={14} /> Overbooked
        </div>
      )}
      <div className="flex-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: 'white', fontWeight: 600, fontSize: '16px', marginBottom: '6px' }}>{appointment.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: textColor }}><Activity size={14} /> {appointment.type}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {appointment.duration} min</span>
            <span onClick={(e) => { e.stopPropagation(); onToggleStatus(); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: '2px 8px', borderRadius: '6px', background: appointment.status === 'confirmed' ? 'rgba(48,209,88,0.1)' : 'rgba(255,159,10,0.1)', color: appointment.status === 'confirmed' ? 'var(--success)' : 'var(--warning)', fontSize: '12px', fontWeight: 600 }}>{appointment.status === 'confirmed' ? <><CheckCircle2 size={12} /> Confirmed</> : <><Clock size={12} /> Pending</>}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={onRemind}
            title="Send SMS/Email Reminder"
            style={{ padding: '8px', background: 'var(--glass-bg)', borderRadius: '8px', color: 'var(--text-primary)', border: '2px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--glass-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--glass-bg)'}
          >
            <Send size={14} />
          </button>
          <button 
            onClick={onDelete}
            title="Cancel Appointment"
            style={{ padding: '8px', background: 'var(--glass-bg)', borderRadius: '8px', color: 'var(--danger)', border: '2px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,69,58,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--glass-bg)'}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
