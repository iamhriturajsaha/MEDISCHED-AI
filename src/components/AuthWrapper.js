'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ShieldCheck, LayoutDashboard, Calendar, Phone, FileText, Settings, LogOut } from 'lucide-react';

export default function AuthWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true); 
  const [showWelcome, setShowWelcome] = useState(false);
  
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('aura_session');
    if (session) setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        // 1. Fetch user from backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/user/${form.email}`);
        if (response.ok) {
          const user = await response.json();
          // For simplicity in this demo, we check password client-side if returned
          // In a real app, this should be a proper POST /login endpoint
          if (user && user.password === form.password) {
            localStorage.setItem('aura_session', JSON.stringify(user));
            setIsAuthenticated(true);
            setShowWelcome(true);
          } else {
            setError('Invalid credentials. Profile not found.');
          }
        } else {
          setError('Could not connect to authentication server.');
        }
      } else {
        // 2. Register new user on backend
        const newUser = { 
          name: form.name, 
          email: form.email, 
          password: form.password, 
          role: form.role || 'Doctor',
          enable_notifications: true 
        };
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });

        if (response.ok) {
          localStorage.setItem('aura_session', JSON.stringify(newUser));
          setIsAuthenticated(true);
          setShowWelcome(true);
        } else {
          setError('Failed to create account on server.');
        }
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setError('System error. Please ensure backend is running.');
    }
  };

  if (isLoading) return <div style={{ height: '100vh', background: 'var(--bg-primary)' }}></div>;

  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh', width: '100%', background: '#010102', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        

        {/* Neon Glowing Spotlights for Auth */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
          <motion.div 
            animate={{ opacity: [0.6, 1.0, 0.6], scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -40, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', top: '10%', left: '5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 75%)', filter: 'blur(60px)', willChange: 'transform' }}
          />
          <motion.div 
            animate={{ opacity: [0.7, 1.0, 0.7], scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ position: 'absolute', bottom: '5%', right: '20%', width: '750px', height: '750px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 75%)', filter: 'blur(80px)', willChange: 'transform' }}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ 
            width: '100%', 
            maxWidth: '440px', 
            padding: '48px', 
            gap: '24px', 
            zIndex: 10, 
            background: 'linear-gradient(135deg, #F0F0F2 0%, #FFFFFF 15%, #E1E1E5 30%, #FFFFFF 45%, #B8B8BD 60%, #FFFFFF 75%, #D1D1D6 90%, #A1A1A6 100%)', 
            border: '1px solid rgba(255,255,255,1)', 
            borderRadius: '32px', 
            boxShadow: '0 40px 80px rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,255,255,1), inset 0 -2px 10px rgba(0,0,0,0.1)'
          }}
        >
          <div className="flex-column" style={{ alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '100px', height: '100px', marginBottom: '24px', perspective: '800px', position: 'relative' }}>
              <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                  <linearGradient id="diamondBlackAuth" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1C1C1E" />
                    <stop offset="50%" stopColor="#2C2C2E" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>
                  <clipPath id="logoClipAuth">
                    <rect width="100" height="100" rx="22" />
                  </clipPath>
                </defs>
              </svg>

              <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                animation: 'rotate3D 15s linear infinite'
              }}>
                {[...Array(12)].map((_, i) => (
                  <svg 
                    key={i}
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 100 100" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      transform: `translateZ(${i * 1.5}px)`,
                      opacity: (i === 0 || i === 11) ? 1 : 0.8,
                    }}
                  >
                    <rect width="100" height="100" rx="24" fill={ (i === 0 || i === 11) ? "url(#diamondBlackAuth)" : "#1C1C1E"} />
                    {(i === 0 || i === 11) && (
                      <g clipPath="url(#logoClipAuth)">
                        <path d="M0 0 L50 15 L20 40 Z" fill="rgba(255,255,255,0.1)" />
                        <path d="M50 15 L100 0 L80 40 Z" fill="rgba(255,255,255,0.05)" />
                        <path d="M100 0 L100 100 L85 60 Z" fill="rgba(255,255,255,0.08)" />
                        <path d="M100 100 L50 85 L85 60 Z" fill="rgba(255,255,255,0.12)" />
                        <path d="M50 85 L0 100 L15 60 Z" fill="rgba(255,255,255,0.04)" />
                        <path d="M0 100 L0 0 L15 40 Z" fill="rgba(255,255,255,0.09)" />
                        <path d="M15 40 L50 15 L50 50 Z" fill="rgba(255,255,255,0.07)" />
                        <path d="M50 15 L80 40 L50 50 Z" fill="rgba(255,255,255,0.04)" />
                        <path d="M80 40 L85 60 L50 50 Z" fill="rgba(255,255,255,0.05)" />
                        <path d="M85 60 L50 85 L50 50 Z" fill="rgba(255,255,255,0.08)" />
                        <path d="M50 85 L15 60 L50 50 Z" fill="rgba(255,255,255,0.03)" />
                        <path d="M15 60 L15 40 L50 50 Z" fill="rgba(255,255,255,0.04)" />
                        <g stroke="rgba(255,255,255,0.1)" strokeWidth="0.5">
                          <path d="M50 15 L50 50 M80 40 L50 50 M85 60 L50 50 M50 85 L50 50 M15 60 L50 50 M15 40 L50 50" />
                        </g>
                      </g>
                    )}
                    {(i === 0 || i === 11) && (
                      <path 
                        d="M42 28 C 42 25, 58 25, 58 28 V 42 H 72 C 75 42, 75 58, 72 58 H 58 V 72 C 58 75, 42 75, 42 72 V 58 H 28 C 25 58, 25 42, 28 42 H 42 V 28 Z" 
                        fill="#FFFFFF" 
                      />
                    )}
                  </svg>
                ))}
              </div>
            </div>
            <h2 style={{ fontSize: '32px', textAlign: 'center', fontWeight: 800, color: '#1C1C1E', letterSpacing: '-0.03em' }}>MediSched AI</h2>
            <p style={{ textAlign: 'center', fontSize: '15px', color: '#48484A', fontWeight: 500 }}>Secure Portal Authentication</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'rgba(255,69,58,0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', fontSize: '14px', textAlign: 'center', border: '1px solid rgba(255,69,58,0.2)' }}>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="flex-column" style={{ gap: '16px', width: '100%' }}>
            {!isLogin && (
              <>
              <div className="flex-column" style={{ gap: '8px', width: '100%', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', color: '#636366', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Account Role</label>
                <select 
                  value={form.role || 'Doctor'} 
                  onChange={e => setForm({...form, role: e.target.value})} 
                  style={{ width: '100%', background: '#FFFFFF', border: '1px solid #C7C7CC', padding: '12px', borderRadius: '12px', color: '#1C1C1E', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}
                >
                  <option value="Doctor">Medical Professional (Doctor/Staff)</option>
                  <option value="Patient">Patient</option>
                </select>
              </div>
              <div className="flex-column" style={{ gap: '8px', width: '100%' }}>
                <label style={{ fontSize: '12px', color: '#636366', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#8E8E93' }} />
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #C7C7CC', padding: '12px 12px 12px 44px', borderRadius: '12px', color: '#1C1C1E', fontSize: '15px', fontWeight: 500 }} placeholder="Jonathan Reyes" />
                </div>
              </div>
              </>
            )}
            
            <div className="flex-column" style={{ gap: '8px', width: '100%' }}>
              <label style={{ fontSize: '12px', color: '#636366', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Professional Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#8E8E93' }} />
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #C7C7CC', padding: '12px 12px 12px 44px', borderRadius: '12px', color: '#1C1C1E', fontSize: '15px', fontWeight: 500 }} placeholder="doctor@medisched.ai" />
              </div>
            </div>

            <div className="flex-column" style={{ gap: '8px', width: '100%' }}>
              <label style={{ fontSize: '12px', color: '#636366', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Secure Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#8E8E93' }} />
                <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #C7C7CC', padding: '12px 12px 12px 44px', borderRadius: '12px', color: '#1C1C1E', fontSize: '15px', fontWeight: 500 }} placeholder="••••••••" />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-accent" 
              style={{ 
                width: '100%', 
                marginTop: '12px', 
                padding: '14px', 
                fontSize: '16px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                background: '#1C1C1E',
                color: '#FFFFFF',
                fontWeight: 600,
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {isLogin ? 'Authenticate Identity' : 'Register Secure Profile'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '14px', color: '#48484A', width: '100%', fontWeight: 500 }}>
            {isLogin ? "Don't have access? " : "Already registered? "}
            <span style={{ color: '#0071E3', cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register Profile' : 'Secure Login'}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showWelcome) {
    const session = JSON.parse(localStorage.getItem('aura_session') || '{}');
    const userName = session.name || 'Doctor';
    
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#010102', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', zIndex: 9999 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          {/* Pure Ambient Glow Spotlights - Title Page Only */}
          <motion.div 
            animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.15, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 75%)', filter: 'blur(50px)', willChange: 'transform' }}
          />
          <motion.div 
            animate={{ opacity: [0.4, 0.6, 0.4], scale: [1.15, 1, 1.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '750px', height: '750px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 75%)', filter: 'blur(60px)', willChange: 'transform' }}
          />
        </div>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', zIndex: 10 }}
        >
          <div style={{ width: '120px', height: '120px', marginBottom: '8px', perspective: '1000px', position: 'relative' }}>
            <svg width="0" height="0" style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id="diamondBlackWelcome" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1C1C1E" />
                  <stop offset="50%" stopColor="#2C2C2E" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>
                <clipPath id="logoClipWelcome">
                  <rect width="100" height="100" rx="22" />
                </clipPath>
              </defs>
            </svg>

            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
              animation: 'rotate3D 10s linear infinite'
            }}>
              {[...Array(12)].map((_, i) => (
                <svg 
                  key={i}
                  width="100%" 
                  height="100%" 
                  viewBox="0 0 100 100" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: `translateZ(${i * 2}px)`,
                    opacity: (i === 0 || i === 11) ? 1 : 0.8,
                  }}
                >
                  <rect width="100" height="100" rx="24" fill={ (i === 0 || i === 11) ? "url(#diamondBlackWelcome)" : "#1C1C1E"} />
                  {(i === 0 || i === 11) && (
                    <g clipPath="url(#logoClipWelcome)">
                      <path d="M0 0 L50 15 L20 40 Z" fill="rgba(255,255,255,0.1)" />
                      <path d="M50 15 L100 0 L80 40 Z" fill="rgba(255,255,255,0.05)" />
                      <path d="M100 0 L100 100 L85 60 Z" fill="rgba(255,255,255,0.08)" />
                      <path d="M100 100 L50 85 L85 60 Z" fill="rgba(255,255,255,0.12)" />
                      <path d="M50 85 L0 100 L15 60 Z" fill="rgba(255,255,255,0.04)" />
                      <path d="M0 100 L0 0 L15 40 Z" fill="rgba(255,255,255,0.09)" />
                      <path d="M15 40 L50 15 L50 50 Z" fill="rgba(255,255,255,0.07)" />
                      <path d="M50 15 L80 40 L50 50 Z" fill="rgba(255,255,255,0.04)" />
                      <path d="M80 40 L85 60 L50 50 Z" fill="rgba(255,255,255,0.05)" />
                      <path d="M85 60 L50 85 L50 50 Z" fill="rgba(255,255,255,0.08)" />
                      <path d="M50 85 L15 60 L50 50 Z" fill="rgba(255,255,255,0.03)" />
                      <path d="M15 60 L15 40 L50 50 Z" fill="rgba(255,255,255,0.04)" />
                      <g stroke="rgba(255,255,255,0.1)" strokeWidth="0.5">
                        <path d="M50 15 L50 50 M80 40 L50 50 M85 60 L50 50 M50 85 L50 50 M15 60 L50 50 M15 40 L50 50" />
                      </g>
                    </g>
                  )}
                  {(i === 0 || i === 11) && (
                    <path 
                      d="M42 28 C 42 25, 58 25, 58 28 V 42 H 72 C 75 42, 75 58, 72 58 H 58 V 72 C 58 75, 42 75, 42 72 V 58 H 28 C 25 58, 25 42, 28 42 H 42 V 28 Z" 
                      fill="#FFFFFF" 
                    />
                  )}
                </svg>
              ))}
            </div>
          </div>
          
          <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-0.03em', background: 'linear-gradient(180deg, #FFFFFF 0%, #8E8E93 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' }}>
            Welcome Dr. {userName}
          </h1>
          <p style={{ color: '#A1A1A6', fontSize: '18px' }}>Initializing clinical command center...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ position: 'relative', background: '#010102' }}>
      <main className="main-content" style={{ zIndex: 1, width: '100%' }}>
        {children}
      </main>
    </div>
  );
}
