'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Force hide default cursor globally
    const style = document.createElement('style');
    style.id = 'custom-cursor-hide-default';
    style.innerHTML = `
      * { cursor: none !important; }
      a, button, select, input, [role="button"] { cursor: none !important; }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      const existingStyle = document.getElementById('custom-cursor-hide-default');
      if (existingStyle) existingStyle.remove();
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: mouseX,
        y: mouseY,
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: '#FFFFFF',
        boxShadow: '0 0 8px rgba(255, 255, 255, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)',
        pointerEvents: 'none',
        zIndex: 999999,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        scale: isClicking ? 0.75 : 1,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    />
  );
}
