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

  const ambientColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#d4a574', '#e8b86d', '#cc7722']
  );

  return (
    <div className="app-container" ref={containerRef}>
      <AmbientSound />

      {/* Animated background gradients */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#2a1e00] via-black to-black" />

      {/* Caustic overlay */}
      <div className="caustic-overlay" />

      {/* Volumetric light beams */}
      <motion.div
        className="light-beam beam-1"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.3], [0.15, 0.05])
        }}
      />
      <motion.div
        className="light-beam beam-2"
        style={{
          opacity: useTransform(scrollYProgress, [0.3, 0.7], [0.05, 0.15])
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
            <span className="glitch-text-sub">ARCHIVES</span>
          </h1>
          <motion.div
            className="subtitle"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            CLASSIFIED TRANSMISSIONS
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
              scaleX: useTransform(scrollYProgress, [0, 0.2], [0, 1])
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
            opacity: useTransform(scrollYProgress, [0.8, 1], [0, 1])
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
    </div>
  );
}

export default App;
