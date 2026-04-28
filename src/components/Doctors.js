'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Search, Calendar, Award, Star, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

const baseDoctors = [
  { name: "Dr. Sarah Jenkins", role: "Chief Cardiologist", qualifications: "MD (Harvard Medical School)", specialties: ["Cardiology"] },
  { name: "Dr. Marcus Vance", role: "Lead Radiologist", qualifications: "MD, PhD (Johns Hopkins University)", specialties: ["Radiology"] },
  { name: "Dr. Elena Rostova", role: "Orthopedic Specialist", qualifications: "MD (Stanford University)", specialties: ["Orthopedics"] },
  { name: "Dr. James Liang", role: "Neurology Consultant", qualifications: "MD (Mayo Clinic)", specialties: ["Neurology"] },
  { name: "Dr. Aisha Rahman", role: "Pediatrician", qualifications: "MD (Yale University)", specialties: ["Pediatrics"] },
  { name: "Dr. Robert Chen", role: "Oncologist", qualifications: "MD, PhD (University of Pennsylvania)", specialties: ["Oncology"] },
  { name: "Dr. Sophia Martinez", role: "Dermatologist", qualifications: "MD (Stanford University)", specialties: ["Dermatology"] },
  { name: "Dr. William Thorne", role: "Gastroenterologist", qualifications: "MD (Columbia University)", specialties: ["Gastroenterology"] },
  { name: "Dr. Chloe Dubois", role: "Endocrinologist", qualifications: "MD (Sorbonne University)", specialties: ["Endocrinology"] },
  { name: "Dr. Dev Patel", role: "Ophthalmologist", qualifications: "MD (UC San Francisco)", specialties: ["Ophthalmology"] }
];

const DOCTORS_DATA = Array.from({ length: 48 }, (_, i) => {
  const base = baseDoctors[i % baseDoctors.length];
  const names = ["Smith", "Jones", "Taylor", "Brown", "Wilson", "Johnson", "Davies", "Robinson", "Wright", "Thompson", "Evans", "Walker", "White", "Roberts", "Green", "Hall", "Wood", "Jackson", "Clarke"];
  const generatedName = i < baseDoctors.length ? base.name : `Dr. ${base.name.split(' ')[1]} ${names[i % names.length]}`;
  
  return {
    id: i + 1,
    name: generatedName,
    role: base.role,
    qualifications: base.qualifications,
    specialties: base.specialties,
    rating: parseFloat((4.5 + (i % 6) * 0.1).toFixed(1)),
    patientsServed: `${1000 + (i * 85)}+`,
    experience: `${5 + (i % 15)} Years`,
    availableSlots: ["09:00 AM", "11:30 AM", "02:00 PM"].slice(0, 1 + (i % 3)),
    status: i % 5 === 0 ? "On Call" : "Active"
  };
});

export default function Doctors() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  const specialties = ['All', ...new Set(DOCTORS_DATA.flatMap(d => d.specialties))];

  const filteredDoctors = DOCTORS_DATA.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const handleBookSlot = (docName, slot) => {
    setBookingConfirmed({ doctor: docName, time: slot });
    setTimeout(() => setBookingConfirmed(null), 4000);
  };

  return (
    <div className="animate-fade-in content-padding" style={{ paddingBottom: '100px', position: 'relative', zIndex: 10 }}>
      
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Clinical Staff & Specialists
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', lineHeight: 1.5 }}>
          Review clinical metrics, verified qualifications, and manage direct appointment availability workflows.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card flex-center" style={{ padding: '16px 24px', gap: '20px', marginBottom: '32px', border: '1px solid var(--glass-border)', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div className="flex-center" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px 16px', border: '1px solid var(--glass-border)', flex: 1, minWidth: '280px', gap: '12px' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name, role or specialty..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%', padding: '12px 0', fontSize: '14px' }}
          />
        </div>
        <div className="flex-center" style={{ gap: '8px', flexWrap: 'wrap' }}>
          {specialties.map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              style={{
                background: selectedSpecialty === spec ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                color: selectedSpecialty === spec ? '#000' : 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation Toast */}
      {bookingConfirmed && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }}
          style={{ position: 'fixed', top: '100px', right: '40px', background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '2px solid var(--success)', padding: '16px 24px', borderRadius: '12px', zIndex: 999, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <CheckCircle2 style={{ color: 'var(--success)' }} />
          <div>
            <div style={{ fontWeight: 600, color: '#FFF' }}>Slot Reserved Successfully</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{bookingConfirmed.doctor} at {bookingConfirmed.time}</div>
          </div>
        </motion.div>
      )}

      {/* Doctors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {filteredDoctors.map(doc => (
          <motion.div 
            key={doc.id} 
            className="glass-card" 
            style={{ padding: '32px', border: '5px solid #FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px', position: 'relative', overflow: 'hidden' }}
            whileHover={{ transform: 'translateY(-5px)', borderColor: 'rgba(255,255,255,0.25)' }}
          >
            {/* Status Indicator */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'rgba(0,0,0,0.3)', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: doc.status === 'Active' ? 'var(--success)' : 'var(--warning)' }}></span>
              {doc.status}
            </div>

            {/* Top profile block */}
            <div>
              <div className="flex-center" style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', color: 'var(--accent-color)', marginBottom: '16px', justifyContent: 'center' }}>
                <User size={30} />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#FFF', marginBottom: '4px' }}>{doc.name}</h3>
              <div style={{ color: 'var(--accent-color)', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>{doc.role}</div>
              
              <div className="flex-center" style={{ gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', justifyContent: 'flex-start' }}>
                <Award size={16} />
                <span>{doc.qualifications}</span>
              </div>

              {/* Removed Tags / Specialties */}

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#FFF', marginTop: '4px' }}>{doc.experience}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patients</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#FFF', marginTop: '4px' }}>{doc.patientsServed}</div>
                </div>
              </div>
            </div>

            {/* Available Slots */}
            <div>
              <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '8px', marginBottom: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Clock size={16} />
                <span style={{ fontWeight: 500 }}>Available Consultations</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {doc.availableSlots.map(slot => (
                  <button 
                    key={slot}
                    onClick={() => handleBookSlot(doc.name, slot)}
                    className="slot-btn"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-primary)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .slot-btn:hover {
          background: var(--accent-color) !important;
          color: #000 !important;
          border-color: var(--accent-color) !important;
          transform: scale(1.05);
        }
      `}} />
    </div>
  );
}
