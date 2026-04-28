'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Tag, Download, Play, Clock, User, Calendar, FileText, Trash2, CheckCircle2, XCircle, Activity, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_LOGS = [
  { id: 1, name: 'John Doe', date: 'Oct 27, 2026 - 10:30 AM', duration: '02:45', tags: ['Confirmed', 'Reschedule'], summary: 'Patient called to confirm their appointment for this Thursday. Successfully adjusted the time slot from 9 AM to 10:30 AM.', type: 'General Consultation', transcript: [
    { speaker: 'AI', time: '00:00', text: 'Hello, this is MediSched AI. Am I speaking with John Doe?' },
    { speaker: 'User', time: '00:04', text: 'Yes, this is John.' },
    { speaker: 'AI', time: '00:07', text: 'Hi John! I am calling to confirm your appointment this Thursday at 9:00 AM. Will you be able to make it?' },
    { speaker: 'User', time: '00:15', text: 'Actually, I have a meeting. Can we move it to 10:30?' },
    { speaker: 'AI', time: '00:21', text: 'Let me check our schedule. Yes, 10:30 AM is available. I have updated your appointment.' }
  ]},
  { id: 2, name: 'Alice Smith', date: 'Oct 27, 2026 - 09:15 AM', duration: '01:20', tags: ['Voicemail', 'Reminder'], summary: 'Left a voicemail regarding tomorrow\'s checkup appointment.', type: 'Follow-up', transcript: [
    { speaker: 'AI', time: '00:00', text: 'Hello Alice, this is MediSched AI calling to verify your procedure time.' },
    { speaker: 'System', time: '00:05', text: 'Beep. Voicemail recording started.' },
    { speaker: 'AI', time: '00:08', text: 'Please remember to fast for 8 hours prior to your arrival at 8:30 AM.' }
  ]},
  { id: 3, name: 'Esther Howard', date: 'Oct 26, 2026 - 04:45 PM', duration: '05:12', tags: ['Agent Fallback', 'Insurance'], summary: 'User requested details regarding complex Medicare pre-authorization. Escalated successfully to a human billing specialist.', type: 'Billing Query', transcript: [
    { speaker: 'AI', time: '00:00', text: 'Hello Esther, I am calling about your clinic load scheduling.' },
    { speaker: 'User', time: '00:04', text: 'Hi, I updated to Medicare Part B. Does this require pre-auth for the MRI?' },
    { speaker: 'AI', time: '00:12', text: 'Medicare coverage rules can be detailed. Let me transfer you directly to our human billing team.' }
  ]},
  { id: 4, name: 'Liam Sterling', date: 'Oct 25, 2026 - 02:15 PM', duration: '03:02', tags: ['Confirmed', 'Checkup'], summary: 'Confirmed routine dental hygiene appointment. No changes requested.', type: 'Dental Checkup', transcript: [
    { speaker: 'AI', time: '00:00', text: 'Good morning Liam, confirming your dental cleaning tomorrow.' },
    { speaker: 'User', time: '00:06', text: 'Yes, I am good to go. Thanks.' }
  ]}
];

