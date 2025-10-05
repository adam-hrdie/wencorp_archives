import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DustProps {
  count?: number;
}

export default function Dust({ count = 1000 }: DustProps) {
  const points = useRef<THREE.Points>(null);

  const { positions, speeds, scales } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const scl = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // distribute in a shallow room
      pos[i * 3 + 0] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 2.8 + 0.1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      spd[i] = 0.05 + Math.random() * 0.15;
      scl[i] = 0.5 + Math.random() * 1.5;
    }
    return { positions: pos, speeds: spd, scales: scl };
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    const arr = points.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] += speeds[i] * delta; // slow drift forward
      if (arr[i * 3 + 2] > 5) arr[i * 3 + 2] = -5; // wrap
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  const mat = useMemo(() => new THREE.PointsMaterial({
    size: 0.03,
    color: new THREE.Color("#ffcf70"),
    transparent: true,
    opacity: 0.25,
    depthWrite: false
  }), []);

  return (
    <points ref={points} material={mat}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
    </points>
  );
}
