import { useState, useEffect } from 'react';

/**
 * usePerformanceGuard
 * Monitors the frame rate and returns a 'quality' tier.
 * Used to disable heavy effects (grain, complex blur) on low-end devices.
 */
export const usePerformanceGuard = () => {
  const [quality, setQuality] = useState<'low' | 'high'>('high');

  useEffect(() => {
    let frameCount = 0;
    let startTime = performance.now();
    let rafId: number;

    const checkFrameRate = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - startTime >= 1000) {
        const fps = frameCount;
        if (fps < 45) {
          setQuality('low');
        } else {
          setQuality('high');
        }
        frameCount = 0;
        startTime = currentTime;
      }
      
      rafId = requestAnimationFrame(checkFrameRate);
    };

    rafId = requestAnimationFrame(checkFrameRate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return quality;
};
