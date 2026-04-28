'use client';
import { Sparkles, HelpCircle, Shield, Info, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutFAQ() {
  return (
    <div className="animate-fade-in content-padding" style={{ padding: '40px 48px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '36px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
          About MediSched AI
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Optimizing healthcare communication pipelines with fully integrated, intelligent automation protocols.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '48px' }}>
        {/* Core Mission */}
        <motion.div className="glass-card flex-column" style={{ padding: '32px', gap: '16px', border: '3px solid var(--glass-border)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--accent-color)', marginBottom: '8px' }}>
            <Heart size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Patient-Centric Focus</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            We prioritize empathy and clear communication. Our conversational AI respects the patient's time while drastically lowering administrative overhead.
          </p>
        </motion.div>

        {/* Security */}
        <motion.div className="glass-card flex-column" style={{ padding: '32px', gap: '16px', border: '3px solid var(--glass-border)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--success)', marginBottom: '8px' }}>
            <Shield size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>HIPAA & Security</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            Military-grade encryption governs our database infrastructure. Protected Health Information (PHI) is scrubbed in compliance with national policies.
          </p>
        </motion.div>

        {/* Intelligence */}
        <motion.div className="glass-card flex-column" style={{ padding: '32px', gap: '16px', border: '3px solid var(--glass-border)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--warning)', marginBottom: '8px' }}>
            <Sparkles size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Predictive Capabilities</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            Using modern neural network algorithms, we calculate no-show probabilities and forecast daily clinical capacities dynamically.
          </p>
        </motion.div>

        {/* Integrations */}
        <motion.div className="glass-card flex-column" style={{ padding: '32px', gap: '16px', border: '3px solid var(--glass-border)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--accent-color)', marginBottom: '8px' }}>
            <Info size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>EHR Interoperability</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            MediSched plugs straight into your legacy systems. We bridge gaps easily using industry-standard REST APIs and secure webhooks.
          </p>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <div className="glass-card" style={{ padding: '32px', border: '3px solid var(--glass-border)', marginBottom: '48px' }}>
        <h3 style={{ fontSize: '22px', borderBottom: '3px solid var(--glass-border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <HelpCircle size={24} style={{ color: 'var(--accent-color)' }} /> Frequently Asked Questions
        </h3>

        <div className="flex-column" style={{ gap: '20px' }}>
          {[
            { q: "How does the AI handle emergencies?", a: "The system continuously listens for panic markers or requests to reach emergency personnel. If verified, the line will transfer to clinical triage or prompt local assistance." },
            { q: "Is third-party data collection active?", a: "Absolutely not. Data collected is entirely sequestered for local operational metrics and automated tracking rules." },
            { q: "What models generate patient insights?", a: "We use the Gemini Pro API suite alongside internal operational rulesets to construct appropriate responses." },
            { q: "How do I customize automated voice scripts?", a: "Head into System Settings. Prompts are editable dynamically so agents adapt to varied clinic environments." },
            { q: "Can we export raw data logs?", a: "Yes. Under the Patient Logs layout, administrators easily download CSV datasets with audit trails." }
          ].map((faq, index) => (
            <div key={index} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowRight size={14} style={{ color: 'var(--accent-color)' }} /> {faq.q}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, paddingLeft: '22px' }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
