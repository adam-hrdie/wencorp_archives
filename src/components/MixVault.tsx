import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshTransmissionMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import './MixVault.css';

interface Mix {
  id: number;
  title: string;
  artist: string;
  runtime: string;
  albumArt: string;
  audioUrl: string;
}

interface MixVaultProps {
  mix: Mix;
  index: number;
  onSelect: () => void;
  isActive: boolean;
}

function GlassCube({ albumArt, isHovered }: { albumArt: string; isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture] = useState(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(albumArt);
  });

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += isHovered ? 0.01 : 0.003;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.5}
          chromaticAberration={0.5}
          anisotropy={1}
          distortion={0.3}
          distortionScale={0.2}
          temporalDistortion={0.1}
          color="#d4a574"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Inner cube with album art */}
      <mesh scale={0.9}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          map={texture}
          emissive="#d4a574"
          emissiveIntensity={isHovered ? 0.5 : 0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Edge glow */}
      <mesh scale={1.02}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial
          color="#d4a574"
          transparent
          opacity={isHovered ? 0.3 : 0.1}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function Scene({ albumArt, isHovered }: { albumArt: string; isHovered: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#d4a574" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#e8b86d" />
      <spotLight
        position={[0, 5, 0]}
        angle={0.5}
        penumbra={1}
        intensity={isHovered ? 1.5 : 0.8}
        color="#d4a574"
        castShadow
      />
      <GlassCube albumArt={albumArt} isHovered={isHovered} />
    </>
  );
}

export default function MixVault({ mix, index, onSelect, isActive }: MixVaultProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="mix-vault"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 1, delay: index * 0.2 }}
    >
      <div className="vault-layout">
        {/* 3D Canvas */}
        <motion.div
          className="vault-canvas-container"
          animate={{
            scale: isHovered ? 1.05 : 1,
            rotateY: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ background: 'transparent' }}
          >
            <Scene albumArt={mix.albumArt} isHovered={isHovered} />
          </Canvas>

          {/* Glow effect */}
          <motion.div
            className="vault-glow"
            animate={{
              opacity: isHovered ? 0.6 : 0.3,
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* Metadata Panel */}
        <motion.div
          className="vault-metadata"
          animate={{
            x: isHovered ? 20 : 0,
            opacity: isHovered ? 1 : 0.7,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="metadata-header">
            <span className="metadata-label">ARCHIVE</span>
            <span className="metadata-id">#{String(mix.id).padStart(3, '0')}</span>
          </div>

          <h2 className="mix-title">{mix.title}</h2>
          <p className="mix-artist">{mix.artist}</p>

          <div className="metadata-footer">
            <div className="metadata-item">
              <span className="metadata-label">DURATION</span>
              <span className="metadata-value">{mix.runtime}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">FORMAT</span>
              <span className="metadata-value">WAV 24-BIT</span>
            </div>
          </div>

          {/* Scan lines */}
          <div className="scanlines" />

          {/* Access indicator */}
          <motion.div
            className="access-indicator"
            animate={{
              opacity: isHovered ? [0.5, 1, 0.5] : 0.3,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {isHovered ? '◆ READY TO ACCESS' : '◇ STANDBY'}
          </motion.div>
        </motion.div>
      </div>

      {/* Geometric accent lines */}
      <div className="vault-accents">
        <motion.div
          className="accent-line accent-top"
          animate={{
            scaleX: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="accent-line accent-bottom"
          animate={{
            scaleX: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
      </div>
    </motion.div>
  );
}
