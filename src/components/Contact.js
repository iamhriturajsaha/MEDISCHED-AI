'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    
    setShowToast(true);
    setForm({ name: '', email: '', message: '' });

    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div className="animate-fade-in content-padding" style={{ padding: '40px 48px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-primary)' }}>
      
      <AnimatePresence>
        {showToast && (
          <div style={{ position: 'fixed', top: '110px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 100000, pointerEvents: 'none' }}>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ 
                background: 'var(--success)', 
                color: 'black', 
                padding: '16px 24px', 
                borderRadius: '12px', 
                fontWeight: 600, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '10px', 
                boxShadow: '0 10px 30px rgba(48, 209, 88, 0.3)',
                pointerEvents: 'auto'
              }}
            >
              <CheckCircle2 size={20} />
              <span>Message transmitted securely.</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '36px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
          Connect with MediSched
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
          Direct communication pipelines for clinical staff and system support.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '40px', border: '3px solid var(--glass-border)' }}>
        <form onSubmit={handleSubmit} className="flex-column" style={{ gap: '24px' }}>
          
          <div className="flex-column" style={{ gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Your Name</label>
            <input 
              type="text" 
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Dr. Alex Smith"
              style={{ background: 'rgba(255,255,255,0.03)', border: '3px solid var(--glass-border)', padding: '14px 16px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
            />
          </div>

          <div className="flex-column" style={{ gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Email Address</label>
            <input 
              type="email" 
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="doctor@clinic.org"
              style={{ background: 'rgba(255,255,255,0.03)', border: '3px solid var(--glass-border)', padding: '14px 16px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
            />
          </div>

          <div className="flex-column" style={{ gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Operational Message</label>
            <textarea 
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Provide context regarding legacy configurations or diagnostic inquiries..."
              style={{ background: 'rgba(255,255,255,0.03)', border: '3px solid var(--glass-border)', padding: '14px 16px', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '15px', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', background: 'var(--accent-color)', color: '#000000', fontWeight: 600, borderRadius: '8px', marginTop: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Send size={18} /> Send Secure Message
          </button>

        </form>
      </div>

      <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginTop: '48px', padding: '32px', border: '3px solid var(--glass-border)' }}>
        <div className="flex-column" style={{ gap: '12px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} style={{ color: 'var(--accent-color)' }} /> Headquarters
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
            MediSched Autonomous Networks LLC<br />
            795 Folsom Ave, Suite 600<br />
            San Francisco, CA 94107
          </p>
        </div>

        <div className="flex-column" style={{ gap: '12px', alignItems: 'flex-end', textAlign: 'right' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row-reverse' }}>
            <Phone size={18} style={{ color: 'var(--accent-color)' }} /> Direct Lines
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
            <strong>Main Support:</strong> +1 (800) 555-0199<br />
            <strong>Clinical Integrations:</strong> +1 (800) 555-0122
          </p>
        </div>

        <div className="flex-column" style={{ gap: '12px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={18} style={{ color: 'var(--accent-color)' }} /> Email Access
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
            support@medisched.ai<br />
            compliance@medisched.ai
          </p>
        </div>

        <div className="flex-column" style={{ gap: '12px', alignItems: 'flex-end', textAlign: 'right' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row-reverse' }}>
            <Clock size={18} style={{ color: 'var(--accent-color)' }} /> Operational Hours
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
            <strong>Mon - Fri:</strong> 24 / 7 Active Coverage<br />
            <strong>Sat - Sun:</strong> On-Call Clinical Support
          </p>
        </div>
      </div>

    </div>
  );
}
