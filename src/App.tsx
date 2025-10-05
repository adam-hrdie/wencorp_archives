import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import './App.css';
import MixVault from './components/MixVault';
import PlaybackConsole from './components/PlaybackConsole';
import AmbientSound from './components/AmbientSound';
import WencorpLogo from './components/WencorpLogo';
import WallaceOffice from './components/WallaceOffice';
import Dust from './components/Dust';

const MIXES = [
  {
    id: 1,
    title: '130-140 BPM TEST',
    artist: 'DJ DIEHARD + DRNO1',
    runtime: '60:00',
    albumArt: 'https://picsum.photos/seed/mix1/400/400',
    audioUrl: '',
    soundcloudUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2180324547&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true'
  },
  {
    id: 2,
    title: 'DNB + DUBSTEP',
    artist: 'MSL + DRNO1',
    runtime: '60:00',
    albumArt: 'https://picsum.photos/seed/mix3/400/400',
    audioUrl: '',
    soundcloudUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%3Atracks%3A2180318663%3Fsecret_token%3Ds-XPCxfjoTBXl&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true'
  },
  {
    id: 3,
    title: 'DUB ON WAX',
    artist: 'YETI',
    runtime: '120:00',
    albumArt: 'https://picsum.photos/seed/mix3/400/400',
    audioUrl: '',
    soundcloudUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2176689102&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true'
  },
  {
    id: 4,
    title: '170-180 BPM TEST',
    artist: 'DIEHARD B2B STATELESS B2B MSL',
    runtime: '76:46',
    albumArt: 'https://picsum.photos/seed/mix2/400/400',
    audioUrl: '',
    soundcloudUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%3Atracks%3A2088560235%3Fsecret_token%3Ds-y1SJrW3n9dn&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true'
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState<'splash' | 'transmissions' | 'ambient'>('splash');
  const [selectedMix, setSelectedMix] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollProgress(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // All hooks must be called at top level
  const ambientColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#d4a574', '#e8b86d', '#cc7722']
  );

  const beamOpacity1 = useTransform(scrollYProgress, [0, 0.3], [0.15, 0.05]);
  const beamOpacity2 = useTransform(scrollYProgress, [0.3, 0.7], [0.05, 0.15]);
  const dividerScale = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const footerOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  return (
    <div className="app-container" ref={containerRef}>
      {currentPage === 'ambient' ? (
        // AMBIENT SYSTEMS PAGE (Wallace Office)
        <WallaceOffice>
          <motion.button
            onClick={() => setCurrentPage('splash')}
            style={{
              position: 'fixed',
              top: '2rem',
              left: '2rem',
              padding: '0.75rem 1.5rem',
              border: '1px solid rgba(244, 185, 66, 0.4)',
              color: '#f4b942',
              background: 'rgba(0, 0, 0, 0.5)',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif',
              zIndex: 100
            }}
            whileHover={{
              borderColor: 'rgba(244, 185, 66, 0.8)',
              boxShadow: '0 0 15px rgba(244, 185, 66, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            ← RETURN
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 1.5 }}
            style={{
              textAlign: 'center',
              color: '#f4b942',
              textShadow: '0 0 20px rgba(244, 185, 66, 0.5)',
              maxWidth: '1200px',
              width: '100%',
              padding: '0 2rem'
            }}
          >
            <h1 style={{
              fontSize: '3rem',
              letterSpacing: '0.3em',
              fontWeight: 300,
              fontFamily: 'Rajdhani, sans-serif',
              marginBottom: '1rem'
            }}>
              AMBIENT SYSTEMS
            </h1>
            <p style={{
              fontSize: '0.875rem',
              letterSpacing: '0.2em',
              opacity: 0.6,
              fontFamily: 'Courier New, monospace',
              marginBottom: '4rem'
            }}>
              FOR THE CONTINUITY OF SOUND
            </p>

            {/* Spotify Playlists */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem',
              marginTop: '3rem'
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 2 }}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(244, 185, 66, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <iframe
                  data-testid="embed-iframe"
                  style={{ borderRadius: '12px' }}
                  src="https://open.spotify.com/embed/playlist/0Toddq8bzNqjlefwuUKmrp?utm_source=generator"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 2.2 }}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(244, 185, 66, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <iframe
                  data-testid="embed-iframe"
                  style={{ borderRadius: '12px' }}
                  src="https://open.spotify.com/embed/playlist/49ewHzvNvGqTYAg7hDZty2?utm_source=generator"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 2.4 }}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(244, 185, 66, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <iframe
                  data-testid="embed-iframe"
                  style={{ borderRadius: '12px' }}
                  src="https://open.spotify.com/embed/playlist/1eb5Z8zsMpbtbmUQ7ANdRE?utm_source=generator"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 2.6 }}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(244, 185, 66, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <iframe
                  data-testid="embed-iframe"
                  style={{ borderRadius: '12px' }}
                  src="https://open.spotify.com/embed/playlist/4aS2d7LVrqDNIMZpqASeVK?utm_source=generator"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </motion.div>
        </WallaceOffice>
      ) : currentPage === 'splash' ? (
        // SPLASH PAGE (no scroll)
        <div style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #0a0907, #1a1410, #000)'
        }}>
          <AmbientSound />

          {/* System Info */}
          <motion.div
            className="system-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <div className="sys-line">SYS: WENCORP_ARCHIVE_V2.049</div>
            <div className="sys-line">SEC: LEVEL_5_CLEARANCE</div>
            <div className="sys-line">
              STATUS: <span className="sys-active">ACTIVE</span>
            </div>
          </motion.div>

          <section className="landing-section">
            <motion.div
              className="title-container"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: 'easeOut' }}
            >
              <WencorpLogo />

              <h1 className="main-title">
                <span className="glitch-text-sub">ARCHIVES</span>
              </h1>
              <motion.div
                className="subtitle"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                CORPORATE MEMORY CORE
              </motion.div>
            </motion.div>

            {/* Archive Vault Drawer */}
            <motion.div
              className="archive-vault-container"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 1, ease: 'easeOut' }}
            >
              <div className="archive-header">
                ▼ VAULT ACCESS DIRECTORY ▼
              </div>

              <div className="vault-drawer">
                <motion.div
                  className="vault-slot"
                  onClick={() => setCurrentPage('transmissions')}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="vault-label">
                    <span>CLASSIFIED TRANSMISSIONS</span>
                    <span className="vault-status">READY</span>
                  </div>
                </motion.div>

                <motion.div
                  className="vault-slot vault-slot-locked"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <div className="vault-label">
                    <span>LIVE DATA STREAM</span>
                    <span className="vault-status">LOCKED</span>
                  </div>
                </motion.div>

                <motion.div
                  className="vault-slot"
                  onClick={() => setCurrentPage('ambient')}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="vault-label">
                    <span>AMBIENT SYSTEMS</span>
                    <span className="vault-status">READY</span>
                  </div>
                </motion.div>

                <motion.div
                  className="vault-slot"
                  onClick={() => window.open('https://wenfest.vercel.app/', '_blank')}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="vault-label">
                    <span>FIELD_001 [WENFEST]</span>
                    <span className="vault-status">READY</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>
        </div>
      ) : (
        // CLASSIFIED TRANSMISSIONS PAGE (with scroll)
        <>
          {/* Floating Dust Particles */}
          <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
            <Canvas
              camera={{ position: [0, 1.5, 3], fov: 60 }}
              style={{ pointerEvents: 'none' }}
            >
              <Dust count={800} />
            </Canvas>
          </div>

          {/* Animated background gradients */}
          <div className="fixed inset-0 bg-gradient-to-b from-[#2a1e00] via-black to-black" />

          {/* Caustic overlay */}
          <div className="caustic-overlay" />

          {/* Volumetric light beams */}
          <motion.div
            className="light-beam beam-1"
            style={{
              opacity: beamOpacity1
            }}
          />
          <motion.div
            className="light-beam beam-2"
            style={{
              opacity: beamOpacity2
            }}
          />

          {/* Landing Section */}
          <section className="landing-section">
            <motion.div
                className="subtitle"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              WENCORP ARCHIVES
            </motion.div>
            <motion.div
              className="title-container"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: 'easeOut' }}
            >
              <h1 className="main-title">
                <span className="glitch-text-sub">CLASSIFIED TRANSMISSIONS</span>
              </h1>

            </motion.div>

            <motion.div
              className="scroll-indicator"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="scroll-line" />
              <span className="scroll-text">SCROLL TO ACCESS</span>
            </motion.div>
          </section>

          {/* Mix Vaults Section */}
          <section className="vaults-section">
            <div className="section-divider">
              <motion.div
                className="divider-line"
                style={{
                  scaleX: dividerScale
                }}
              />
            </div>

            {MIXES.map((mix, index) => (
              <motion.div
                key={mix.id}
                className="vault-container"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 1.5 }}
              >
                <MixVault
                  mix={mix}
                  index={index}
                  onSelect={() => setSelectedMix(mix.id)}
                  isActive={selectedMix === mix.id}
                />
              </motion.div>
            ))}
          </section>

          {/* Playback Console */}
          {selectedMix && (
            <PlaybackConsole
              mix={MIXES.find(m => m.id === selectedMix)!}
              onClose={() => setSelectedMix(null)}
            />
          )}

          {/* Footer */}
          <footer className="footer-section">
            <motion.div
              className="footer-content"
              style={{
                opacity: footerOpacity
              }}
            >
              <div className="footer-grid" />
              <p className="footer-text">
                ALL RECORDINGS PROPERTY OF WENCORP
                <br />
                UNAUTHORIZED REPLICATION IS A CRIME
              </p>
            </motion.div>
          </footer>

          {/* Back button */}
          <motion.button
            onClick={() => setCurrentPage('splash')}
            style={{
              position: 'fixed',
              top: '2rem',
              left: '2rem',
              padding: '0.75rem 1.5rem',
              border: '1px solid rgba(212, 165, 116, 0.4)',
              color: '#d4a574',
              background: 'rgba(0, 0, 0, 0.5)',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif',
              zIndex: 100
            }}
            whileHover={{
              borderColor: 'rgba(212, 165, 116, 0.8)',
              boxShadow: '0 0 15px rgba(212, 165, 116, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            ← RETURN
          </motion.button>
        </>
      )}
    </div>
  );
}

export default App;
