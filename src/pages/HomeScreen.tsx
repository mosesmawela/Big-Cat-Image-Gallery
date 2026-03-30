import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useWallpapers } from '../hooks/useWallpapers';
import { useAuthContext } from '../providers/AuthProvider';
import { WallpaperGrid } from '../components/WallpaperGrid';
import { CATEGORIES, LATEST_WALLPAPER } from '../constants';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, Sparkles, Monitor, Camera, Image, Layers, Code, Cpu } from 'lucide-react';
import { StackedPile } from '../components/StackedPile';
import { ReleaseCarousel } from '../components/ReleaseCarousel';
import { ThreeDGallery } from '../components/ThreeDGallery';
import { Marquee } from '../components/animations/Marquee';
import { NoodleConnection, FloatingCircle } from '../components/animations/VisualEffects';

const SectionReveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 100, filter: "blur(20px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

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
      <span className="text-4xl font-black tracking-tighter italic uppercase underline decoration-[var(--color-brand-peach)]/50 underline-offset-8">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </span>
    </div>
  );
};

const HeroSection = ({ wallpapers }: { wallpapers: any[] }) => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen w-full overflow-visible flex flex-col items-center justify-center pt-24 pb-24">
      <div className="absolute top-32 right-12 md:right-24 z-20">
        <ClockWidget />
      </div>

      <StackedPile 
        wallpapers={wallpapers} 
        onViewAll={() => navigate('/search')} 
      />

      <div className="max-w-4xl text-center space-y-16 mt-0 px-12 relative z-[200]">
        <motion.div 
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <p className="text-[10px] tracking-[1.2em] uppercase opacity-40 font-black italic">The Nexus of Color</p>
          <h1 className="text-7xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.8] mb-8">
            Digital <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-800">Evolution</span>
          </h1>
          <p className="text-sm font-bold tracking-widest opacity-40 leading-relaxed max-w-md mx-auto italic uppercase">
            Curated visual excellence for the elite setup. High-fidelity art in the rift.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8"
        >
          <button 
            onClick={() => navigate('/pro')}
            className="group relative px-16 py-6 bg-white text-black rounded-full overflow-hidden hover:scale-105 transition-all duration-500 shadow-[0_20px_60px_rgba(255,255,255,0.2)]"
          >
            <div className="absolute inset-0 border border-white/20 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.div 
                animate={{ left: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 w-40 h-full bg-brand-peach/20 skew-x-12"
              />
            </div>
            <div className="relative flex items-center gap-3">
              <Monitor size={16} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Open Studio</span>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/search')}
            className="flex items-center gap-4 px-16 py-6 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-[0.3em] italic"
          >
            Explore Archive
            <ArrowRight size={16} className="opacity-40" />
          </button>
        </motion.div>
      </div>

      {/* Floating Circles */}
      <FloatingCircle size={400} color="rgba(255, 209, 185, 0.05)" className="top-1/4 -left-48" />
      <FloatingCircle size={300} color="rgba(45, 11, 11, 0.1)" className="bottom-1/4 -right-32" />
    </section>
  );
};

export const HomeScreen = () => {
  const { user, isPro } = useAuthContext();
  const { wallpapers, loading, hasMore, loadMore } = useWallpapers({ pageSize: 12 });
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >=
        document.documentElement.offsetHeight
      ) {
        if (!loading && hasMore) loadMore();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, loading, hasMore]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-transparent overflow-hidden">
      <div className="relative z-10 space-y-32">
        <HeroSection wallpapers={wallpapers} />

        <SectionReveal>
          <section className="w-full bg-black/40 py-24 border-y border-white/5 overflow-hidden relative">
            <NoodleConnection className="opacity-50" />
            <Marquee 
              items={['4K RESOLUTION', 'LIVE WALLPAPERS', 'ULTRAWIDE', 'PREMIUM ASSETS', 'CYBERPUNK', 'NATURE ARCHIVES']} 
              direction="left"
              speed={40}
            />
            <Marquee 
              items={['ABSTRACT ART', 'FUTURISTIC', 'MINIMALIST', 'VIRTUAL WORLDS', 'DIGITAL RENDER', 'HIGH CONTRAST']} 
              direction="right"
              speed={60}
              className="mt-[-2rem]"
            />
          </section>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <section className="w-full border-y border-white/5 bg-zinc-950/50">
            <ReleaseCarousel 
              title="Neural New Arrivals" 
              wallpapers={wallpapers.slice(0, 10)} 
              onDownload={(wp, res) => console.log('Download', wp.title, res)}
            />
          </section>
        </SectionReveal>

        <SectionReveal>
          <section className="w-full py-32 px-12 overflow-hidden max-w-7xl mx-auto">
             <div className="space-y-12">
                <div className="flex flex-col items-center text-center gap-4 mb-20">
                  <Sparkles className="text-brand-peach" size={32} />
                  <h2 className="text-6xl font-black italic uppercase tracking-tighter">Essential Collections</h2>
                  <p className="text-xs uppercase tracking-[1em] opacity-40">Choose your frequency</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {CATEGORIES.slice(0, 3).map((cat, idx) => (
                   <motion.div 
                      key={idx} 
                      whileHover={{ scale: 1.02, rotateY: 5 }}
                      className="aspect-[4/5] relative rounded-3xl overflow-hidden border border-white/10 group cursor-pointer" 
                      onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
                   >
                      <img src={cat.image} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" alt={cat.name} loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent group-hover:from-brand-burgundy/60 transition-colors" />
                      <div className="absolute bottom-8 left-8">
                        <p className="text-[8px] uppercase tracking-[1em] text-white/40 mb-2 font-black">Archive Module</p>
                        <h3 className="text-3xl font-black italic uppercase text-white group-hover:text-brand-peach transition-colors">{cat.name}</h3>
                      </div>
                   </motion.div>
                 ))}
               </div>
             </div>
          </section>
        </SectionReveal>

        <SectionReveal>
          <section className="h-screen relative bg-black">
            <ThreeDGallery 
              wallpapers={wallpapers} 
              isProUser={isPro}
            />
            <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-transparent to-black pointer-events-none" />
          </section>
        </SectionReveal>
      </div>

      {loading && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/10 border-t-brand-peach rounded-full animate-spin" />
          <p className="text-[8px] uppercase tracking-[1em] opacity-40 font-black italic">Syncing Rift</p>
        </div>
      )}
    </div>
  );
};
