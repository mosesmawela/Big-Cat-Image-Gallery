import React, { useRef, useState, memo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Wallpaper } from '../types';
import { Download, Monitor, X, Lock, Heart, Camera, Info, History, Share2, Globe, Shield } from 'lucide-react';
import { downloadImage } from '../lib/utils';
import { toast } from 'sonner';
import { useAuthContext } from '../providers/AuthProvider';
import { toggleFavorite, recordDownload } from '../lib/firebase';
import { GridSkeleton } from './shared/Skeletons';

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  loading?: boolean;
  isProUser?: boolean;
  showExplicit?: boolean;
  onUpgrade?: () => void;
  customization?: { blur: number; gradient: number; layout: string };
  onDownload?: (wp: Wallpaper, resolution: string) => void;
}

const WallpaperItem = memo(({ wp, onExpand, isProUser, showExplicit, onDownload }: { wp: Wallpaper; onExpand: (wp: Wallpaper) => void; isProUser: boolean; showExplicit: boolean; onDownload?: (wp: Wallpaper, resolution: string) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isLocked = wp.isPro && !isProUser;
  const isExplicit = wp.tags?.includes('explicit');
  const shouldBlurExplicit = isExplicit && !showExplicit;
  
  const { user } = useAuthContext();
  const isFavorite = user?.favorites?.includes(wp.id) || false;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  React.useEffect(() => {
    if (wp.isLive && videoRef.current) {
      if (isHovered && !isLocked && !shouldBlurExplicit) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, wp.isLive, isLocked, shouldBlurExplicit]);

  return (
    <motion.div
      ref={ref}
      style={{ 
        opacity, 
        scale,
        willChange: "transform, opacity", 
      }}
      onClick={() => onExpand(wp)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      className="wallpaper-item-hover group relative overflow-hidden aspect-[16/9] bg-zinc-900 cursor-pointer border border-white/5 rounded-2xl shadow-2xl transition-all duration-700 hover:shadow-blue-500/10 hover:border-white/20"
    >
      <AnimatePresence>
        {!isLoaded && !wp.isLive && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/5 z-10 overflow-hidden"
          >
            {/* 1px Gallery Scan Beam */}
            <motion.div 
              animate={{ 
                top: ['-10%', '110%'],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layoutId={`container-${wp.id}`}
        animate={{ 
          scale: isHovered ? 1.05 : 1,
          x: isHovered ? mousePos.x * 20 : 0,
          y: isHovered ? mousePos.y * 20 : 0
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full h-full"
      >
        {wp.isLive ? (
          <video
            ref={videoRef}
            src={wp.url}
            onLoadedData={() => setIsLoaded(true)}
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 ${!isLoaded ? 'blur-2xl' : ''} ${isLocked || shouldBlurExplicit ? 'blur-2xl opacity-50' : ''}`}
          />
        ) : (
          <motion.img
            layoutId={`img-${wp.id}`}
            src={wp.url}
            alt={wp.title}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 ${!isLoaded ? 'blur-2xl scale-110' : 'scale-100'} ${isLocked || shouldBlurExplicit ? 'blur-2xl opacity-50' : ''}`}
            referrerPolicy="no-referrer"
          />
        )}
      </motion.div>

      <AnimatePresence>
        {isFavorite && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-6 right-6 z-30"
          >
            <Heart size={16} fill="#fbbf24" className="text-amber-400" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ 
          opacity: isHovered ? 0.3 : 0,
          background: `radial-gradient(circle at ${50 + mousePos.x * 100}% ${50 + mousePos.y * 100}%, white, transparent)`
        }}
        className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay transition-opacity"
      />
      
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6 border border-white/20">
            <Lock className="text-white" size={32} />
          </div>
          <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-white mb-2">Pro Wallpaper</p>
          <div className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest italic">Upgrade to Unlock</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-12">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <p className="text-[10px] tracking-[0.5em] uppercase text-white/50 font-light">Wallpaper</p>
              {wp.resolution && (
                <span className="px-2 py-1 rounded-md bg-white/10 text-[8px] tracking-widest uppercase font-bold text-white/80 border border-white/10">
                  {wp.resolution}
                </span>
              )}
            </div>
            <h4 className="text-4xl md:text-8xl font-black tracking-tighter text-white italic leading-none">{wp.title}</h4>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({ wallpapers, loading = false, isProUser = false, showExplicit = false, onUpgrade, customization, onDownload }) => {
  const [expandedWp, setExpandedWp] = useState<Wallpaper | null>(null);
  const { user, login } = useAuthContext();

  const handleExpand = (wp: Wallpaper) => {
    if (wp.isPro && !isProUser) {
      onUpgrade?.();
      return;
    }
    setExpandedWp(wp);
  };

  const isExplicitHidden = (wp: Wallpaper) => wp.tags?.includes('explicit') && !showExplicit;

  const handleToggleFav = async (wp: Wallpaper) => {
    if (!user) {
      login();
      return;
    }
    const isFav = user.favorites?.includes(wp.id);
    try {
      await toggleFavorite(user.uid, wp.id, isFav);
      toast.success(isFav ? 'Removed from Favorites' : 'Added to Favorites', {
        description: `${wp.title} has been ${isFav ? 'removed from' : 'saved to'} your profile.`
      });
    } catch (e) {
      toast.error('Sync Failed', { description: 'Could not connect to profile.' });
    }
  };

  const handleShare = async (wp: Wallpaper) => {
    const shareData = {
      title: `Big Cat Gallery: ${wp.title}`,
      text: `Check out this incredible wallpaper: ${wp.title}`,
      url: window.location.origin + `/category/${wp.category.toLowerCase()}?q=${encodeURIComponent(wp.title)}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link Copied', { description: 'Share URL copied to clipboard.' });
      }
    } catch (e) {
      // User cancelled or share failed
    }
  };

  const handleDownload = async (wp: Wallpaper, resolution: string) => {
    if (isExplicitHidden(wp)) return;
    if ((resolution !== '1080p' && !isProUser) || (wp.isPro && !isProUser)) {
      onUpgrade?.();
      return;
    }

    try {
      const url = wp.downloadUrls?.[resolution as keyof typeof wp.downloadUrls] || wp.url;
      await downloadImage(url, `${wp.title.replace(/\s+/g, '_')}_${resolution}.jpg`);
      
      toast.success(`Download Started`, { description: `${resolution} session initialized.` });
      
      if (user) {
        await recordDownload(user.uid, wp, resolution);
      }
      onDownload?.(wp, resolution);
    } catch (e) {
      toast.error('Connection Failed', { description: 'Could not resolve data stream.' });
    }
  };

  if (loading && wallpapers.length === 0) {
    return <GridSkeleton layout={customization?.layout} />;
  }

  const gridClass = customization?.layout === 'columns' 
    ? 'grid grid-cols-1 md:grid-cols-2 gap-12' 
    : customization?.layout === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-3 gap-8' 
    : 'flex flex-col gap-24';

  return (
    <>
      <div className={`p-12 max-w-full mx-auto ${gridClass}`}>
        {wallpapers.map((wp) => (
          <WallpaperItem key={wp.id} wp={wp} onExpand={handleExpand} isProUser={isProUser} showExplicit={showExplicit} onDownload={onDownload} />
        ))}
      </div>

      <AnimatePresence>
        {expandedWp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-[100px] flex items-center justify-center p-4 md:p-12 overflow-y-auto overflow-x-hidden"
          >
            {/* Cinematic Background Blur Effect */}
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="absolute inset-0 z-0"
            >
              <img src={expandedWp.url} className="w-full h-full object-cover blur-3xl saturate-[2] scale-110" alt="background" />
              <div className="absolute inset-0 bg-black/60" />
            </motion.div>

            <motion.button 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onClick={() => setExpandedWp(null)}
              className="fixed top-12 right-12 flex items-center gap-4 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all group z-[220]"
            >
              <span className="text-xs tracking-[0.4em] uppercase font-bold">Close Gallery</span>
              <X size={20} className="group-hover:rotate-90 transition-transform" />
            </motion.button>

            <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 items-start mt-20 lg:mt-0 pb-20 lg:pb-0">
              {/* Visual Presentation */}
              <div className="space-y-12">
                <motion.div 
                  layoutId={`container-${expandedWp.id}`}
                  className="relative aspect-video w-full rounded-[40px] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] group"
                >
                  {expandedWp.isLive ? (
                    <video
                      src={expandedWp.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <motion.img
                      layoutId={`img-${expandedWp.id}`}
                      src={expandedWp.url}
                      transition={{ type: "spring", damping: 25, stiffness: 120 }}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  
                  {/* Lens Flare Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
                </motion.div>

                {/* The Story Behind the Image */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-8 bg-white/5 border border-white/5 rounded-[40px] p-12 backdrop-blur-3xl"
                >
                  <div className="flex items-center gap-4 opacity-40">
                    <Globe size={16} />
                    <span className="text-[10px] uppercase tracking-[0.5em] font-black italic">The Story</span>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">The Visionary Origin</h3>
                    <p className="text-lg font-light leading-relaxed text-white/70">
                      {expandedWp.story || "This masterpiece was captured in the heart of the digital landscape, where light and shadow dance in perpetual motion. Every pixel was calibrated to evoke a sense of infinite exploration and visual tranquility. It represents the pinnacle of modern digital craftsmanship."}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Technical Details & Controls */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                {/* Identity Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest border border-blue-500/20">
                      {expandedWp.category}
                    </span>
                    <span className="px-4 py-1.5 rounded-full bg-white/5 text-white/40 text-[8px] font-black uppercase tracking-widest border border-white/5">
                      {expandedWp.isPro ? 'Pro Member' : 'Public Domain'}
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">{expandedWp.title}</h2>
                </div>

                {/* Performance Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleToggleFav(expandedWp)}
                    className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
                  >
                    <Heart 
                      size={20} 
                      fill={user?.favorites?.includes(expandedWp.id) ? '#f43f5e' : 'none'} 
                      className={`transition-all mb-3 ${user?.favorites?.includes(expandedWp.id) ? 'text-rose-500 scale-110' : 'opacity-40 group-hover:text-rose-500 group-hover:scale-110'}`} 
                    />
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">
                      {user?.favorites?.includes(expandedWp.id) ? 'Saved' : 'Add to Favorites'}
                    </span>
                  </button>
                  <button 
                    onClick={() => handleShare(expandedWp)}
                    className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
                  >
                    <Share2 size={20} className="opacity-40 group-hover:text-blue-400 group-hover:scale-110 transition-all mb-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Share Gallery</span>
                  </button>
                </div>

                {/* Technical Specification Grid */}
                <div className="bg-black/40 border border-white/5 rounded-[40px] p-8 space-y-8 backdrop-blur-2xl">
                  <div className="flex items-center gap-4 opacity-40">
                    <Camera size={16} />
                    <span className="text-[10px] uppercase tracking-[0.5em] font-black italic">Technical Metadata</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                    {[
                      { label: 'Camera Model', val: expandedWp.specs?.camera || 'Hasselblad H6D' },
                      { label: 'Optical Lens', val: expandedWp.specs?.lens || '100mm f/2.2' },
                      { label: 'Aperture', val: expandedWp.specs?.aperture || 'f/8.0' },
                      { label: 'ISO Sensitivity', val: expandedWp.specs?.iso || '100' },
                      { label: 'Color Space', val: expandedWp.specs?.colorSpace || 'Display P3' },
                      { label: 'Dynamic Range', val: '14.2 Stops' }
                    ].map((spec, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-[8px] uppercase tracking-[0.2em] font-black opacity-30">{spec.label}</p>
                        <p className="text-xs font-bold tracking-widest italic">{spec.val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download Matrix */}
                <div className="space-y-6">
                  <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-black italic ml-4">Download Options</p>
                  <div className="grid gap-3">
                    {[
                      { label: '1080p High Definition', res: '1080p', pro: false },
                      { label: '4K Ultra High Fidelity', res: '4K', pro: true },
                      { label: 'Ultrawide Gallery Files', res: 'Ultrawide', pro: true },
                    ].map((opt) => {
                      const isOptLocked = (opt.pro && !isProUser) || isExplicitHidden(expandedWp);
                      return (
                        <button
                          key={opt.res}
                          onClick={() => handleDownload(expandedWp, opt.res)}
                          className={`group flex items-center justify-between px-8 py-6 rounded-[32px] border transition-all ${isOptLocked ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed' : 'border-white/10 hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                            <span className="text-[8px] opacity-40 uppercase tracking-widest">{opt.res} Deployment</span>
                          </div>
                          {isOptLocked ? <Lock size={14} className="opacity-40" /> : <Download size={18} className="group-hover:translate-y-1 transition-transform" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Trust/Legal */}
                <div className="flex items-center gap-4 px-8 py-4 bg-white/5 rounded-full border border-white/5 opacity-40">
                  <Shield size={14} />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] italic">Human-Made Verified Digital Art</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

