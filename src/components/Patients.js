'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, ShieldAlert, CreditCard, FileText, Calendar, Heart, CheckCircle, DollarSign, Activity, Download, Upload } from 'lucide-react';
import { jsPDF } from 'jspdf';

const basePatients = [
  { name: "Liam Sterling", age: 34, diagnosis: "Chronic Hypertension", treatment: "Lisinopril 10mg Daily + Dietary Monitoring", billing: { total: 1200, paid: 1200 }, medications: ["Lisinopril", "Amlodipine"], critical: false },
  { name: "Esther Howard", age: 62, diagnosis: "Type 2 Diabetes Mellitus", treatment: "Metformin 500mg + Continuous Glucose Monitoring", billing: { total: 3450, paid: 1450 }, medications: ["Metformin", "Insulin Glargine"], critical: true },
  { name: "Robert Fox", age: 45, diagnosis: "Acute Bronchitis", treatment: "Azithromycin Course + Albuterol Inhaler", billing: { total: 650, paid: 650 }, medications: ["Azithromycin"], critical: false },
  { name: "Jane Cooper", age: 28, diagnosis: "Mild Clinical Anxiety", treatment: "CBT Counseling + SSRI Prescription", billing: { total: 850, paid: 425 }, medications: ["Sertraline"], critical: false },
  { name: "Cameron Williamson", age: 53, diagnosis: "Osteoarthritis (Knee)", treatment: "Physical Therapy + Intra-articular Injections", billing: { total: 2100, paid: 2100 }, medications: ["Meloxicam"], critical: false },
  { name: "Leslie Alexander", age: 41, diagnosis: "Gastroesophageal Reflux Disease", treatment: "PPI Prescription + Lifestyle Adjustment", billing: { total: 420, paid: 420 }, medications: ["Omeprazole"], critical: false },
  { name: "Wade Warren", age: 71, diagnosis: "Coronary Artery Disease", treatment: "Beta Blockers + Low-Dose Aspirin Therapy", billing: { total: 5600, paid: 0 }, medications: ["Metoprolol", "Aspirin"], critical: true }
];

