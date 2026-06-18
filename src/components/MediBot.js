'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

export default function MediBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am MediBot. How can I help you with MediSched AI today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid response from server. Check backend configuration.');
      }

      if (response.ok && data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        const errorMsg = data.error || 'Sorry, I encountered an error. Please try again.';
        setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: error.message === 'Failed to fetch' ? 'Network error. Please check your connection.' : error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '32px', 
      right: '32px', 
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      pointerEvents: 'none'
    }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              width: '400px',
              height: '550px',
              background: 'linear-gradient(135deg, #F0F0F2 0%, #FFFFFF 15%, #E1E1E5 30%, #FFFFFF 45%, #B8B8BD 60%, #FFFFFF 75%, #D1D1D6 90%, #A1A1A6 100%)',
              borderRadius: '32px',
              border: '1px solid rgba(255,255,255,1)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,255,255,1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              marginBottom: '20px',
              pointerEvents: 'auto'
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', position: 'relative', height: '160px', width: '100%', flexShrink: 0 }}>
              <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', color: '#1C1C1E', zIndex: 10 }}>
                <X size={24} />
              </button>
              
              <div style={{ width: '80px', height: '80px', perspective: '1000px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                  <defs>
                    <linearGradient id="diamondBlackBot" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1C1C1E" />
                      <stop offset="50%" stopColor="#2C2C2E" />
                      <stop offset="100%" stopColor="#000000" />
                    </linearGradient>
                    <clipPath id="logoClipBot">
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
                      <rect width="100" height="100" rx="24" fill={ (i === 0 || i === 11) ? "url(#diamondBlackBot)" : "#1C1C1E"} />
                      {(i === 0 || i === 11) && (
                        <g clipPath="url(#logoClipBot)">
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '8px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1C1C1E', margin: 0 }}>MediBot</h3>
                <p style={{ fontSize: '12px', color: '#636366', fontWeight: 600, margin: 0 }}>AI Health Assistant</p>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', 
                  gap: '8px',
                  alignItems: 'flex-end'
                }}>
                  <div style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '50%', 
                    background: msg.role === 'user' ? '#007AFF' : '#1C1C1E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div style={{ 
                    maxWidth: '80%', 
                    padding: '12px 16px', 
                    borderRadius: '16px',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap',
                    background: msg.role === 'user' ? '#007AFF' : '#F2F2F7',
                    color: msg.role === 'user' ? 'white' : '#1C1C1E',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    border: msg.role === 'user' ? 'none' : '1px solid rgba(0,0,0,0.05)'
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1C1C1E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Bot size={16} />
                  </div>
                  <div style={{ padding: '12px 16px', borderRadius: '16px', background: '#F2F2F7', color: '#1C1C1E' }}>
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Thinking...
                    </motion.div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: '20px', borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask MediBot..."
                style={{
                  flex: 1,
                  background: '#FFFFFF',
                  border: '1px solid #C7C7CC',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#1C1C1E',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#1C1C1E',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '64px',
          height: '64px',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: 'none',
          padding: 0,
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))',
          pointerEvents: 'auto'
        }}
      >
        <div style={{ width: '56px', height: '56px', perspective: '800px', position: 'relative' }}>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id="diamondWhiteTrigger" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F2F2F7" />
                <stop offset="100%" stopColor="#D1D1D6" />
              </linearGradient>
              <clipPath id="logoClipWhiteTrigger">
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
                <rect width="100" height="100" rx="24" fill={ (i === 0 || i === 11) ? "url(#diamondWhiteTrigger)" : "#E5E5EA"} />
                {(i === 0 || i === 11) && (
                  <g clipPath="url(#logoClipWhiteTrigger)">
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
                {(i === 0 || i === 11) && (
                  <path 
                    d="M42 28 C 42 25, 58 25, 58 28 V 42 H 72 C 75 42, 75 58, 72 58 H 58 V 72 C 58 75, 42 75, 42 72 V 58 H 28 C 25 58, 25 42, 28 42 H 42 V 28 Z" 
                    fill="#000000" 
                  />
                )}
              </svg>
            ))}
          </div>
        </div>
      </motion.button>
    </div>
  );
}
