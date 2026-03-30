import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Wallpaper } from '../types';
import { toast } from 'sonner';

interface ReleaseCarouselProps {
  title: string;
  wallpapers: Wallpaper[];
  onDownload: (wp: Wallpaper, resolution: string) => void;
}

export const ReleaseCarousel: React.FC<ReleaseCarouselProps> = ({ title, wallpapers, onDownload }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 py-24">
      <div className="flex items-center justify-between px-12">
        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">{title}</h2>
        <div className="flex items-center gap-8">
           <button 
             className="text-[10px] tracking-[0.3em] uppercase font-bold opacity-40 hover:opacity-100 transition-opacity"
             onClick={() => {
               // Navigate to new releases or search page to see all wallpapers
               // For now, we'll just show a toast indicating this would navigate
               toast.info('Showing all wallpapers', { description: 'Navigate to all wallpapers page' });
             }}
           >
             View All ›
           </button>
          <div className="flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="p-3 border border-white/10 rounded-full hover:bg-white/5 transition-colors"
              title="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 border border-white/10 rounded-full hover:bg-white/5 transition-colors"
              title="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto px-12 no-scrollbar snap-x snap-mandatory"
      >
        {wallpapers.map((wp) => (
          <motion.div
            key={wp.id}
            whileHover={{ y: -10 }}
            className="flex-none w-[280px] md:w-[350px] snap-start space-y-6 group cursor-pointer"
          >
            <div className="aspect-square bg-zinc-900 overflow-hidden rounded-lg relative">
              <img 
                src={wp.url} 
                alt={wp.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => onDownload(wp, '4K')}
                  className="px-6 py-2 bg-white text-black text-[10px] uppercase tracking-widest font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  title={`Download ${wp.title} in 4K`}
                >
                  Download 4K
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black tracking-tighter italic uppercase truncate">{wp.title}</h3>
              <p className="text-[10px] tracking-widest opacity-40 uppercase font-bold">Studio Graphics Original</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
