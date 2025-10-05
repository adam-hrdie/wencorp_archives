import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import './App.css';
import MixVault from './components/MixVault';
import PlaybackConsole from './components/PlaybackConsole';
import AmbientSound from './components/AmbientSound';
import WencorpLogo from './components/WencorpLogo';

const MIXES = [
  {
    id: 1,
    title: 'REPLICANT DREAMS',
    artist: 'DJ DIEHARD',
    runtime: '72:34',
    albumArt: 'https://picsum.photos/seed/mix1/400/400',
    audioUrl: ''
  },
  {
    id: 2,
    title: 'NEON PULSE',
    artist: '4D + DR NO1',
    runtime: '58:16',
    albumArt: 'https://picsum.photos/seed/mix2/400/400',
    audioUrl: ''
  },
  {
    id: 3,
    title: 'BASELINE TEST',
    artist: 'MSL B2B STATELESS',
    runtime: '81:42',
    albumArt: 'https://picsum.photos/seed/mix3/400/400',
    audioUrl: ''
  },
  {
    id: 4,
    title: 'DUB EXPLORATION',
    artist: 'YETI',
    runtime: '60:00',
    albumArt: 'https://picsum.photos/seed/mix3/400/400',
    audioUrl: ''
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState<'splash' | 'transmissions'>('splash');
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
      {currentPage === 'splash' ? (
        // SPLASH PAGE (no scroll)
        <div style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #0a0907, #1a1410, #000)'
        }}>
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
                ACCESS VAULT
              </motion.div>
            </motion.div>

            {/* Vault Selection Buttons */}
            <motion.div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                marginTop: '4rem'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 1 }}
            >
              <motion.button
                onClick={() => setCurrentPage('transmissions')}
                style={{
                  padding: '1rem 3rem',
                  border: '1px solid rgba(212, 165, 116, 0.4)',
                  color: '#d4a574',
                  background: 'transparent',
                  fontSize: '0.875rem',
                  letterSpacing: '0.2em',
                  cursor: 'pointer',
                  fontFamily: 'Rajdhani, sans-serif'
                }}
                whileHover={{
                  scale: 1.05,
                  borderColor: 'rgba(212, 165, 116, 0.8)',
                  boxShadow: '0 0 20px rgba(212, 165, 116, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                CLASSIFIED TRANSMISSIONS
              </motion.button>

              <motion.button
                style={{
                  padding: '1rem 3rem',
                  border: '1px solid rgba(212, 165, 116, 0.2)',
                  color: 'rgba(212, 165, 116, 0.3)',
                  background: 'transparent',
                  fontSize: '0.875rem',
                  letterSpacing: '0.2em',
                  cursor: 'not-allowed',
                  fontFamily: 'Rajdhani, sans-serif'
                }}
              >
                LIVE DATA STREAM [LOCKED]
              </motion.button>

              <motion.button
                style={{
                  padding: '1rem 3rem',
                  border: '1px solid rgba(212, 165, 116, 0.2)',
                  color: 'rgba(212, 165, 116, 0.3)',
                  background: 'transparent',
                  fontSize: '0.875rem',
                  letterSpacing: '0.2em',
                  cursor: 'not-allowed',
                  fontFamily: 'Rajdhani, sans-serif'
                }}
              >
                AMBIENT SYSTEMS [LOCKED]
              </motion.button>
            </motion.div>
          </section>
        </div>
      ) : (
        // CLASSIFIED TRANSMISSIONS PAGE (with scroll)
        <>
          <AmbientSound />

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
              className="title-container"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: 'easeOut' }}
            >
              <WencorpLogo />

              <h1 className="main-title">
                <span className="glitch-text-sub">CLASSIFIED TRANSMISSIONS</span>
              </h1>
              <motion.div
                className="subtitle"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                WENCORP ARCHIVES
              </motion.div>
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
