'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import Dashboard from '@/components/Dashboard';
import Calendar from '@/components/Calendar';
import Calls from '@/components/Calls';
import Logs from '@/components/Logs';
import Settings from '@/components/Settings';
import AboutFAQ from '@/components/AboutFAQ';
import Contact from '@/components/Contact';
import Doctors from '@/components/Doctors';
import Patients from '@/components/Patients';
import Footer from '@/components/Footer';
import { LegalDocs } from '@/components/LegalDocs';
import { LayoutDashboard, Calendar as CalendarIcon, Phone, FileText, Settings as SettingsIcon, LogOut, Home, HelpCircle, Pill, Activity, Stethoscope, Heart, Mail, User as UserIcon } from 'lucide-react';
import MediBot from '@/components/MediBot';

export default function SinglePageApp() {
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    localStorage.removeItem('aura_session');
    window.location.href = '/';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', position: 'relative' }}>
      
      {/* CSS Animation for Medicine floaters */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatAndRotate {
          0% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-15px) rotate(180deg) scale(1.05); }
          100% { transform: translateY(0px) rotate(360deg) scale(1); }
        }
        @keyframes rgbBreathing {
          0% { border-color: rgba(255, 0, 128, 0.8); box-shadow: 0 0 20px rgba(255, 0, 128, 0.4), 0 12px 40px rgba(0, 0, 0, 0.8); }
          33% { border-color: rgba(0, 255, 255, 0.8); box-shadow: 0 0 20px rgba(0, 255, 255, 0.4), 0 12px 40px rgba(0, 0, 0, 0.8); }
          66% { border-color: rgba(128, 0, 255, 0.8); box-shadow: 0 0 20px rgba(128, 0, 255, 0.4), 0 12px 40px rgba(0, 0, 0, 0.8); }
          100% { border-color: rgba(255, 0, 128, 0.8); box-shadow: 0 0 20px rgba(255, 0, 128, 0.4), 0 12px 40px rgba(0, 0, 0, 0.8); }
        }
        .rgb-topbar {
          animation: rgbBreathing 6s infinite ease-in-out;
        }
        .med-floater {
          position: absolute;
          pointer-events: none;
          z-index: 2;
          opacity: 0.07;
          animation: floatAndRotate 18s infinite ease-in-out;
          color: var(--text-primary);
        }
      `}} />

      {/* Medicine Floaters - Visible everywhere except Home */}
      {activeTab !== 'home' && (
        <>
          <div className="med-floater" style={{ top: '15%', left: '5%', animationDelay: '0s' }}><Pill size={50} /></div>
          <div className="med-floater" style={{ top: '25%', right: '6%', animationDelay: '2s' }}><Activity size={55} /></div>
          <div className="med-floater" style={{ bottom: '25%', left: '6%', animationDelay: '4s' }}><Heart size={45} /></div>
          <div className="med-floater" style={{ bottom: '15%', right: '5%', animationDelay: '6s' }}><Stethoscope size={55} /></div>
          
          <div className="med-floater" style={{ top: '50%', left: '3%', animationDelay: '8s' }}><Pill size={45} /></div>
          <div className="med-floater" style={{ top: '70%', right: '4%', animationDelay: '10s' }}><Activity size={50} /></div>
          <div className="med-floater" style={{ top: '5%', left: '45%', animationDelay: '12s' }}><Heart size={40} /></div>
          <div className="med-floater" style={{ bottom: '5%', right: '45%', animationDelay: '14s' }}><Stethoscope size={50} /></div>
        </>
      )}
      
      {/* Neon Glowing Spotlights - Active on all tabs */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <motion.div 
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '10%', left: '5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 75%)', filter: 'blur(60px)', willChange: 'transform' }}
        />
        <motion.div 
          animate={{ opacity: [0.6, 1.0, 0.6], scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ position: 'absolute', bottom: '5%', right: '20%', width: '750px', height: '750px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 75%)', filter: 'blur(80px)', willChange: 'transform' }}
        />
        <motion.div 
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [1.1, 1.2, 1.1], y: [0, 40, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          style={{ position: 'absolute', top: '35%', right: '0%', width: '550px', height: '550px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 75%)', filter: 'blur(50px)', willChange: 'transform' }}
        />
      </div>
      
      {/* Floating 3D Rotating Logo Overlay - Visible on all tabs except Home */}
      {activeTab !== 'home' && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '600px', 
          height: '600px', 
          perspective: '1500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0.12
        }}>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id="diamondWhiteBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F2F2F7" />
                <stop offset="100%" stopColor="#D1D1D6" />
              </linearGradient>
              <clipPath id="logoClipBg">
                <rect width="100" height="100" rx="22" />
              </clipPath>
            </defs>
          </svg>

          <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            animation: 'rotate3D 25s linear infinite',
            willChange: 'transform',
            transform: 'translate3d(0,0,0)'
          }}>
            {[...Array(15)].map((_, i) => (
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
                  transform: `translateZ(${i * 3}px)`,
                  opacity: (i === 0 || i === 14) ? 1 : 0.8,
                  willChange: 'transform'
                }}
              >
                <rect width="100" height="100" rx="24" fill={ (i === 0 || i === 14) ? "url(#diamondWhiteBg)" : "#E5E5EA"} />
                {(i === 0 || i === 14) && (
                  <g clipPath="url(#logoClipBg)">
                    <path d="M0 0 L50 15 L20 40 Z" fill="rgba(0,0,0,0.06)" />
                    <path d="M50 15 L100 0 L80 40 Z" fill="rgba(0,0,0,0.03)" />
                    <path d="M100 0 L100 100 L85 60 Z" fill="rgba(0,0,0,0.05)" />
                    <path d="M100 100 L50 85 L85 60 Z" fill="rgba(0,0,0,0.08)" />
                    <path d="M50 85 L0 100 L15 60 Z" fill="rgba(0,0,0,0.02)" />
                    <path d="M0 100 L0 0 L15 40 Z" fill="rgba(0,0,0,0.06)" />
                    <path d="M15 40 L50 15 L50 50 Z" fill="rgba(0,0,0,0.04)" />
                    <path d="M50 15 L80 40 L50 50 Z" fill="rgba(0,0,0,0.02)" />
                    <path d="M80 40 L85 60 L50 50 Z" fill="rgba(0,0,0,0.03)" />
                    <path d="M85 60 L50 85 L50 50 Z" fill="rgba(0,0,0,0.05)" />
                    <path d="M50 85 L15 60 L50 50 Z" fill="rgba(0,0,0,0.02)" />
                    <path d="M15 60 L15 40 L50 50 Z" fill="rgba(0,0,0,0.02)" />
                    <g stroke="rgba(0,0,0,0.05)" strokeWidth="0.5">
                      <path d="M50 15 L50 50 M80 40 L50 50 M85 60 L50 50 M50 85 L50 50 M15 60 L50 50 M15 40 L50 50" />
                    </g>
                  </g>
                )}
                {(i === 0 || i === 14) && (
                  <path 
                    d="M42 28 C 42 25, 58 25, 58 28 V 42 H 72 C 75 42, 75 58, 72 58 H 58 V 72 C 58 75, 42 75, 42 72 V 58 H 28 C 25 58, 25 42, 28 42 H 42 V 28 Z" 
                    fill="#000000" 
                  />
                )}
              </svg>
            ))}
          </div>
        </div>
      )}

      {/* Floating Top Nav Bar */}
      <div 
        className="rgb-topbar"
        style={{ 
          position: 'absolute', 
          top: '32px', 

          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 10000, 
          display: 'flex', 
          gap: '24px', 
          background: 'rgba(0, 0, 0, 0.75)', 
          padding: '12px 32px', 
          borderRadius: '9999px', 
          border: '2px solid rgba(255, 255, 255, 0.15)', 
          backdropFilter: 'blur(24px)', 
          WebkitBackdropFilter: 'blur(24px)'
        }}
      >
        <button 
          onClick={() => setActiveTab('home')} 
          title="Home" 
          className="nav-icon-btn"
          style={{ color: activeTab === 'home' ? 'var(--accent-hover)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
        >
          <Home size={20} />
        </button>

        <button 
          onClick={() => setActiveTab('dashboard')} 
          title="Dashboard" 
          className="nav-icon-btn"
          style={{ color: activeTab === 'dashboard' ? 'var(--accent-hover)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
        >
          <LayoutDashboard size={20} />
        </button>

        <button 
          onClick={() => setActiveTab('calendar')} 
          title="Calendar" 
          className="nav-icon-btn"
          style={{ color: activeTab === 'calendar' ? 'var(--accent-hover)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
        >
          <CalendarIcon size={20} />
        </button>

        <button 
          onClick={() => setActiveTab('calls')} 
          title="Live Calls" 
          className="nav-icon-btn"
          style={{ color: activeTab === 'calls' ? 'var(--accent-hover)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
        >
          <Phone size={20} />
        </button>

        <button 
          onClick={() => setActiveTab('logs')} 
          title="Patient Logs" 
          className="nav-icon-btn"
          style={{ color: activeTab === 'logs' ? 'var(--accent-hover)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
        >
          <FileText size={20} />
        </button>

        <button 
          onClick={() => setActiveTab('doctors')} 
          title="Clinical Directory" 
          className="nav-icon-btn"
          style={{ color: activeTab === 'doctors' ? 'var(--accent-hover)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
        >
          <UserIcon size={20} />
        </button>

        <button 
          onClick={() => setActiveTab('patients')} 
          title="Patient Records" 
          className="nav-icon-btn"
          style={{ color: activeTab === 'patients' ? 'var(--accent-hover)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
        >
          <Pill size={20} />
        </button>

        <button 
          onClick={() => setActiveTab('settings')} 
          title="Settings" 
          className="nav-icon-btn"
          style={{ color: activeTab === 'settings' ? 'var(--accent-hover)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
        >
          <SettingsIcon size={20} />
        </button>

        <button 
          onClick={() => setActiveTab('about')} 
          title="About & FAQ" 
          className="nav-icon-btn"
          style={{ color: activeTab === 'about' ? 'var(--accent-hover)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
        >
          <HelpCircle size={20} />
        </button>

        <button 
          onClick={() => setActiveTab('contact')} 
          title="Contact Us" 
          className="nav-icon-btn"
          style={{ color: activeTab === 'contact' ? 'var(--accent-hover)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
        >
          <Mail size={20} />
        </button>

        {/* Relocated Clinical Directory Button */}
        
        <div style={{ width: '1px', height: '20px', background: 'rgba(255, 255, 255, 0.15)', margin: '0 4px' }}></div>
        
        <button 
          onClick={handleLogout} 
          title="Log Out" 
          className="nav-icon-btn"
          style={{ color: 'var(--danger)', opacity: 0.8, transition: 'opacity 0.2s', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, width: '100%', maxWidth: activeTab === 'home' ? '100%' : '1440px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {activeTab === 'home' && <Hero />}
        {activeTab === 'dashboard' && <div style={{ paddingTop: '100px' }}><Dashboard /></div>}
        {activeTab === 'calendar' && <div style={{ paddingTop: '100px' }}><Calendar /></div>}
        {activeTab === 'calls' && <div style={{ paddingTop: '100px' }}><Calls /></div>}
        {activeTab === 'logs' && <div style={{ paddingTop: '100px' }}><Logs /></div>}
        {activeTab === 'settings' && <div style={{ paddingTop: '100px' }}><Settings /></div>}
        {activeTab === 'about' && <div style={{ paddingTop: '100px' }}><AboutFAQ /></div>}
        {activeTab === 'contact' && <div style={{ paddingTop: '100px' }}><Contact /></div>}
        {activeTab === 'doctors' && <div style={{ paddingTop: '100px' }}><Doctors /></div>}
        {activeTab === 'patients' && <div style={{ paddingTop: '100px' }}><Patients /></div>}
        {['doc', 'sandbox', 'hipaa', 'tos', 'privacy'].includes(activeTab) && <LegalDocs type={activeTab} />}
      </div>

      {/* Properly Centered Footer aligned with Content Grid */}
      <div style={{ width: '100%', maxWidth: activeTab === 'home' ? '100%' : '1440px', margin: '0 auto', padding: activeTab === 'home' ? 0 : '0 48px' }}>
        {activeTab !== 'home' && <Footer setActiveTab={setActiveTab} />}
      </div>
      
      {activeTab !== 'home' && <MediBot />}

    </div>
  );
}
