'use client';
import { motion } from 'framer-motion';
import { ChevronDown, LogOut } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_session');
    window.location.reload();
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflow: 'hidden', background: 'transparent', display: 'flex', alignItems: 'center' }}>
      {/* Neon Glowing Spotlights - Hero Only */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        {/* White Spotlight 1 */}
        <motion.div 
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '10%', left: '5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 75%)', filter: 'blur(60px)', willChange: 'transform' }}
        />
        {/* White Spotlight 2 */}
        <motion.div 
          animate={{ opacity: [0.5, 0.8, 0.5], scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ position: 'absolute', bottom: '5%', right: '20%', width: '750px', height: '750px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 75%)', filter: 'blur(80px)', willChange: 'transform' }}
        />
        {/* White Spotlight 3 */}
        <motion.div 
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1.1, 1.2, 1.1], y: [0, 40, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          style={{ position: 'absolute', top: '35%', right: '0%', width: '550px', height: '550px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 75%)', filter: 'blur(50px)', willChange: 'transform' }}
        />
      </div>


      <div style={{ 
        width: '100%', 
        maxWidth: '100%', 
        margin: '0 auto', 
        padding: '0 60px', 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        alignItems: 'center', 
        gap: '60px',
        zIndex: 2 
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{ fontSize: '144px', fontWeight: '800', letterSpacing: '-0.06em', background: 'linear-gradient(180deg, #FFFFFF 0%, #8E8E93 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '24px', lineHeight: '1.0', whiteSpace: 'nowrap' }}>
            MediSched AI
          </h1>
          
          <h2 style={{ fontSize: '48px', fontWeight: '500', lineHeight: '1.2', color: 'var(--text-primary)', marginBottom: '32px', letterSpacing: '-0.02em' }}>
            Intelligent workflow management. Built for modern medicine.
          </h2>

          <p style={{ fontSize: '24px', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '750px' }}>
            Seamless scheduling integrations, automated outreach protocols, and comprehensive diagnostic workflows mapped intuitively.
          </p>
        </motion.div>

        {/* 3D Rotating Logo Container */}
        <div style={{ 
          width: '480px', 
          height: '480px', 
          perspective: '1500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          justifySelf: 'end'
        }}>
          {/* SVG Gradient & Filter Definitions */}
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id="diamondBlackHero" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1C1C1E" />
                <stop offset="50%" stopColor="#2C2C2E" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
              <clipPath id="logoClipHero">
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
                  transform: `translateZ(${i * 2.5}px)`,
                  opacity: (i === 0 || i === 14) ? 1 : 0.8,
                  willChange: 'transform'
                }}
              >
                {/* Base Layer */}
                <rect width="100" height="100" rx="24" fill={ (i === 0 || i === 14) ? "url(#diamondBlackHero)" : "#1C1C1E"} />
                
                {/* High-Detail Diamond Facets (Only on front and back faces) */}
                {(i === 0 || i === 14) && (
                  <g clipPath="url(#logoClipHero)">
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

                {/* Central Plus Icon - White */}
                {(i === 0 || i === 14) && (
                  <path 
                    d="M42 28 C 42 25, 58 25, 58 28 V 42 H 72 C 75 42, 75 58, 72 58 H 58 V 72 C 58 75, 42 75, 42 72 V 58 H 28 C 25 58, 25 42, 28 42 H 42 V 28 Z" 
                    fill="#FFFFFF" 
                  />
                )}
              </svg>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateZ(35px) rotate(45deg) translateX(-100%); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateZ(35px) rotate(45deg) translateX(100%); opacity: 0; }
        }
        @keyframes rotate3D {
          0% { transform: rotateY(0deg) rotateX(15deg); }
          100% { transform: rotateY(360deg) rotateX(15deg); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
          60% { transform: translateY(-3px); }
        }
      `}} />
    </div>
  );
}
