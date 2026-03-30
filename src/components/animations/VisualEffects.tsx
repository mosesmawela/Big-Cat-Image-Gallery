import React from 'react';
import { motion } from 'motion/react';

export const NoodleConnection = ({ 
  className = "",
  color = "rgba(59, 130, 246, 0.2)"
}) => {
  return (
    <svg 
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 0,50 Q 25,0 50,50 T 100,50"
        fill="transparent"
        stroke={color}
        strokeWidth="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.circle
        r="1"
        fill={color}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ offsetPath: "path('M 0,50 Q 25,0 50,50 T 100,50')" }}
      />
    </svg>
  );
};

export const FloatingCircle = ({ 
  size = 100, 
  color = "rgba(59, 130, 246, 0.1)",
  className = "" 
}) => {
  return (
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.3, 0.1],
        rotate: [0, 360]
      }}
      transition={{ 
        duration: 10, 
        repeat: Infinity, 
        ease: "linear" 
      }}
      className={`absolute rounded-full border border-white/5 ${className}`}
      style={{ 
        width: size, 
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`
      }}
    />
  );
};
