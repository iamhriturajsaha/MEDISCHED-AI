'use client';
import { FileText, Shield, Lock, Globe, CheckCircle2 } from 'lucide-react';

export function LegalDocs({ type }) {
  const views = {
    doc: {
      title: "System Documentation",
      icon: <FileText size={32} style={{ color: 'var(--accent-color)' }} />,
      content: (
        <div className="flex-column" style={{ gap: '24px' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Welcome to the core operational documentation for the MediSched AI platform. This integration architecture combines modern client portals alongside high-speed telemetry hooks.
          </p>
          
          <div>
            <h4 style={{ marginBottom: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>1. Authentication Protocols</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '8px' }}>
              Requests route securely via internal authentication filters ensuring isolation boundaries.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ marginBottom: '12px', fontWeight: 600 }}>Core Pipeline Routes</h4>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              <li><code style={{ color: 'var(--accent-color)' }}>/api/twilio/outbound</code> - Dispatches call scenarios safely.</li>
              <li><code style={{ color: 'var(--accent-color)' }}>/api/twilio/gather</code> - Aggregates real-time telemetry.</li>
            </ul>
          </div>
        </div>
      )
    },
    sandbox: {
      title: "API Sandbox Environment",
      icon: <Globe size={32} style={{ color: 'var(--accent-color)' }} />,
      content: (
        <div className="flex-column" style={{ gap: '24px' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Evaluate localized performance metrics safely without compromising active client data sets.
          </p>

          <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>Active Test Key</div>
            <code style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 24px', borderRadius: '6px', color: 'var(--accent-color)', fontSize: '16px', letterSpacing: '0.05em' }}>
              medisched_test_boundary_prod_2026
            </code>
          </div>
        </div>
      )
    },
    hipaa: {
      title: "HIPAA Security Standards",
      icon: <Shield size={32} style={{ color: 'var(--accent-color)' }} />,
      content: (
        <div className="flex-column" style={{ gap: '24px' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Maintaining robust protection controls across client environments.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <CheckCircle2 size={20} style={{ color: 'var(--success)', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <h5 style={{ fontWeight: 600, marginBottom: '4px' }}>Physical Safeguards</h5>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5 }}>Data layers execute inside isolated operational protocols comfortably.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <CheckCircle2 size={20} style={{ color: 'var(--success)', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <h5 style={{ fontWeight: 600, marginBottom: '4px' }}>Technical Measures</h5>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5 }}>Strict TLS handshakes accommodate structural requirements safely.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    tos: {
      title: "Terms of Service",
      icon: <FileText size={32} style={{ color: 'var(--accent-color)' }} />,
      content: (
        <div className="flex-column" style={{ gap: '24px' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Policies binding deployment schemas appropriately across shared systems.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Access conditions prohibit extraction of primary operational scripts securely.
          </p>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      icon: <Lock size={32} style={{ color: 'var(--accent-color)' }} />,
      content: (
        <div className="flex-column" style={{ gap: '24px' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Commitments regarding the governance of local record variables.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Logs clear at standard rotation boundaries securely.
          </p>
        </div>
      )
    }
  };

  const view = views[type] || views.doc;

  return (
    <div className="animate-fade-in content-padding" style={{ padding: '100px 48px 60px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        {view.icon}
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>{view.title}</h1>
      </div>
      <div className="glass-card" style={{ padding: '40px', border: '3px solid var(--glass-border)' }}>
        {view.content}
      </div>
    </div>
  );
}
