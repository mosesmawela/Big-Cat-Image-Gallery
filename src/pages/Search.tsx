import React from 'react';
import { motion } from 'motion/react';
import { Search as SearchIcon } from 'lucide-react';
import { WallpaperGrid } from '../components/WallpaperGrid';
import { Wallpaper } from '../types';

interface SearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchedWallpapers: Wallpaper[];
  isPro: boolean;
  showExplicit: boolean;
  onUpgrade: () => void;
  onDownload: (wp: Wallpaper, resolution: string) => void;
  customization: any;
}

export const Search: React.FC<SearchProps> = ({
  searchQuery,
  setSearchQuery,
  searchedWallpapers,
  isPro,
  showExplicit,
  onUpgrade,
  onDownload,
  customization
}) => {
  return (
    <motion.div
      key="search"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 pt-48 pb-32 bg-black min-h-screen"
    >
      <div className="fixed top-0 left-0 w-full h-32 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-center px-12 z-50">
        <div className="max-w-xl w-full relative">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            autoFocus
            type="text"
            placeholder="Search wallpapers, styles, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-16 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-bold tracking-widest uppercase italic text-sm"
          />
        </div>
      </div>

      <div className="px-12">
        <div className="flex items-center gap-12 mb-24 max-w-7xl mx-auto">
          <h2 className="text-xs tracking-[1em] uppercase opacity-20 whitespace-nowrap">Results</h2>
          <div className="h-[1px] flex-1 bg-white/10" />
          <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-bold">{searchedWallpapers.length} Found</p>
        </div>

        {searchedWallpapers.length > 0 ? (
          <WallpaperGrid 
            wallpapers={searchedWallpapers} 
            isProUser={isPro}
            showExplicit={showExplicit}
            onUpgrade={onUpgrade}
            customization={customization}
            onDownload={onDownload}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-bold mb-4">No Results</p>
            <h3 className="text-4xl font-black italic uppercase text-white/10">Keep Exploring</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
};
