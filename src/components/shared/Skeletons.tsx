import React from 'react';
import { motion } from 'motion/react';

export const WallpaperSkeleton = () => {
  return (
    <div className="aspect-[16/9] bg-white/5 rounded-2xl overflow-hidden relative border border-white/5">
      <motion.div 
        animate={{ 
          x: ['-100%', '100%'],
          opacity: [0, 0.5, 0]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <div className="absolute bottom-6 left-6 space-y-2 w-2/3">
        <div className="h-2 w-1/4 bg-white/10 rounded-full" />
        <div className="h-6 w-full bg-white/10 rounded-full" />
      </div>
    </div>
  );
};

export const GridSkeleton = ({ count = 6, layout = 'grid' }: { count?: number, layout?: string }) => {
  const gridClass = layout === 'columns' 
    ? 'grid grid-cols-1 md:grid-cols-2 gap-12' 
    : layout === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-3 gap-8' 
    : 'flex flex-col gap-24';

  return (
    <div className={`p-12 max-w-full mx-auto ${gridClass}`}>
      {Array.from({ length: count }).map((_, i) => (
        <WallpaperSkeleton key={i} />
      ))}
    </div>
  );
};
