import React from 'react';
import { motion } from 'motion/react';

export const WaterRipple: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 20, opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        onAnimationComplete={onComplete}
        className="w-20 h-20 border-4 border-white/50 rounded-full"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 15, opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
        className="absolute w-20 h-20 border-2 border-white/30 rounded-full"
      />
    </div>
  );
};
