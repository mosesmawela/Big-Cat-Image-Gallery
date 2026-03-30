import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, ScrollControls, Scroll, useScroll, Float, Text, Html, Environment, Center, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Wallpaper } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Info, X, Mouse } from 'lucide-react';

interface ThreeDGalleryProps {
  wallpapers: Wallpaper[];
  isProUser?: boolean;
}

function WallpaperItem({ 
  wp, 
  index, 
  total, 
  onSelect 
}: { 
  wp: Wallpaper; 
  index: number; 
  total: number;
  onSelect: (wp: Wallpaper) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Distribute in 3D space
  const x = (index - total / 2) * 4;
  const z = Math.sin(index * 0.5) * 2;
  const y = Math.cos(index * 0.5) * 1;

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    ref.current.position.y = y + Math.sin(time + index) * 0.2;
    ref.current.rotation.y = Math.sin(time * 0.5 + index) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group 
        ref={ref} 
        position={[x, y, z]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(wp)}
      >
         <Image 
           url={wp.url} 
           scale={3}
           toneMapped={false} 
           transparent 
           opacity={hovered ? 1 : 0.8}
         />
        {hovered && (
          <Html position={[0, -2.2, 0]} center>
            <div className="bg-black/90 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full whitespace-nowrap pointer-events-none">
              <p className="text-[10px] font-black italic uppercase tracking-tighter text-brand-peach">
                {wp.title}
              </p>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

const DetailOverlay = ({ wp, onClose }: { wp: Wallpaper; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-black/80 backdrop-blur-3xl border-l border-white/10 z-[1000] p-12 flex flex-col justify-between"
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition-colors"
        title="Close details"
      >
        <X size={24} className="opacity-40" />
      </button>

      <div className="space-y-12 pt-12">
        <div className="space-y-4">
          <p className="text-[10px] tracking-[1em] uppercase opacity-40 font-black italic">Asset Detail</p>
          <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none break-words">
            {wp.title}
          </h2>
        </div>

        <div className="aspect-[3/4] rounded-lg overflow-hidden border border-white/5 shadow-2xl">
          <img src={wp.url} alt={wp.title} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase opacity-60 font-medium">
            <span className="bg-white/5 px-3 py-1 rounded">4K Resolution</span>
            <span className="bg-white/5 px-3 py-1 rounded">PRO Asset</span>
          </div>
          <p className="text-sm font-medium leading-relaxed opacity-40 italic uppercase tracking-tight">
            Exclusive high-fidelity digital art from the BigCat Studios collection. Optimized for ultra-wide and mobile setups.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-12 border-t border-white/5">
        <button 
          className="flex-1 bg-white text-black py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] italic hover:scale-105 transition-transform flex items-center justify-center gap-3"
          title="Download high-resolution image"
        >
          <Download size={16} />
          Direct Download
        </button>
        <button 
          className="p-5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
          title="View more information"
        >
          <Info size={16} className="opacity-40" />
        </button>
      </div>
    </motion.div>
  );
};

export const ThreeDGallery: React.FC<ThreeDGalleryProps> = ({ wallpapers, isProUser }) => {
  const [selectedWp, setSelectedWp] = useState<Wallpaper | null>(null);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden">
      <div className="absolute top-24 left-12 z-10 space-y-2 pointer-events-none">
        <p className="text-[10px] tracking-[1em] uppercase opacity-20 font-black italic">Visual Database</p>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mix-blend-difference">
          Immersive <span className="text-brand-peach">Selector</span>
        </h2>
      </div>

      <Canvas camera={{ position: [0, 0, 15], fov: 35 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Suspense fallback={null}>
          <ScrollControls horizontal pages={3} damping={0.2}>
            <Scroll>
              {wallpapers.map((wp, idx) => (
                <WallpaperItem 
                  key={wp.id} 
                  wp={wp} 
                  index={idx} 
                  total={wallpapers.length} 
                  onSelect={setSelectedWp}
                />
              ))}
            </Scroll>
            
            {/* Background Atmosphere */}
            <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
            <Environment preset="city" />
          </ScrollControls>
        </Suspense>
      </Canvas>

      <AnimatePresence>
        {selectedWp && <DetailOverlay wp={selectedWp} onClose={() => setSelectedWp(null)} />}
      </AnimatePresence>

      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end pointer-events-none">
        <div className="space-y-4">
          <div className="flex items-center gap-4 opacity-40">
            <Mouse size={12} fill="currentColor" />
            <span className="text-[8px] uppercase tracking-[0.6em] font-black">Scroll to navigate the rift</span>
          </div>
          <div className="w-48 h-px bg-white/10 animate-[grow_2s_ease-in-out_infinite]" />
        </div>
        
        <p className="text-[8px] tracking-[0.5em] uppercase opacity-20 font-black text-right max-w-xs leading-loose">
          BigCat Studios © 2026 <br /> Experimental 3D Interface Prototype
        </p>
      </div>

      <style>{`
        @keyframes grow {
          0%, 100% { width: 48px; opacity: 0.1; }
          50% { width: 144px; opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
