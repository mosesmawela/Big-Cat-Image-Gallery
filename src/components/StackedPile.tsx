import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Wallpaper } from '../types';

interface StackedPileProps {
  wallpapers: Wallpaper[];
  onViewAll: () => void;
}

const Card = ({ wp, idx, total }: { wp: Wallpaper; idx: number; total: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const springConfig = { damping: 20, stiffness: 300 };
  const animatedRotateX = useSpring(rotateX, springConfig);
  const animatedRotateY = useSpring(rotateY, springConfig);

  // Dynamic initial position
  const initialRotate = (idx - total / 2) * 8 + (Math.random() - 0.5) * 10;
  const initialX = (idx - total / 2) * 35;
  const initialY = (idx - total / 2) * 5;

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.15}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        x.set(mouseX);
        y.set(mouseY);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: 0, x: 0, y: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotate: initialRotate, 
        x: initialX, 
        y: initialY,
        zIndex: 10 + idx 
      }}
      whileHover={{ 
        scale: 1.1, 
        zIndex: 100,
        rotate: 0,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.95, cursor: 'grabbing' }}
      style={{ rotateX: animatedRotateX, rotateY: animatedRotateY, transformStyle: "preserve-3d" }}
      className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 bg-zinc-900 group cursor-grab active:cursor-grabbing"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
      <img 
        src={wp.url} 
        alt={wp.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute bottom-6 left-6 right-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <p className="text-[8px] tracking-[0.4em] uppercase font-black text-amber-500 mb-1">BigCat Exclusive</p>
        <h3 className="text-lg font-black italic uppercase tracking-tighter leading-none">{wp.title}</h3>
      </div>
    </motion.div>
  );
};

export const StackedPile: React.FC<StackedPileProps> = ({ wallpapers, onViewAll }) => {
  const pileWallpapers = wallpapers.slice(0, 8);

  return (
    <div className="relative w-full h-[700px] flex items-center justify-center perspective-[2500px] overflow-visible">
      <div className="relative w-[340px] h-[480px]">
        {pileWallpapers.map((wp, idx) => (
          <Card key={wp.id} wp={wp} idx={idx} total={pileWallpapers.length} />
        ))}
      </div>
    </div>
  );
};
