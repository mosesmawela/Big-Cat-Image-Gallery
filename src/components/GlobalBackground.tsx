import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function DustParticles() {
  const ref = useRef<THREE.Points>(null);
  
  const [positions] = useMemo(() => {
    const pos = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

export const GlobalBackground: React.FC<{ theme?: 'light' | 'dark' }> = ({ theme = 'dark' }) => {
  return (
    <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none">
      {/* Animated Gradient */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${theme === 'light' ? 'bg-gradient-to-br from-zinc-100 via-white to-zinc-200' : 'bg-gradient-to-br from-black via-blue-900 to-black'} animate-gradient-slow bg-[length:400%_400%]`} />
      
      {/* Film Grain Overlay */}
      <div className={`absolute inset-0 ${theme === 'light' ? 'opacity-[0.05]' : 'opacity-[0.03]'} pointer-events-none mix-blend-overlay`}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Dust Particles */}
      <div className={`absolute inset-0 ${theme === 'light' ? 'opacity-10' : 'opacity-30'}`}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <DustParticles />
        </Canvas>
      </div>
    </div>
  );
};
