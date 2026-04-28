'use client';
import { Code, Briefcase, Mail, Phone, ShieldAlert, FileText, Globe, Shield, Lock } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer style={{ 
      background: '#050506', 
      borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
      padding: '48px 48px 32px 48px',
      color: '#A1A1A6',
      fontSize: '14px',
      marginTop: 'auto',
      width: '100%'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '64px'
      }}>
        {/* Top Section */}
        {/* Top Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '64px', textAlign: 'left' }}>
          
          {/* Brand & Contact - Left Aligned */}
          <div style={{ textAlign: 'left' }}>
            <div className="flex-center" style={{ gap: '12px', justifyContent: 'flex-start', marginBottom: '24px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="url(#metallic-footer)" />
                <path d="M7 12H17M12 7V17" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="metallic-footer" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#D1D1D6" />
                    <stop offset="100%" stopColor="#8E8E93" />
                  </linearGradient>
                </defs>
              </svg>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#F5F5F7' }}>MediSched AI</span>
            </div>
            
            <p style={{ lineHeight: 1.6, marginBottom: '24px', maxWidth: '320px', color: '#A1A1A6' }}>
              Next-generation healthcare scheduling and automated AI outbound calling. Built for modern clinical efficiency.
            </p>
            
            <div className="flex-column" style={{ gap: '12px' }}>
              <a href="mailto:iamhriturajsaha@gmail.com" className="footer-link flex-center" style={{ gap: '8px', justifyContent: 'flex-start' }}>
                <Mail size={16} /> iamhriturajsaha@gmail.com
              </a>
              <a href="tel:+918837242063" className="footer-link flex-center" style={{ gap: '8px', justifyContent: 'flex-start' }}>
                <Phone size={16} /> +91 8837242063
              </a>
            </div>
          </div>

          {/* Socials - Middle Aligned */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 style={{ color: '#F5F5F7', marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Connect</h4>
            <div className="flex-column" style={{ gap: '12px', alignItems: 'center' }}>
              <a href="https://linkedin.com/in/hrituraj-saha-5794b53a0" target="_blank" rel="noopener noreferrer" className="footer-link flex-center" style={{ gap: '8px', justifyContent: 'center' }}>
                <Briefcase size={16} /> LinkedIn
              </a>
              <a href="https://github.com/iamhriturajsaha" target="_blank" rel="noopener noreferrer" className="footer-link flex-center" style={{ gap: '8px', justifyContent: 'center' }}>
                <Code size={16} /> GitHub
              </a>
            </div>
          </div>

          {/* Resources & Legal - Right Aligned */}
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <h4 style={{ color: '#F5F5F7', marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources & Legal</h4>
            <div className="flex-column" style={{ gap: '12px', alignItems: 'flex-end' }}>
              <button onClick={() => setActiveTab('doc')} className="footer-link flex-center" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: '#A1A1A6', cursor: 'pointer', gap: '8px', justifyContent: 'flex-end' }}>
                <FileText size={16} /> Documentation
              </button>
              <button onClick={() => setActiveTab('sandbox')} className="footer-link flex-center" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: '#A1A1A6', cursor: 'pointer', gap: '8px', justifyContent: 'flex-end' }}>
                <Globe size={16} /> API Sandbox
              </button>
              <button onClick={() => setActiveTab('hipaa')} className="footer-link flex-center" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: '#A1A1A6', cursor: 'pointer', gap: '8px', justifyContent: 'flex-end' }}>
                <Shield size={16} /> HIPAA Security
              </button>
              <button onClick={() => setActiveTab('tos')} className="footer-link flex-center" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: '#A1A1A6', cursor: 'pointer', gap: '8px', justifyContent: 'flex-end' }}>
                <FileText size={16} /> Terms of Service
              </button>
              <button onClick={() => setActiveTab('privacy')} className="footer-link flex-center" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: '#A1A1A6', cursor: 'pointer', gap: '8px', justifyContent: 'flex-end' }}>
                <Lock size={16} /> Privacy Policy
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar (Google Style) */}
        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div className="flex-center" style={{ gap: '24px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-secondary)' }}>&copy; {new Date().getFullYear()} MediSched AI Inc.</span>
          </div>
          <div className="flex-center" style={{ gap: '8px', color: '#A1A1A6' }}>
            <Globe size={16} />
            <select style={{ background: 'transparent', border: 'none', color: '#A1A1A6', cursor: 'pointer', outline: 'none' }}>
              <option value="en">English (United States)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .footer-link {
          color: #8E8E93;
          text-decoration: none;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
        }
        .footer-link:hover {
          color: #F5F5F7;
        }
      `}} />
    </footer>
  );
}