const downloadPatientRecord = (patient, format = 'txt') => {
  if (format === 'pdf') {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(40, 116, 166);
    doc.text("MEDI-SCHED AI PATIENT REPORT", 105, 20, { align: "center" });
    
    doc.setDrawColor(40, 116, 166);
    doc.setLineWidth(1);
    doc.line(20, 25, 190, 25);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT INFORMATION", 20, 40);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`ID: ${patient.id}`, 20, 50);
    doc.text(`Name: ${patient.name}`, 20, 60);
    doc.text(`Age: ${patient.age}`, 20, 70);
    doc.text(`Last Visit: ${patient.lastVisit}`, 20, 80);
    doc.text(`Status: ${patient.critical ? 'CRITICAL' : 'Stable'}`, 20, 90);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("CLINICAL DETAILS", 20, 110);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Primary Diagnosis:", 20, 120);
    doc.text(patient.diagnosis, 30, 130, { maxWidth: 160 });
    
    doc.text("Treatment Outline:", 20, 145);
    doc.text(patient.treatment, 30, 155, { maxWidth: 160 });
    
    doc.text(`Medications: ${patient.medications.join(', ')}`, 20, 175);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("FINANCIAL OVERVIEW", 20, 195);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Total Billing: ${patient.billing.total}`, 20, 205);
    doc.text(`Amount Paid: ${patient.billing.paid}`, 20, 215);
    doc.text(`Payment Status: ${patient.billing.status}`, 20, 225);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 250, 190, 250);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Confidential Medical Document - For Authorized Use Only", 105, 260, { align: "center" });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 270, { align: "center" });
    
    doc.save(`Patient_Record_${patient.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  } else {
    const recordText = `
==================================================
             MEDI-SCHED AI PATIENT REPORT
==================================================

PATIENT INFORMATION
-------------------
ID: ${patient.id}
Name: ${patient.name}
Age: ${patient.age}
Last Visit: ${patient.lastVisit}
Status: ${patient.critical ? 'CRITICAL' : 'Stable'}

CLINICAL DETAILS
----------------
Primary Diagnosis:
  ${patient.diagnosis}

Treatment Outline:
  ${patient.treatment}

Medications:
  ${patient.medications.join(', ')}

FINANCIAL OVERVIEW
------------------
Total Billing: ${patient.billing.total}
Amount Paid:   ${patient.billing.paid}
Payment Status: ${patient.billing.status}

==================================================
Confidential Medical Document - For Authorized Use Only
Generated on: ${new Date().toLocaleString()}
==================================================
`.trim();

    const blob = new Blob([recordText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Patient_Record_${patient.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

const PATIENTS_DATA = Array.from({ length: 48 }, (_, i) => {
  const base = basePatients[i % basePatients.length];
  const names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
  const firstNames = ["John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen"];
  
  const generatedName = i < basePatients.length ? base.name : `${firstNames[i % firstNames.length]} ${names[i % names.length]}`;
  const randomPaid = i % 3 === 0 ? Math.floor(base.billing.total / 2) : base.billing.total;
  const status = randomPaid === base.billing.total ? "Settled" : "Outstanding";
  
  return {
    id: i + 1,
    name: generatedName,
    age: base.age + (i % 15) - 7,
    diagnosis: base.diagnosis,
    treatment: base.treatment,
    lastVisit: `2026-04-${String(Math.max(1, 28 - (i % 28))).padStart(2, '0')}`,
    billing: { 
      total: `$${base.billing.total.toLocaleString()}`, 
      paid: `$${randomPaid.toLocaleString()}`, 
      status 
    },
    medications: base.medications,
    critical: i % 8 === 0
  };
});

export default function Patients() {
  const [patients, setPatients] = useState(PATIENTS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Critical' && patient.critical) || 
                         (filterStatus === 'Outstanding' && patient.billing.status === 'Outstanding');
    return matchesSearch && matchesStatus;
  });

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          const validPatients = imported.map((p, index) => ({
            id: p.id || patients.length + index + 1,
            name: p.name || "Unknown Patient",
            age: p.age || 30,
            diagnosis: p.diagnosis || "N/A",
            treatment: p.treatment || "N/A",
            lastVisit: p.lastVisit || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
            billing: {
              total: p.billing?.total || "$0",
              paid: p.billing?.paid || "$0",
              status: p.billing?.status || "Settled"
            },
            medications: Array.isArray(p.medications) ? p.medications : [],
            critical: !!p.critical
          }));
          setPatients(prev => [...validPatients, ...prev]);
          alert(`Successfully imported ${validPatients.length} patients!`);
        } else if (typeof imported === 'object') {
          const p = imported;
          const validPatient = {
            id: p.id || patients.length + 1,
            name: p.name || "Unknown Patient",
            age: p.age || 30,
            diagnosis: p.diagnosis || "N/A",
            treatment: p.treatment || "N/A",
            lastVisit: p.lastVisit || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
            billing: {
              total: p.billing?.total || "$0",
              paid: p.billing?.paid || "$0",
              status: p.billing?.status || "Settled"
            },
            medications: Array.isArray(p.medications) ? p.medications : [],
            critical: !!p.critical
          };
          setPatients(prev => [validPatient, ...prev]);
          alert(`Successfully imported patient: ${validPatient.name}`);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to parse JSON file. Please ensure it's a valid patient record JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="animate-fade-in content-padding" style={{ paddingBottom: '100px', position: 'relative', zIndex: 10 }}>
      
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Patient Medical Records
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', lineHeight: 1.5 }}>
          Securely monitor patient histories, ongoing clinical treatments, automated billing analytics, and urgent health statuses.
        </p>
      </div>

      {/* Search Bar & Filters */}
      <div className="glass-card flex-between" style={{ padding: '16px 24px', marginBottom: '32px', border: '1px solid var(--glass-border)', gap: '20px', flexWrap: 'wrap' }}>
        <div className="flex-center" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px 16px', border: '1px solid var(--glass-border)', flex: 1, minWidth: '280px', gap: '12px' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by patient name or diagnosis..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%', padding: '12px 0', fontSize: '14px' }}
          />
        </div>
        <div className="flex-center" style={{ gap: '10px' }}>
          {['All', 'Critical', 'Outstanding'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                background: filterStatus === status ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                color: filterStatus === status ? '#000' : 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {status}
            </button>
          ))}
          
          <label
            className="flex-center"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--accent-color)',
              border: '1px solid var(--glass-border)',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              gap: '6px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
          >
            <Upload size={16} />
            Import Details
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* Patients Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {filteredPatients.map(p => (
          <motion.div 
            key={p.id}
            className="glass-card"
            style={{
              padding: '32px',
              border: '5px solid #FFFFFF',
              borderTop: p.critical ? '5px solid var(--danger)' : '5px solid #FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              background: 'rgba(10, 10, 12, 0.6)',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{ transform: 'translateY(-5px)', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            {p.critical && (
              <div style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
                <ShieldAlert size={16} /> Critical Alert
              </div>
            )}

            {/* Profile Header */}
            <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '16px' }}>
              <div className="flex-center" style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--accent-color)' }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#FFF', marginBottom: '4px' }}>{p.name}</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Age: {p.age} &bull; Last Visit: {p.lastVisit}</div>
              </div>
            </div>

            {/* Medical Data */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary Diagnosis</div>
                  <div style={{ fontSize: '15px', color: '#FFF', fontWeight: 500, marginTop: '4px' }}>{p.diagnosis}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Treatment Outline</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>{p.treatment}</div>
                </div>
              </div>
            </div>

            {/* Billing and Medications */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '6px', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '6px' }}>
                  <CreditCard size={14} />
                  <span>Financials</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: p.billing.status === 'Settled' ? 'var(--success)' : 'var(--warning)' }}>
                  {p.billing.paid} / {p.billing.total}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Status: {p.billing.status}</div>
              </div>

              <div>
                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '6px', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '6px' }}>
                  <Heart size={14} />
                  <span>Medications</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {p.medications.map(m => (
                    <span key={m} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ flexGrow: 1 }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
              <button
                onClick={() => downloadPatientRecord(p, 'txt')}
                className="flex-center"
                style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  color: 'var(--accent-color)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                <Download size={14} />
                TXT Report
              </button>
              <button
                onClick={() => downloadPatientRecord(p, 'pdf')}
                className="flex-center"
                style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  color: 'var(--accent-color)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                <FileText size={14} />
                PDF Report
              </button>
            </div>

          </motion.div>
        ))}
      </div>
      
    </div>
  );
}
