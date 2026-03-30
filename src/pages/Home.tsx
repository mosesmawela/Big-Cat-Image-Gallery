import React from 'react';
import { motion } from 'motion/react';
import { CategoryCard } from '../components/CategoryCard';
import { HorizontalGallery } from '../components/HorizontalGallery';
import { StackedPile } from '../components/StackedPile';
import { ReleaseCarousel } from '../components/ReleaseCarousel';
import { LATEST_WALLPAPER, CATEGORIES } from '../constants';
import { Category, Wallpaper } from '../types';

const LOGO_URL = "https://ik.imagekit.io/BigCat/Logo%20Assets/BCG%20Logo%20Black.svg?updatedAt=1774706599542";

interface HomeProps {
  heroY: any;
  heroOpacity: any;
  isPro: boolean;
  onCategoryClick: (cat: Category) => void;
  onNavigate: (state: any) => void;
  wallpapers: Wallpaper[];
  onDownload: (wp: Wallpaper, resolution: string) => void;
}

const ClockWidget = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-end text-white mix-blend-difference">
      <div className="flex items-center gap-4 opacity-40 mb-2">
        <span className="text-[10px] uppercase tracking-[0.5em] font-light">Local Time</span>
      </div>
      <span className="text-4xl font-black tracking-tighter italic uppercase">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </span>
    </div>
  );
};

export const Home: React.FC<HomeProps> = ({ 
  heroY, 
  heroOpacity, 
  isPro, 
  onCategoryClick, 
  onNavigate,
  wallpapers,
  onDownload
}) => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 bg-[--color-brand-black]"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-32 pb-24">
        <div className="absolute top-32 right-12 md:right-24 z-20">
          <ClockWidget />
        </div>

        <StackedPile 
          wallpapers={wallpapers} 
          onViewAll={() => onNavigate('search')} 
        />

        <div className="max-w-xl text-center space-y-8 mt-12 px-12">
          <p className="text-sm font-bold tracking-widest opacity-60 leading-relaxed">
            The best 4K wallpapers and motion backgrounds, delivered to your screen every week.
          </p>
          <div className="relative max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-8 text-sm focus:outline-none focus:border-white/20 transition-all font-medium"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform">
              →
            </button>
          </div>
        </div>
      </section>

      {/* Release Carousel - mimicking "Pre-Order" section */}
      <section className="border-y border-white/5">
        <ReleaseCarousel 
          title="New Arrivals Before they Drop" 
          wallpapers={wallpapers.slice(0, 10)} 
          onDownload={onDownload}
        />
      </section>

      {/* Essential Collections - mimicking the bottom grid in reference */}
      <section className="py-32 px-12 border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Essential Collections</h2>
            <button className="text-[10px] tracking-[0.3em] uppercase font-bold opacity-40 hover:opacity-100 transition-opacity">
              View All ›
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {CATEGORIES.slice(0, 3).map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="space-y-8 group cursor-pointer"
                onClick={() => onCategoryClick(cat.name)}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-white/5 z-0" />
                  {/* Stacked effect like reference */}
                  <div className="absolute top-4 left-4 w-full h-full bg-white/5 rounded-lg -rotate-2" />
                  <div className="absolute top-2 left-2 w-full h-full bg-white/10 rounded-lg -rotate-1" />
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="absolute inset-0 w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-amber-400">
                    The {cat.name} Edition
                  </h3>
                  <p className="text-sm font-light leading-relaxed opacity-60">
                    Curated selection of {cat.name.toLowerCase()} inspired visuals that push the boundaries of digital art.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center overflow-hidden bg-white text-black">
        <div className="relative z-10 max-w-7xl px-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <p className="text-[10px] tracking-[1em] uppercase opacity-40 font-light">Vision</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter italic uppercase">
              "Passion turns ideas into reality <br className="hidden md:block" /> and imagination into form."
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Branded Footer */}
      <footer className="py-24 px-12 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-24">
          <div className="space-y-12">
            <img 
              src={LOGO_URL} 
              className="h-20 mx-auto invert brightness-0 filter opacity-40 hover:opacity-100 transition-opacity" 
              style={{ filter: 'invert(1) brightness(1.2)' }}
              alt="BCG Logo"
            />
            <div className="flex gap-12 text-[10px] tracking-[0.5em] uppercase font-bold opacity-30">
              <a className="hover:opacity-100 transition-opacity cursor-pointer">Twitter</a>
              <a className="hover:opacity-100 transition-opacity cursor-pointer">Instagram</a>
              <a className="hover:opacity-100 transition-opacity cursor-pointer">Discord</a>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between w-full border-t border-white/5 pt-12 gap-8 text-[8px] uppercase tracking-[0.5em] font-bold opacity-20">
            <p>© 2026 Studio Graphics. All rights reserved.</p>
            <div className="flex gap-12">
              <a>Privacy Policy</a>
              <a>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </motion.main>
  );
};
