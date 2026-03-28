import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';

const PORTRAIT_IMAGES = [
  'https://picsum.photos/seed/p1/600/900',
  'https://picsum.photos/seed/p2/600/900',
  'https://picsum.photos/seed/p3/600/900',
  'https://picsum.photos/seed/p4/600/900',
  'https://picsum.photos/seed/p5/600/900',
  'https://picsum.photos/seed/p6/600/900',
];

const GalleryItem = ({ url, index, x }: { url: string; index: number; x: any }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Calculate relative position based on drag x
  const rotateY = useTransform(x, (val: number) => {
    const offset = val + (index * 350); // 300 width + 50 gap
    return (offset / 500) * -45;
  });
  
  const scale = useTransform(x, (val: number) => {
    const offset = Math.abs(val + (index * 350));
    return Math.max(0.8, 1 - (offset / 2000));
  });

  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={itemRef}
      style={{
        rotateY: springRotateY,
        scale: springScale,
        perspective: 1000
      }}
      className="flex-shrink-0 w-[300px] aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 group relative"
    >
      <img
        src={url}
        alt={`Gallery ${index}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
        <p className="text-[10px] tracking-[0.5em] uppercase font-light">View Details</p>
      </div>
    </motion.div>
  );
};

export const HorizontalGallery: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  return (
    <section className="py-32 overflow-hidden bg-black">
      <div className="px-12 mb-12 flex items-center gap-8">
        <h2 className="text-xs tracking-[1em] uppercase opacity-30">3D Gallery</h2>
        <div className="h-[1px] flex-1 bg-white/10" />
      </div>
      
      <motion.div 
        ref={targetRef}
        drag="x"
        style={{ x, perspective: '1000px' }}
        dragConstraints={{ left: -2000, right: 0 }}
        className="flex gap-12 px-[20vw] pb-24 cursor-grab active:cursor-grabbing w-max"
      >
        {PORTRAIT_IMAGES.map((url, idx) => (
          <GalleryItem key={idx} url={url} index={idx} x={x} />
        ))}
      </motion.div>
    </section>
  );
};
