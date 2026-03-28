import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const WaterMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uMouse.value.lerp(new THREE.Vector2(mouse.x, mouse.y), 0.1);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[10, 10, 128, 128]} />
      <shaderMaterial
        transparent
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2 uMouse;
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Container wave effect - horizontal movement
            float wave = sin(pos.x * 1.5 + uTime * 0.8) * 0.08;
            wave += sin(pos.x * 3.0 - uTime * 1.2) * 0.03;
            
            // Mouse interaction ripples
            float dist = distance(uv, uMouse * 0.5 + 0.5);
            float ripple = sin(dist * 15.0 - uTime * 4.0) * 0.06 * exp(-dist * 4.0);
            
            // Only apply wave to the "surface" area
            if (vUv.y > 0.45 && vUv.y < 0.65) {
              pos.y += wave + ripple;
            }
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          void main() {
            // Water line threshold
            float waterLine = 0.55 + sin(vUv.x * 10.0 + uTime) * 0.01;
            if (vUv.y > waterLine) discard;
            
            vec2 grid = fract(vUv * 60.0);
            float dot = 1.0 - smoothstep(0.1, 0.15, length(grid - 0.5));
            
            // Deep water to surface gradient
            vec3 deepColor = vec3(0.02, 0.08, 0.15);
            vec3 surfaceColor = vec3(0.1, 0.4, 0.7);
            vec3 color = mix(deepColor, surfaceColor, vUv.y * 1.8);
            
            // Surface highlight
            float highlight = smoothstep(waterLine - 0.02, waterLine, vUv.y);
            color += highlight * 0.2;
            
            float alpha = 0.8 * (1.0 - vUv.y * 0.5);
            
            gl_FragColor = vec4(color + dot * 0.05, alpha);
          }
        `}
      />
    </mesh>
  );
};

export const WaterSimulation: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 2] }}>
        <WaterMesh />
      </Canvas>
    </div>
  );
};