export default function Logs() {
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('All');
  const [logsList, setLogsList] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null); // { message, type }

  // Fetch Logs from Backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/api/logs');
        const data = await response.json();
        setLogsList(data);
        if (data.length > 0) setSelectedLog(data[0]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Edit Notes State
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIdx, setCurrentLineIdx] = useState(-1);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  
  const transcriptContainerRef = useRef(null);

  useEffect(() => {
    if (currentLineIdx >= 0 && transcriptContainerRef.current) {
      const activeLine = document.getElementById(`transcript-line-${currentLineIdx}`);
      if (activeLine) {
        activeLine.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentLineIdx]);

  const tagsPool = ['All', 'Confirmed', 'Reschedule', 'Voicemail', 'Reminder', 'Agent Fallback', 'Insurance'];

  const filteredLogs = logsList.filter(log => {
    const matchesSearch = (log.patient_name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (log.summary || '').toLowerCase().includes(search.toLowerCase()) || 
                          (log.call_type || '').toLowerCase().includes(search.toLowerCase());
    const matchesTag = filterTag === 'All' || (log.tags || []).includes(filterTag);
    return matchesSearch && matchesTag;
  });

  // Sync edited summary when selection changes
  useEffect(() => {
    if (selectedLog) {
      setEditedSummary(selectedLog.summary);
      setIsEditingNotes(false);
      setIsPlaying(false);
      setCurrentLineIdx(-1);
      setPlaybackProgress(0);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [selectedLog]);

  // Playback Speech Synthesis Logic
  useEffect(() => {
    if (!isPlaying) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setCurrentLineIdx(-1);
      setPlaybackProgress(0);
      return;
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    
    let isMounted = true;
    const speakLine = (index) => {
      if (!isMounted || !isPlaying) return;
      
      const activeTranscript = (selectedLog && selectedLog.transcript && selectedLog.transcript.length > 1) 
        ? selectedLog.transcript 
        : [
            { speaker: 'AI', text: `Hello ${selectedLog?.patient_name || 'Patient'}, I am calling from MediSched regarding your recent profile activity.` },
            { speaker: 'User', text: 'Yes, thank you for following up.' },
            { speaker: 'AI', text: 'I have confirmed your data entries in our system. Have a great day!' }
          ];

      if (index >= activeTranscript.length) {
        setIsPlaying(false);
        return;
      }

      setCurrentLineIdx(index);
      setPlaybackProgress((index / activeTranscript.length) * 100);
      const line = activeTranscript[index];

      if (line.speaker === 'System') {
        setTimeout(() => {
          if (isMounted && isPlaying) speakLine(index + 1);
        }, 1500);
      } else {
        const textToSpeak = line.text.replace(/Medi-Sched|MediSched/gi, "Medi-Sked");
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        if (typeof window !== 'undefined') {
          if (!window._activeUtterances) window._activeUtterances = [];
          window._activeUtterances.push(utterance);
        }
        
        const voices = window.speechSynthesis.getVoices();
        const aiVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Zira')) || voices.find(v => v.lang.includes('en-GB')) || voices[0];
        const userVoice = voices.find(v => (v.name.includes('Male') || v.name.includes('Alex') || v.name.includes('Google US English Male') || v.name.includes('David')) && v.name !== aiVoice?.name) || voices.find(v => v.lang.includes('en-US') && v.name !== aiVoice?.name) || voices[voices.length - 1];
        
        if (line.speaker === 'AI' && aiVoice) {
          utterance.voice = aiVoice;
        } else if ((line.speaker === 'User' || line.speaker === 'Patient' || line.speaker === 'Provider') && userVoice) {
          utterance.voice = userVoice;
        }

        utterance.rate = 0.95; 
        utterance.pitch = line.speaker === 'AI' ? 1.1 : 1.0; 
        
        let fallbackTimer = setTimeout(() => {
          if (isMounted && isPlaying) {
            speakLine(index + 1);
          }
        }, 15000); 

        utterance.onend = () => {
          clearTimeout(fallbackTimer);
          if (isMounted && isPlaying) speakLine(index + 1);
        };
        utterance.onerror = () => {
          clearTimeout(fallbackTimer);
          if (isMounted && isPlaying) speakLine(index + 1);
        };

        window.speechSynthesis.speak(utterance);
      }
    };

    speakLine(0);

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, selectedLog]);

  const handleSaveNotes = () => {
    setLogsList(prev => prev.map(l => l.id === selectedLog.id ? { ...l, summary: editedSummary } : l));
    setSelectedLog(prev => ({ ...prev, summary: editedSummary }));
    setIsEditingNotes(false);
  };

  const handleDeleteLog = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this log?')) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/logs/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setLogsList(prev => prev.filter(l => l.id !== id));
        if (selectedLog?.id === id) setSelectedLog(null);
        setNotification({ message: 'Record deleted from database', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setNotification({ message: 'Error deleting record', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="animate-fade-in content-padding" style={{ padding: '40px 48px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Custom In-App Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={{ 
              position: 'fixed', 
              top: '24px', 
              left: '50%', 
              zIndex: 9999,
              background: notification.type === 'success' ? '#30D158' : '#FF453A',
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
            {notification.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            <span style={{ letterSpacing: '0.01em' }}>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <header className="flex-column" style={{ marginBottom: '40px', gap: '24px', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '32px' }}>Call Intelligence & Logs</h1>
          <p className="text-muted" style={{ marginTop: '8px' }}>Searchable transcripts, summaries, and auto-tagged notes.</p>
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', width: '100%' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search patient, summary, type..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '2px solid #FFFFFF', 
                borderRadius: '12px', 
                padding: '12px 16px 12px 48px',
                color: 'var(--text-primary)',
                width: '100%',
                fontSize: '14px'
              }} 
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {tagsPool.map(tag => (
              <button 
                key={tag}
                onClick={() => setFilterTag(tag)}
                style={{ 
                  padding: '10px 18px', 
                  borderRadius: '10px', 
                  background: filterTag === tag ? '#FFFFFF' : 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid #FFFFFF',
                  color: filterTag === tag ? '#000000' : 'var(--text-primary)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid-3" style={{ height: '650px', gap: '24px', overflow: 'hidden', marginBottom: '48px' }}>
        {/* Logs List */}
        <div className="glass-panel flex-column" style={{ height: '100%', maxHeight: '100%', overflow: 'hidden', border: '3px solid var(--glass-border)', padding: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
            {filteredLogs.map((log) => (
              <div 
                key={log.id} 
                onClick={() => setSelectedLog(log)}
                style={{ 
                  padding: '24px', 
                  borderBottom: '3px solid var(--glass-border)', 
                  background: selectedLog?.id === log.id ? 'var(--glass-hover)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '16px' }}>{log.patient_name}</h4>
                  <div className="flex-center" style={{ gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{log.duration}</span>
                    <button 
                      onClick={(e) => handleDeleteLog(e, log.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>{log.date}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(log.tags || []).map(tag => (
                    <span key={tag} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No logs found.</div>}
          </div>
        </div>

        {/* Log Details */}
        <div className="glass-panel" style={{ gridColumn: 'span 2', height: '100%', maxHeight: '100%', overflow: 'hidden', border: '3px solid var(--glass-border)', padding: 0 }}>
          <div style={{ height: '100%', overflowY: 'auto', padding: '32px' }}>
            {selectedLog && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={selectedLog.id}>
                <div className="flex-between" style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '3px solid var(--glass-border)' }}>
                <div className="flex-center" style={{ gap: '24px' }}>
                  <div className="flex-center" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(41, 151, 255, 0.1)', color: 'var(--accent-color)' }}>
                    <User size={32} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{selectedLog.patient_name}</h2>
                    <div className="flex-center" style={{ gap: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                      <span className="flex-center" style={{ gap: '6px' }}><Calendar size={16} /> {selectedLog.date}</span>
                      <span className="flex-center" style={{ gap: '6px' }}><Clock size={16} /> {selectedLog.duration}</span>
                      <span className="flex-center" style={{ gap: '6px' }}><FileText size={16} /> {selectedLog.call_type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-center" style={{ gap: '12px' }}>
                  <button 
                    onClick={() => {
                      if (!isPlaying) {
                        if (typeof window !== 'undefined' && window.speechSynthesis) {
                          window.speechSynthesis.cancel();
                          const unlock = new SpeechSynthesisUtterance('');
                          window.speechSynthesis.speak(unlock);
                        }
                      }
                      setIsPlaying(!isPlaying);
                    }} 
                    className="btn-primary" 
                    style={{ background: isPlaying ? 'rgba(255,69,58,0.2)' : 'rgba(255,255,255,0.1)', border: isPlaying ? '1px solid rgba(255,69,58,0.4)' : '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: 'var(--radius-full)', color: isPlaying ? 'var(--danger)' : '#FFFFFF', fontWeight: 600 }}
                  >
                    {isPlaying ? 'Stop Playback' : 'Play Recording'}
                  </button>
                  <button 
                    onClick={() => isEditingNotes ? handleSaveNotes() : setIsEditingNotes(true)}
                    className="btn-accent" 
                    style={{ background: '#FFFFFF', color: '#000000', border: 'none', boxShadow: 'var(--shadow-glow)', padding: '12px 24px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}
                  >
                    {isEditingNotes ? 'Save Notes' : 'Edit Notes'}
                  </button>
                </div>
              </div>

              {/* Interactive Audio Player UI when playing */}
              {isPlaying && (
                <div style={{ background: 'rgba(0,0,0,0.3)', border: '3px solid var(--glass-border)', borderRadius: '12px', padding: '16px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '24px' }}>
                    {[...Array(10)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: [10, Math.floor(Math.random() * 24) + 4, 10] }}
                        transition={{ repeat: Infinity, duration: 0.5 + (i * 0.1), ease: 'easeInOut' }}
                        style={{ width: '3px', background: 'var(--accent-color)', borderRadius: '2px' }}
                      />
                    ))}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Playing Automated Transcript Audio</div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', width: '100%', position: 'relative' }}>
                      <motion.div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--accent-color)', borderRadius: '3px', width: `${playbackProgress}%` }} />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid-2" style={{ gap: '32px' }}>
                <div>
                  <h3 className="flex-center" style={{ gap: '8px', marginBottom: '16px', justifyContent: 'flex-start' }}>
                    <Tag size={18} color="var(--accent-color)" /> {isEditingNotes ? 'Editing Notes' : 'AI Generated Summary'}
                  </h3>
                  {isEditingNotes ? (
                    <textarea 
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      style={{ width: '100%', minHeight: '150px', padding: '20px', background: 'rgba(0,0,0,0.5)', border: '2px solid var(--accent-color)', borderRadius: '12px', color: 'white', fontSize: '15px', lineHeight: '1.6', resize: 'vertical' }}
                    />
                  ) : (
                    <div className="flex-column" style={{ gap: '16px' }}>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', background: 'var(--glass-bg)', padding: '24px', borderRadius: '12px', border: '3px solid var(--glass-border)' }}>
                        {selectedLog.summary}
                      </p>
                      
                      {/* SOAP Notes Generation Mock */}
                      <div style={{ background: 'rgba(41,151,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(41,151,255,0.2)' }}>
                        <h4 style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', marginBottom: '12px' }}>
                          <Activity size={16} style={{ color: '#2997ff' }} /> Clinical SOAP Notes (Gemini Auto-Scribe)
                        </h4>
                        {selectedLog.soapNotes ? (
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                            {selectedLog.soapNotes}
                          </div>
                        ) : (
                          <button 
                            onClick={() => {
                              const soap = `Subjective: Patient reports upcoming meeting conflicts. Requests reschedule to 10:30 AM.\nObjective: Vitals not taken. Interaction via phone.\nAssessment: Stable patient seeking logistical care adjustments.\nPlan: Update database to 10:30 AM Thursday slot.`;
                              setLogsList(logsList.map(l => l.id === selectedLog.id ? { ...l, soapNotes: soap } : l));
                              setSelectedLog(prev => ({ ...prev, soapNotes: soap }));
                              setNotification({ message: 'SOAP Clinical Note compiled successfully', type: 'success' });
                              setTimeout(() => setNotification(null), 3000);
                            }}
                            style={{ width: '100%', background: '#2997ff', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                          >
                            <Sparkles size={14} /> Generate SOAP Notes via Gemini AI
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ marginTop: '24px' }}>
                    <h4 style={{ marginBottom: '12px' }}>Auto-tags</h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {selectedLog.tags.map(tag => (
                        <span key={tag} className="badge badge-accent">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ marginBottom: '16px' }}>Transcript</h3>
                  <div 
                    ref={transcriptContainerRef}
                    style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: '12px', border: '3px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}
                  >
                    {selectedLog.transcript.map((line, i) => (
                      <div 
                        key={i} 
                        id={`transcript-line-${i}`}
                        style={{ 
                          display: 'flex', 
                          gap: '16px', 
                          borderBottom: '1px solid rgba(255,255,255,0.03)', 
                          paddingBottom: '12px',
                          background: currentLineIdx === i ? 'rgba(41, 151, 255, 0.1)' : 'transparent',
                          borderLeft: currentLineIdx === i ? '4px solid var(--accent-color)' : '4px solid transparent',
                          borderRadius: '6px',
                          padding: '12px 14px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ color: line.speaker === 'AI' ? 'var(--accent-color)' : line.speaker === 'System' ? 'var(--warning)' : 'white', fontWeight: 700, minWidth: '65px' }}>{line.time} {line.speaker}</span>
                        <span style={{ color: currentLineIdx === i ? 'white' : line.speaker === 'AI' ? 'var(--text-secondary)' : 'var(--text-primary)', fontStyle: line.speaker === 'System' ? 'italic' : 'normal', fontWeight: currentLineIdx === i ? 600 : 400 }}>{line.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

