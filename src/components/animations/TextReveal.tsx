import React from 'react';
import { motion } from 'motion/react';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({ 
  text, 
  className = "", 
  delay = 0,
  once = true 
}) => {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i + delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 45,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: "0.25em" }}
          key={index}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};
