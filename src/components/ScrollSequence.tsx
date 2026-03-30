import React, { useRef, useEffect, useState } from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';

interface ScrollSequenceProps {
  frameCount: number;
  progress: MotionValue<number>;
  className?: string;
}

export const ScrollSequence: React.FC<ScrollSequenceProps> = ({ frameCount, progress, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isPreloading, setIsPreloading] = useState(true);

  // Map progress (0-1) to frame index (1-frameCount)
  const frameIndex = useTransform(progress, [0, 1], [1, frameCount]);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;

      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(4, '0');
        img.src = `/assets/Background Vid${frameNumber}.png`;
        
        img.onload = () => {
          loadedCount++;
          if (loadedCount === frameCount) {
            setIsPreloading(false);
          }
        };
        loadedImages.push(img);
      }
      setImages(loadedImages);
    };

    preloadImages();
  }, [frameCount]);

  // Draw frame on canvas
  useEffect(() => {
    if (images.length === 0 || !canvasRef.current) return;

    const render = (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = images[Math.max(0, Math.min(images.length - 1, Math.round(index) - 1))];
      if (!img) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.width;
      const imgHeight = img.height;
      
      // Calculate cover ratio
      const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const newWidth = imgWidth * ratio;
      const newHeight = imgHeight * ratio;
      const x = (canvasWidth - newWidth) / 2;
      const y = (canvasHeight - newHeight) / 2;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, x, y, newWidth, newHeight);
    };

    const unsubscribe = frameIndex.on("change", (latest) => {
      render(latest);
    });

    render(frameIndex.get());
    return () => unsubscribe();
  }, [images, frameIndex]);

  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
      canvasRef.current.height = window.innerHeight * window.devicePixelRatio;
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`fixed inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef}
        className="w-full h-full scale-[1.05] origin-center"
      />
      
      {isPreloading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black gap-4 pointer-events-auto">
          <div className="w-12 h-1 bg-white/5 relative overflow-hidden">
             <motion.div 
               initial={{ left: "-100%" }}
               animate={{ left: "100%" }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
               className="absolute h-full w-20 bg-brand-peach"
             />
          </div>
          <p className="text-[10px] uppercase tracking-[1em] font-black italic opacity-40">Compiling Rift</p>
        </div>
      )}
    </div>
  );
};
