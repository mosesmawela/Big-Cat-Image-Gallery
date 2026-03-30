import React from 'react';
import { motion } from 'motion/react';
import { Sliders } from 'lucide-react';
import { WallpaperGrid } from '../components/WallpaperGrid';
import { Wallpaper, Category as CategoryType } from '../types';

interface CategoryProps {
  selectedCategory: CategoryType | null;
  filteredWallpapers: Wallpaper[];
  isPro: boolean;
  showExplicit: boolean;
  customization: any;
  onUpgrade: () => void;
  onDownload: (wp: Wallpaper, resolution: string) => void;
  setIsToolsOpen: (open: boolean) => void;
  isLightState: boolean;
  currentFont: string;
}

export const Category: React.FC<CategoryProps> = ({
  selectedCategory,
  filteredWallpapers,
  isPro,
  showExplicit,
  customization,
  onUpgrade,
  onDownload,
  setIsToolsOpen,
  isLightState,
  currentFont
}) => {
  return (
    <motion.div
      key="category"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`relative z-10 pt-48 pb-32 bg-white min-h-screen ${currentFont}`}
    >
      <div className="fixed top-0 left-0 w-full h-32 bg-white/80 backdrop-blur-xl border-b border-black/5 flex items-center justify-center px-12 z-50">
        <div className="flex flex-col items-center text-center">
          <p className="text-[10px] tracking-[1em] uppercase opacity-30 mb-2">Collection</p>
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase text-black leading-none">
            {selectedCategory}
          </h2>
        </div>
      </div>

      <button 
        onClick={() => setIsToolsOpen(true)}
        className={`fixed bottom-12 right-12 z-50 flex items-center gap-4 px-8 py-4 rounded-full text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-all shadow-2xl ${isLightState ? 'bg-black text-white' : 'bg-white text-black'}`}
      >
        <Sliders size={16} />
        Customize
      </button>
      
      <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/5 -z-10" />
      
      <div className="text-black">
        {filteredWallpapers.length > 0 ? (
          <WallpaperGrid 
            wallpapers={filteredWallpapers} 
            isProUser={isPro}
            showExplicit={showExplicit}
            onUpgrade={onUpgrade}
            customization={customization}
            onDownload={onDownload}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center px-12">
            <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-bold mb-4">Empty Collection</p>
            <h3 className="text-4xl font-black italic uppercase text-black/20">No Wallpapers Found</h3>
            <p className="text-sm opacity-60 mt-4 max-w-md">We couldn't find any wallpapers matching your current filters in this category.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
