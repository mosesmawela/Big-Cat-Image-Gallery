import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const CustomCursor: React.FC<{ isOutline?: boolean }> = ({ isOutline }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringWallpaper, setIsHoveringWallpaper] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over a wallpaper item
      const target = e.target as HTMLElement;
      const isWallpaper = target.closest('.wallpaper-item-hover');
      setIsHoveringWallpaper(!!isWallpaper);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 border border-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      animate={{ 
        x: mousePos.x - 12, 
        y: mousePos.y - 12,
        scale: isOutline || isHoveringWallpaper ? 1.5 : 1
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.5 }}
    />
  );
};
