import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PlaybackConsole.css';

interface Mix {
  id: number;
  title: string;
  artist: string;
  runtime: string;
  albumArt: string;
  audioUrl: string;
  soundcloudUrl?: string;
}

interface PlaybackConsoleProps {
  mix: Mix;
  onClose: () => void;
}

export default function PlaybackConsole({ mix, onClose }: PlaybackConsoleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const widgetRef = useRef<any>(null);

  // Waveform visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw waveform bars
      const barCount = 64;
      const barWidth = width / barCount;
      const time = Date.now() * 0.001;

      for (let i = 0; i < barCount; i++) {
        const progress = i / barCount;
        const amplitude = isPlaying
          ? Math.sin(time * 2 + i * 0.5) * 0.5 + 0.5
          : Math.random() * 0.2;

        const barHeight = amplitude * height * 0.8;
        const x = i * barWidth;
        const y = height / 2 - barHeight / 2;

        // Gradient based on position and amplitude
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, `rgba(232, 184, 109, ${amplitude * 0.8})`);
        gradient.addColorStop(0.5, `rgba(212, 165, 116, ${amplitude})`);
        gradient.addColorStop(1, `rgba(204, 119, 34, ${amplitude * 0.6})`);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, barHeight);

        // Glow effect
        if (isPlaying && amplitude > 0.5) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#d4a574';
          ctx.fillRect(x, y, barWidth - 2, barHeight);
          ctx.shadowBlur = 0;
        }
      }

      // Progress line
      const progressX = (currentTime / duration) * width;
      ctx.strokeStyle = '#e8b86d';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#e8b86d';
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, height);
      ctx.stroke();
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTime, duration]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  // Load SoundCloud Widget API
  useEffect(() => {
    if (!mix.soundcloudUrl) {
      setIsLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (iframeRef.current && (window as any).SC) {
        widgetRef.current = (window as any).SC.Widget(iframeRef.current);

        widgetRef.current.bind((window as any).SC.Widget.Events.READY, () => {
          widgetRef.current.getDuration((d: number) => {
            setDuration(d / 1000);
            setIsLoading(false);
          });
        });

        widgetRef.current.bind((window as any).SC.Widget.Events.PLAY_PROGRESS, (e: any) => {
          setCurrentTime(e.currentPosition / 1000);
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [mix.soundcloudUrl]);

  const togglePlayPause = () => {
    if (mix.soundcloudUrl && widgetRef.current) {
      if (isPlaying) {
        widgetRef.current.pause();
      } else {
        widgetRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (mix.soundcloudUrl && widgetRef.current) {
      // SoundCloud volume is 0-100
      widgetRef.current.setVolume(newVolume * 100);
    } else if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="playback-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="playback-console"
          initial={{ scale: 0.8, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button className="console-close" onClick={onClose}>
            <span className="close-icon">✕</span>
          </button>

          {/* Header */}
          <div className="console-header">
            <div className="console-title">
              <span className="console-label">NOW ACCESSING</span>
              <h3 className="console-mix-title">{mix.title}</h3>
              <p className="console-artist">{mix.artist}</p>
            </div>
            <div className="console-status">
              <motion.div
                className="status-indicator"
                animate={{
                  opacity: isLoading ? [0.3, 0.6, 0.3] : isPlaying ? [0.5, 1, 0.5] : 0.3,
                }}
                transition={{
                  duration: isLoading ? 0.8 : 1.5,
                  repeat: Infinity,
                }}
              />
              <span className="status-text">
                {isLoading ? 'LOADING...' : isPlaying ? 'TRANSMITTING' : 'STANDBY'}
              </span>
            </div>
          </div>

          {/* Waveform Visualizer */}
          <div className="console-visualizer">
            <canvas
              ref={canvasRef}
              width={800}
              height={200}
              className="waveform-canvas"
            />
            <div className="visualizer-overlay" />
          </div>

          {/* Time display */}
          <div className="console-time">
            <span className="time-current">{formatTime(currentTime)}</span>
            <div className="time-separator">
              <div className="separator-line" />
            </div>
            <span className="time-total">{mix.runtime}</span>
          </div>

          {/* Controls */}
          <div className="console-controls">
            {/* Previous */}
            <button className="control-btn" disabled>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6L6 18M18 6L10 12L18 18V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Play/Pause */}
            <button className="control-btn control-btn-main" onClick={togglePlayPause} disabled={isLoading}>
              {isLoading ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <motion.circle
                    cx="12"
                    cy="12"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                </svg>
              ) : isPlaying ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M8 6L8 18M16 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M8 6L18 12L8 18V6Z" fill="currentColor"/>
                </svg>
              )}
            </button>

            {/* Next */}
            <button className="control-btn" disabled>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6V18M6 6L14 12L6 18V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Volume */}
          <div className="console-volume">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="volume-icon">
              <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
            <span className="volume-value">{Math.round(volume * 100)}%</span>
          </div>

          {/* Grid decoration */}
          <div className="console-grid" />

          {/* Audio element or SoundCloud iframe */}
          {mix.soundcloudUrl ? (
            <iframe
              ref={iframeRef}
              width="0"
              height="0"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={mix.soundcloudUrl}
              style={{ display: 'none' }}
            />
          ) : (
            <audio ref={audioRef} src={mix.audioUrl} />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
