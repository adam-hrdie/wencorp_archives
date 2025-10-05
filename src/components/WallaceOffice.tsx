import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './WallaceOffice.css';

interface WallaceOfficeProps {
  children?: React.ReactNode;
}

const WallaceOffice: React.FC<WallaceOfficeProps> = ({ children }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Create ambient drone sound
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(60, audioContext.currentTime); // Deep bass drone
    gainNode.gain.setValueAtTime(isAudioEnabled ? 0.03 : 0, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();

    audioContextRef.current = audioContext;
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    return () => {
      oscillator.stop();
      audioContext.close();
    };
  }, []);

  const toggleAudio = () => {
    if (!gainNodeRef.current) return;

    if (isAudioEnabled) {
      // Fade out
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, gainNodeRef.current.context.currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(0, gainNodeRef.current.context.currentTime + 0.5);
      setIsAudioEnabled(false);
    } else {
      // Fade in
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, gainNodeRef.current.context.currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(0.03, gainNodeRef.current.context.currentTime + 0.5);
      setIsAudioEnabled(true);
    }
  };

  return (
    <div className="wallace-office">
      {/* Radial gradient background */}
      <div className="wallace-bg" />

      {/* Ceiling caustic light projection */}
      <motion.div
        className="caustic-ceiling"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floor with amber reflection */}
      <div className="wallace-floor">
        <motion.div
          className="floor-caustic"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Left wall gradient */}
      <div className="wallace-wall wallace-wall-left">
        <motion.div
          className="wall-shimmer"
          animate={{
            opacity: [0.1, 0.3, 0.1],
            x: [-50, 50, -50],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Right wall gradient */}
      <div className="wallace-wall wallace-wall-right">
        <motion.div
          className="wall-shimmer"
          animate={{
            opacity: [0.1, 0.3, 0.1],
            x: [50, -50, 50],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Volumetric light beams from skylight */}
      <motion.div
        className="light-beam-center"
        animate={{
          opacity: [0.15, 0.25, 0.15],
          scaleY: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Atmospheric haze/dust particles */}
      <div className="atmospheric-haze haze-1" />
      <div className="atmospheric-haze haze-2" />
      <div className="atmospheric-haze haze-3" />

      {/* Central altar/desk platform silhouette */}
      <motion.div
        className="central-altar"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <div className="altar-platform" />
        <div className="altar-glow" />
      </motion.div>

      {/* Content overlay */}
      <div className="wallace-content">
        {children}
      </div>

      {/* Audio Toggle */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 1 }}
        style={{
          position: 'fixed',
          top: '6rem',
          left: '2rem',
          zIndex: 999
        }}
      >
        <button
          onClick={toggleAudio}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'linear-gradient(135deg, rgba(42, 30, 0, 0.6), rgba(10, 10, 10, 0.8))',
            border: '1px solid rgba(244, 185, 66, 0.3)',
            color: '#f4b942',
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#f4b942';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(244, 185, 66, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(244, 185, 66, 0.3)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <motion.div
            animate={{
              scale: isAudioEnabled ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isAudioEnabled ? Infinity : 0,
              ease: 'easeInOut',
            }}
            style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isAudioEnabled ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.3"
                />
                <line
                  x1="4"
                  y1="4"
                  x2="20"
                  y2="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </motion.div>

          <span style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            lineHeight: 1.3,
            textAlign: 'left'
          }}>
            DRONE
            <br />
            {isAudioEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        <AnimatePresence>
          {isAudioEnabled && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '16px',
                height: '16px'
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle, #f4b942, transparent)',
                  borderRadius: '50%'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scanline overlay for cinematic feel */}
      <div className="scanline-overlay" />
    </div>
  );
};

export default WallaceOffice;
