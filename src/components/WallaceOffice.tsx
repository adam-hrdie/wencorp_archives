import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './WallaceOffice.css';

interface WallaceOfficeProps {
  children?: React.ReactNode;
}

const WallaceOffice: React.FC<WallaceOfficeProps> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create ambient drone sound
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(60, audioContext.currentTime); // Deep bass drone
    gainNode.gain.setValueAtTime(0.03, audioContext.currentTime); // Very subtle

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();

    return () => {
      oscillator.stop();
      audioContext.close();
    };
  }, []);

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

      {/* Scanline overlay for cinematic feel */}
      <div className="scanline-overlay" />
    </div>
  );
};

export default WallaceOffice;
