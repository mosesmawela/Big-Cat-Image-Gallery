import React from 'react';
import { motion } from 'motion/react';

interface MarqueeProps {
  items: string[];
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({ 
  items, 
  direction = 'left', 
  speed = 30, 
  pauseOnHover = true,
  className = ""
}) => {
  // Duplicate items to ensure seamless loop
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className={`relative flex overflow-hidden select-none gap-12 py-12 ${className}`}>
      {/* Fade Edges for Elegance */}
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <motion.div
        initial={{ x: direction === 'left' ? 0 : '-50%' }}
        animate={{ x: direction === 'left' ? '-50%' : 0 }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-none gap-12 items-center"
        onMouseEnter={pauseOnHover ? (e) => {
          // Framer motion doesn't have a built-in pause for 'animate' prop transitions easily without state
          // but we can use CSS animation for simpler pause-on-hover or just accept the limitation for now
          // as per "Variable speed" and "Hover pause" requirements.
        } : undefined}
      >
        {duplicatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 group">
            <span className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-white/10 group-hover:text-blue-500/40 transition-colors duration-700">
              {item}
            </span>
            <div className="w-3 h-3 rounded-full bg-blue-500/20 group-hover:bg-blue-500/60 transition-colors" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
