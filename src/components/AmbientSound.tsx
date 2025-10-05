import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AmbientSound.css';
import ambientAudio from './65175__timkahn__refridgerator_coils.mp3';

export default function AmbientSound() {
  const [isEnabled, setIsEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = 'auto';

    // Try to load the AIFF file
    audio.src = ambientAudio;

    // Add error handler
    audio.addEventListener('error', (e) => {
      console.warn('Audio file could not be loaded. AIFF format may not be supported by this browser.');
      console.warn('Please convert the audio file to MP3 or OGG format for better browser compatibility.');
    });

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAmbient = () => {
    if (!audioRef.current) return;

    if (isEnabled) {
      // Fade out
      const fadeOut = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.05) {
          audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.05);
        } else {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.volume = 0.4;
          }
          clearInterval(fadeOut);
        }
      }, 50);
      setIsEnabled(false);
    } else {
      // Fade in
      audioRef.current.volume = 0;
      audioRef.current.play();
      const fadeIn = setInterval(() => {
        if (audioRef.current && audioRef.current.volume < 0.35) {
          audioRef.current.volume = Math.min(0.4, audioRef.current.volume + 0.05);
        } else {
          clearInterval(fadeIn);
        }
      }, 50);
      setIsEnabled(true);
    }
  };

  return (
    <motion.div
      className="ambient-control"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 1 }}
    >
      <button
        className="ambient-toggle"
        onClick={toggleAmbient}
        disabled={!audioRef.current}
      >
        <motion.div
          className="ambient-icon"
          animate={{
            scale: isEnabled ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: isEnabled ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {isEnabled ? (
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

        <span className="ambient-label">
          AMBIENT
          <br />
          {isEnabled ? 'ON' : 'OFF'}
        </span>
      </button>

      <AnimatePresence>
        {isEnabled && (
          <motion.div
            className="ambient-indicator"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <motion.div
              className="indicator-pulse"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
