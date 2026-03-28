import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const AbstractPlatform = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1.2, 0.2, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Abstract Shape */}
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={meshRef} position={[0, 0.8, 0]}>
          <Sphere args={[0.6, 64, 64]}>
            <MeshDistortMaterial color="#111" speed={3} distort={0.4} radius={1} />
          </Sphere>
        </mesh>
      </Float>
    </group>
  );
};

export const SingleAbstract: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        <AbstractPlatform position={[0, -1, 0]} />
      </Canvas>
    </div>
  );
};

export const ThreeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] opacity-40">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <AbstractPlatform position={[-4, 2, 0]} />
        <AbstractPlatform position={[4, -2, -2]} />
        <AbstractPlatform position={[-3, -5, -4]} />
        <AbstractPlatform position={[5, 4, -3]} />
      </Canvas>
    </div>
  );
};
