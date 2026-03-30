import React from 'react';

export const GlobalBackground: React.FC = () => {
    return (
      <div className="fixed inset-0 z-[-1] bg-[#020202] overflow-hidden pointer-events-none">
        {/* Cinematic Aura */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,25,1)_0%,rgba(0,0,0,1)_100%)] animate-pulse-slow" />
        
        {/* Neural Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.25] mix-blend-overlay scale-150">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <filter id="cinematicNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#cinematicNoise)" />
          </svg>
        </div>

        {/* Dynamic Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>
    );
};
