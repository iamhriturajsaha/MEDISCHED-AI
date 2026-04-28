'use client';
import { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, Phone, Save, Sparkles, Sliders, Clock, CheckCircle2, UserCheck, XCircle, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
  const [role, setRole] = useState('Admin'); // Admin, Staff, Read-only
  const [activeTab, setActiveTab] = useState('Twilio');
  const [showKey, setShowKey] = useState(false);
  
  const [keys, setKeys] = useState({
    twilioSid: 'YOUR_TWILIO_SID',
    twilioAuth: 'YOUR_TWILIO_AUTH_TOKEN',
    phoneNumber: '+1 (555) 019-9283'
  });

  const [aiConfig, setAiConfig] = useState({
    promptTemplate: 'You are an empathetic healthcare assistant confirming upcoming appointments. Be concise and clear.',
    voicePitch: 1.0,
    voiceSpeed: 1.05,
    fallbackConfidence: 65,
    maxRetries: 3
  });

  const [limits, setLimits] = useState({
    maxConcurrentCalls: 10,
    outreachHoursStart: '09:00',
    outreachHoursEnd: '17:00',
    retryIntervalMinutes: 30,
    blockWeekends: true
  });

  const [account, setAccount] = useState({
    name: '',
    email: '',
    password: '',
    enableNotifications: true
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [accountToast, setAccountToast] = useState(false);

  const [toast, setToast] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('aura_session');
        if (stored) {
          try {
            const { email } = JSON.parse(stored);
            const response = await fetch(`http://127.0.0.1:8080/api/user/${email}`);
            if (response.ok) {
              const data = await response.json();
              if (data) {
                setAccount({
                  name: data.name || '',
                  email: data.email || '',
                  password: data.password || '',
                  enableNotifications: data.enable_notifications !== undefined ? data.enable_notifications : true
                });
              }
            }
          } catch (e) {
            console.error('Error fetching user:', e);
          }
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (role === 'Read-only') return;
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleSaveAccount = async () => {
    try {
      const payload = {
        name: account.name,
        email: account.email,
        password: account.password,
        enable_notifications: account.enableNotifications
      };
      
      const response = await fetch('http://127.0.0.1:8080/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setAccountToast(true);
        setTimeout(() => setAccountToast(false), 3000);
        // Sync local session too
        localStorage.setItem('aura_session', JSON.stringify(account));
      }
    } catch (err) {
      console.error('Error saving account:', err);
    }
  };

  const isReadOnly = role === 'Read-only';
  const isStaff = role === 'Staff';
  const disableForm = isReadOnly || (isStaff && activeTab === 'Twilio');

  return (
    <div className="animate-fade-in content-padding" style={{ padding: '40px 48px', height: '100%', overflowY: 'auto', position: 'relative' }}>
      {/* Global Notifications */}
      <AnimatePresence>
        {(toast || accountToast) && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: '50%', 
              zIndex: 1000,
              background: 'var(--success)',
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
            <CheckCircle2 size={18} />
            {toast ? "System configuration saved!" : "Account profile updated successfully!"}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex-between" style={{ marginBottom: '32px', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient">System Settings</h1>
          <p className="text-muted" style={{ marginTop: '8px' }}>Manage credentials, AI model variables, and operational rules.</p>
        </div>

        {/* Role Switcher */}
        <div className="flex-column" style={{ alignItems: 'flex-end', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Access Role</span>
          <div style={{ display: 'flex', gap: '6px', background: 'var(--glass-bg)', padding: '4px', borderRadius: '10px', border: '3px solid var(--glass-border)' }}>
            {['Admin', 'Staff', 'Read-only'].map(r => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  if (r === 'Staff' && activeTab === 'Twilio') {
                    setActiveTab('AI');
                  }
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  background: role === r ? 'var(--accent-color)' : 'transparent',
                  border: 'none',
                  color: role === r ? '#000000' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        {[
          { id: 'Twilio', label: 'Twilio API', icon: <Shield size={18} />, disabled: isStaff },
          { id: 'AI', label: 'AI Agent Tuning', icon: <Sparkles size={18} />, disabled: false },
          { id: 'Rules', label: 'Operational Constraints', icon: <Sliders size={18} />, disabled: false },
          { id: 'Google', label: 'Google Sync', icon: <Calendar size={18} />, disabled: false },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '12px',
              background: activeTab === tab.id ? 'var(--glass-hover)' : 'var(--glass-bg)',
              border: '3px solid var(--glass-border)',
              color: tab.disabled ? 'rgba(255,255,255,0.15)' : (activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)'),
              fontWeight: 600,
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: tab.disabled ? 0.4 : 1
            }}
          >
            {tab.icon} {tab.label}
            {tab.disabled && <Lock size={12} style={{ marginLeft: '4px' }} />}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
      {accountToast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'var(--success)', color: 'black', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 30px rgba(48,209,88,0.3)', zIndex: 100 }}>
          <CheckCircle2 size={18} /> Account preferences updated.
        </div>
      )}

      <div className="flex-column" style={{ gap: '32px', alignItems: 'stretch', width: '100%' }}>
        <div style={{ minWidth: 0 }}>
          {disableForm && (
            <div style={{ padding: '14px 20px', background: 'rgba(255,159,10,0.1)', border: '2px solid rgba(255,159,10,0.3)', borderRadius: '12px', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}>
              <Lock size={18} />
              {isReadOnly ? 'Read-only mode: Data modification locked globally.' : 'Staff mode: Twilio credentials viewing & access locked.'}
            </div>
          )}

          <form onSubmit={handleSave} className="glass-card flex-column" style={{ padding: '32px', gap: '24px', marginBottom: '32px', border: '3px solid var(--glass-border)', opacity: disableForm ? 0.75 : 1 }}>
            
            {/* TWILIO TAB */}
            {activeTab === 'Twilio' && (
              <div className="flex-column" style={{ gap: '20px' }}>
                <h3 style={{ fontSize: '18px', borderBottom: '3px solid var(--glass-border)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={20} /> Twilio Integration</h3>
                
                <div className="flex-column" style={{ gap: '8px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Twilio Account SID</label>
                  <input 
                    type="text" 
                    value={keys.twilioSid} 
                    disabled={disableForm}
                    onChange={(e) => setKeys({...keys, twilioSid: e.target.value})}
                    style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: disableForm ? 'var(--text-muted)' : 'white', fontSize: '15px', cursor: disableForm ? 'not-allowed' : 'text' }} 
                  />
                </div>

                <div className="flex-column" style={{ gap: '8px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Twilio Auth Token</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showKey ? 'text' : 'password'} 
                      value={keys.twilioAuth} 
                      disabled={disableForm}
                      onChange={(e) => setKeys({...keys, twilioAuth: e.target.value})}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '12px 48px 12px 12px', borderRadius: '8px', color: disableForm ? 'var(--text-muted)' : 'white', fontSize: '15px', cursor: disableForm ? 'not-allowed' : 'text' }} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowKey(!showKey)} 
                      disabled={disableForm}
                      style={{ position: 'absolute', right: '16px', top: '14px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: disableForm ? 'not-allowed' : 'pointer' }}
                    >
                      {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex-column" style={{ gap: '8px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Virtual Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      value={keys.phoneNumber} 
                      disabled={disableForm}
                      onChange={(e) => setKeys({...keys, phoneNumber: e.target.value})}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '12px 12px 12px 48px', borderRadius: '8px', color: disableForm ? 'var(--text-muted)' : 'white', fontSize: '15px', cursor: disableForm ? 'not-allowed' : 'text' }} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* AI AGENT TAB */}
            {activeTab === 'AI' && (
              <div className="flex-column" style={{ gap: '20px' }}>
                <h3 style={{ fontSize: '18px', borderBottom: '3px solid var(--glass-border)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={20} /> Model Tuning</h3>
                
                <div className="flex-column" style={{ gap: '8px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Base Prompt Template</label>
                  <textarea 
                    value={aiConfig.promptTemplate} 
                    disabled={disableForm}
                    onChange={(e) => setAiConfig({...aiConfig, promptTemplate: e.target.value})}
                    style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: disableForm ? 'var(--text-muted)' : 'white', fontSize: '15px', minHeight: '100px', resize: 'vertical', lineHeight: 1.5, cursor: disableForm ? 'not-allowed' : 'text' }} 
                  />
                </div>

                <div className="grid-2" style={{ gap: '20px' }}>
                  <div className="flex-column" style={{ gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Fallback Threshold ({aiConfig.fallbackConfidence}%)</label>
                    <input 
                      type="range" min="10" max="90" 
                      disabled={disableForm}
                      value={aiConfig.fallbackConfidence} 
                      onChange={(e) => setAiConfig({...aiConfig, fallbackConfidence: Number(e.target.value)})}
                      style={{ accentColor: 'var(--accent-color)', cursor: disableForm ? 'not-allowed' : 'pointer' }} 
                    />
                  </div>
                  <div className="flex-column" style={{ gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Max Escalation Retries</label>
                    <input 
                      type="number" min="1" max="5" 
                      disabled={disableForm}
                      value={aiConfig.maxRetries} 
                      onChange={(e) => setAiConfig({...aiConfig, maxRetries: Number(e.target.value)})}
                      style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: disableForm ? 'var(--text-muted)' : 'white', fontSize: '15px', cursor: disableForm ? 'not-allowed' : 'text' }} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* OPERATIONAL RULES TAB */}
            {/* GOOGLE WORKSPACE TAB */}
            {activeTab === 'Google' && (
              <div className="flex-column" style={{ gap: '20px' }}>
                <h3 style={{ fontSize: '18px', borderBottom: '3px solid var(--glass-border)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={20} style={{ color: '#4285F4' }} /> Google Workspace Integration</h3>
                
                <div style={{ padding: '16px', background: 'rgba(66, 133, 244, 0.05)', border: '1px solid rgba(66, 133, 244, 0.2)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '14px', color: 'white', fontWeight: 600, marginBottom: '8px' }}>Status: Connected to Google Cloud Platform</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Secure OAuth token bound to institutional healthcare domain.</p>
                </div>

                <div className="flex-column" style={{ gap: '16px', marginTop: '12px' }}>
                  <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '12px' }}>
                    <input 
                      type="checkbox" 
                      defaultChecked={true} 
                      disabled={disableForm}
                      style={{ width: '18px', height: '18px', accentColor: '#4285F4', cursor: disableForm ? 'not-allowed' : 'pointer' }} 
                    />
                    <label style={{ fontSize: '14px', color: disableForm ? 'var(--text-muted)' : 'var(--text-primary)' }}>Enable Bidirectional Google Calendar Sync</label>
                  </div>
                  
                  <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '12px' }}>
                    <input 
                      type="checkbox" 
                      defaultChecked={true} 
                      disabled={disableForm}
                      style={{ width: '18px', height: '18px', accentColor: '#4285F4', cursor: disableForm ? 'not-allowed' : 'pointer' }} 
                    />
                    <label style={{ fontSize: '14px', color: disableForm ? 'var(--text-muted)' : 'var(--text-primary)' }}>Auto-generate Telehealth Meet links for remote appointments</label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Rules' && (
              <div className="flex-column" style={{ gap: '20px' }}>
                <h3 style={{ fontSize: '18px', borderBottom: '3px solid var(--glass-border)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Sliders size={20} /> Operational Constraints</h3>
                
                <div className="grid-2" style={{ gap: '20px' }}>
                  <div className="flex-column" style={{ gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Max Concurrent Calls</label>
                    <input 
                      type="number" 
                      disabled={disableForm}
                      value={limits.maxConcurrentCalls} 
                      onChange={(e) => setLimits({...limits, maxConcurrentCalls: Number(e.target.value)})}
                      style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: disableForm ? 'var(--text-muted)' : 'white', fontSize: '15px', cursor: disableForm ? 'not-allowed' : 'text' }} 
                    />
                  </div>
                  <div className="flex-column" style={{ gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Retry Delay (mins)</label>
                    <input 
                      type="number" 
                      disabled={disableForm}
                      value={limits.retryIntervalMinutes} 
                      onChange={(e) => setLimits({...limits, retryIntervalMinutes: Number(e.target.value)})}
                      style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: disableForm ? 'var(--text-muted)' : 'white', fontSize: '15px', cursor: disableForm ? 'not-allowed' : 'text' }} 
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '20px' }}>
                  <div className="flex-column" style={{ gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Outreach Start Hours</label>
                    <input 
                      type="time" 
                      disabled={disableForm}
                      value={limits.outreachHoursStart} 
                      onChange={(e) => setLimits({...limits, outreachHoursStart: e.target.value})}
                      style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: disableForm ? 'var(--text-muted)' : 'white', fontSize: '15px', cursor: disableForm ? 'not-allowed' : 'text' }} 
                    />
                  </div>
                  <div className="flex-column" style={{ gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Outreach End Hours</label>
                    <input 
                      type="time" 
                      disabled={disableForm}
                      value={limits.outreachHoursEnd} 
                      onChange={(e) => setLimits({...limits, outreachHoursEnd: e.target.value})}
                      style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: disableForm ? 'var(--text-muted)' : 'white', fontSize: '15px', cursor: disableForm ? 'not-allowed' : 'text' }} 
                    />
                  </div>
                </div>

                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '12px', marginTop: '12px' }}>
                  <input 
                    type="checkbox" 
                    checked={limits.blockWeekends} 
                    disabled={disableForm}
                    onChange={(e) => setLimits({...limits, blockWeekends: e.target.checked})}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-color)', cursor: disableForm ? 'not-allowed' : 'pointer' }} 
                  />
                  <label style={{ fontSize: '14px', color: disableForm ? 'var(--text-muted)' : 'var(--text-primary)' }}>Block automated outbound outreach on weekends</label>
                </div>
              </div>
            )}

            {!isReadOnly && (
              <button 
                type="submit" 
                disabled={disableForm}
                className="btn-accent" 
                style={{ alignSelf: 'flex-start', marginTop: '16px', gap: '8px', background: disableForm ? 'rgba(255,255,255,0.05)' : '#FFFFFF', color: disableForm ? 'var(--text-muted)' : '#000000', border: 'none', fontWeight: 600, padding: '12px 24px', borderRadius: 'var(--radius-full)', boxShadow: disableForm ? 'none' : 'var(--shadow-glow)', cursor: disableForm ? 'not-allowed' : 'pointer' }}
              >
                <Save size={18} /> Save Configuration
              </button>
            )}
          </form>
        </div>

        {/* ACCOUNT SETTINGS BOX */}
        <div className="glass-card flex-column" style={{ padding: '28px', gap: '20px', border: '3px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '18px', borderBottom: '3px solid var(--glass-border)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={20} style={{ color: 'var(--accent-color)' }} /> Account Settings</h3>

          <div className="flex-column" style={{ gap: '8px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Full Name</label>
            <input 
              type="text" 
              value={account.name} 
              onChange={(e) => setAccount({...account, name: e.target.value})}
              style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: 'white', fontSize: '14px' }} 
            />
          </div>

          <div className="flex-column" style={{ gap: '8px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</label>
            <input 
              type="email" 
              value={account.email} 
              onChange={(e) => setAccount({...account, email: e.target.value})}
              style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: 'white', fontSize: '14px' }} 
            />
          </div>

          <div className="flex-column" style={{ gap: '8px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Password</label>
            <input 
              type="text" 
              value={account.password} 
              disabled
              style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '14px', cursor: 'not-allowed' }} 
            />
            
            {!isChangingPassword ? (
              <button 
                type="button"
                onClick={() => setIsChangingPassword(true)}
                style={{ color: 'var(--accent-color)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px', alignSelf: 'flex-start', marginTop: '4px', fontWeight: 500 }}
              >
                Change Password
              </button>
            ) : (
              <div className="flex-column" style={{ gap: '12px', marginTop: '12px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <input 
                  type="password" 
                  placeholder="Current Password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '10px', borderRadius: '6px', color: 'white', fontSize: '13px' }}
                />
                <input 
                  type="password" 
                  placeholder="New Password"
                  value={passwords.newPass}
                  onChange={(e) => setPasswords({...passwords, newPass: e.target.value})}
                  style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '10px', borderRadius: '6px', color: 'white', fontSize: '13px' }}
                />
                <input 
                  type="password" 
                  placeholder="Confirm New Password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid var(--glass-border)', padding: '10px', borderRadius: '6px', color: 'white', fontSize: '13px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button"
                    onClick={() => {
                      if (!passwords.newPass || passwords.newPass !== passwords.confirm) {
                        alert("Passwords do not match or are empty.");
                        return;
                      }
                      const updatedAccount = { ...account, password: passwords.newPass };
                      setAccount(updatedAccount);
                      setIsChangingPassword(false);
                      setPasswords({ current: '', newPass: '', confirm: '' });
                      
                      // Persist immediately
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('aura_session', JSON.stringify(updatedAccount));
                        let users = JSON.parse(localStorage.getItem('aura_users') || '[]');
                        const userIndex = users.findIndex(u => u.email === updatedAccount.email);
                        if (userIndex !== -1) {
                          users[userIndex] = { ...users[userIndex], ...updatedAccount };
                          localStorage.setItem('aura_users', JSON.stringify(users));
                        }
                      }
                      
                      setAccountToast(true);
                      setTimeout(() => setAccountToast(false), 3000);
                    }}
                    style={{ background: 'white', color: 'black', border: 'none', fontWeight: 600, padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Save
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', fontWeight: 600, padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '12px', marginTop: '12px' }}>
            <input 
              type="checkbox" 
              checked={!!account.enableNotifications} 
              onChange={(e) => setAccount({...account, enableNotifications: e.target.checked})}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent-color)', cursor: 'pointer' }} 
            />
            <label style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Enable email notifications</label>
          </div>

          <button 
            onClick={handleSaveAccount}
            className="btn-secondary" 
            style={{ marginTop: '12px', background: 'var(--glass-bg)', border: '3px solid var(--glass-border)', color: 'white', fontWeight: 600, padding: '12px', borderRadius: 'var(--radius-full)', cursor: 'pointer' }}
          >
            Update Account Profile
          </button>
      </div>
      </div>
      </div>
    </div>
  );
}


