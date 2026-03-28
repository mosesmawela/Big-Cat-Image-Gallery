import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Wallpaper } from '../types';
import { Download, Monitor, X, Lock, Zap, Heart } from 'lucide-react';
import { downloadImage } from '../lib/utils';
import { toast } from 'sonner';

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  isProUser?: boolean;
  showExplicit?: boolean;
  onUpgrade?: () => void;
  customization?: { blur: number; gradient: number; layout: string };
  onDownload?: (wp: Wallpaper, resolution: string) => void;
}

const WallpaperItem = ({ wp, onExpand, isProUser, showExplicit, onDownload }: { wp: Wallpaper; onExpand: (wp: Wallpaper) => void; isProUser: boolean; showExplicit: boolean; onDownload?: (wp: Wallpaper, resolution: string) => void }) => {
  const ref = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isLocked = wp.isPro && !isProUser;
  const isExplicit = wp.tags?.includes('explicit');
  const shouldBlurExplicit = isExplicit && !showExplicit;
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

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
      style={{ opacity, scale }}
      onClick={() => onExpand(wp)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="wallpaper-item-hover group relative overflow-hidden aspect-[16/9] bg-zinc-900 cursor-pointer border-b border-black/5"
    >
      {wp.isLive ? (
        <video
          ref={videoRef}
          src={wp.url}
          loop
          muted
          playsInline
          className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0 ${isLocked || shouldBlurExplicit ? 'blur-2xl opacity-50' : ''}`}
        />
      ) : (
        <img
          src={wp.url}
          alt={wp.title}
          className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0 ${isLocked || shouldBlurExplicit ? 'blur-2xl opacity-50' : ''}`}
          referrerPolicy="no-referrer"
        />
      )}
      
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6 border border-white/20">
            <Lock className="text-white" size={32} />
          </div>
          <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-white mb-2">Pro Content</p>
          <div className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full">
            <Zap size={12} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Upgrade to Unlock</span>
          </div>
        </div>
      )}

      {shouldBlurExplicit && !isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-10">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 border border-red-500/40">
            <Lock className="text-red-500" size={24} />
          </div>
          <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-white text-center px-6">Explicit Content Hidden</p>
          <p className="text-[8px] tracking-[0.2em] uppercase text-white/40 mt-2">Enable in Settings</p>
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
          {!isLocked && !shouldBlurExplicit && (
            <div className="flex gap-4 pb-4" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => toast.success('Wallpaper set successfully!', { description: 'Your background has been updated.' })}
                className="px-6 py-3 bg-white text-black rounded-full flex items-center gap-2 hover:scale-105 transition-transform text-xs font-bold uppercase tracking-widest"
              >
                <Monitor size={16} />
                Set Wallpaper
              </button>
              <button 
                onClick={async () => {
                  try {
                    await downloadImage(wp.url, `${wp.title.replace(/\s+/g, '_')}_1080p.jpg`);
                    toast.success('Download started', { description: 'Your high-resolution wallpaper is downloading.' });
                    onDownload?.(wp, '1080p');
                  } catch (e) {
                    toast.error('Download failed', { description: 'Could not download the wallpaper.' });
                  }
                }}
                className="px-6 py-3 border border-white text-white rounded-full flex items-center gap-2 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
              >
                <Download size={16} />
                Download Wallpaper
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({ wallpapers, isProUser = false, showExplicit = false, onUpgrade, customization, onDownload }) => {
  const [expandedWp, setExpandedWp] = useState<Wallpaper | null>(null);

  const handleExpand = (wp: Wallpaper) => {
    if (wp.isPro && !isProUser) {
      onUpgrade?.();
      return;
    }
    setExpandedWp(wp);
  };

  const isExplicitHidden = (wp: Wallpaper) => wp.tags?.includes('explicit') && !showExplicit;

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
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-20"
          >
            <motion.button 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onClick={() => setExpandedWp(null)}
              className="absolute top-12 right-12 flex items-center gap-4 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all group z-[110]"
            >
              <span className="text-xs tracking-[0.4em] uppercase font-bold">Back</span>
              <X size={20} className="group-hover:rotate-90 transition-transform" />
            </motion.button>

            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                {expandedWp.isLive ? (
                  <video
                    src={expandedWp.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ 
                      filter: (customization ? `blur(${customization.blur / 5}px)` : 'none') + (isExplicitHidden(expandedWp) ? ' blur(50px)' : '')
                    }}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-[0_0_100px_rgba(255,255,255,0.1)]"
                  />
                ) : (
                  <motion.img
                    layoutId={`wp-${expandedWp.id}`}
                    src={expandedWp.url}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", damping: 25, stiffness: 120 }}
                    style={{ 
                      filter: (customization ? `blur(${customization.blur / 5}px)` : 'none') + (isExplicitHidden(expandedWp) ? ' blur(50px)' : '')
                    }}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-[0_0_100px_rgba(255,255,255,0.1)]"
                    referrerPolicy="no-referrer"
                  />
                )}
                {isExplicitHidden(expandedWp) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-3xl rounded-lg">
                    <Lock className="text-red-500 mb-4" size={48} />
                    <h4 className="text-2xl font-black uppercase tracking-widest italic">Explicit Content</h4>
                    <p className="text-xs opacity-60 mt-2 uppercase tracking-[0.3em]">Enable in account settings to view and download</p>
                  </div>
                )}
                {customization && customization.gradient > 0 && (
                  <div 
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    style={{ 
                      background: `linear-gradient(to bottom, transparent, rgba(0,0,0,${customization.gradient / 100}))`
                    }}
                  />
                )}
              </div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col md:flex-row items-end justify-between gap-12 text-white"
              >
                <div className="flex-1 space-y-8 max-w-2xl">
                  <div className="space-y-2">
                    <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-light">{expandedWp.category}</p>
                    <h3 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">{expandedWp.title}</h3>
                  </div>
                  
                  <p className="text-sm font-light leading-relaxed opacity-60">
                    {expandedWp.description || 'No description available for this piece.'}
                  </p>

                  <div className="flex flex-wrap gap-8 pt-4">
                    <div className="space-y-2">
                      <p className="text-[8px] uppercase tracking-widest opacity-30 font-bold">Software</p>
                      <div className="flex gap-3">
                        {expandedWp.software?.map(s => (
                          <span key={s} className="text-[10px] uppercase tracking-widest font-medium opacity-60">{s}</span>
                        )) || <span className="text-[10px] opacity-40 italic">N/A</span>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[8px] uppercase tracking-widest opacity-30 font-bold">Tags</p>
                      <div className="flex flex-wrap gap-3">
                        {expandedWp.tags?.map(t => (
                          <span key={t} className="text-[10px] uppercase tracking-widest font-medium opacity-60">#{t}</span>
                        )) || <span className="text-[10px] opacity-40 italic">N/A</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-w-[240px]">
                  <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-bold mb-2">Download Options</p>
                  
                  {[
                    { label: '1080p Standard', res: '1080p', pro: false },
                    { label: '4K Ultra High Def', res: '4K', pro: true },
                    { label: 'Ultrawide Panoramic', res: 'Ultrawide', pro: true },
                  ].map((opt) => {
                    const isOptLocked = (opt.pro && !isProUser) || isExplicitHidden(expandedWp);
                    const downloadUrl = expandedWp.downloadUrls?.[opt.res as keyof typeof expandedWp.downloadUrls] || expandedWp.url;
                    
                    return (
                      <button
                        key={opt.res}
                        onClick={async () => {
                          if (isExplicitHidden(expandedWp)) return;
                          if (opt.pro && !isProUser) {
                            onUpgrade?.();
                          } else {
                            try {
                              await downloadImage(downloadUrl, `${expandedWp.title.replace(/\s+/g, '_')}_${opt.res}.jpg`);
                              toast.success(`Downloading ${opt.res} version`, { description: 'Your high-resolution wallpaper is downloading.' });
                              onDownload?.(expandedWp, opt.res);
                            } catch (e) {
                              toast.error('Download failed', { description: 'Could not download the wallpaper.' });
                            }
                          }
                        }}
                        className={`group flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${isOptLocked ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed' : 'border-white/10 hover:bg-white hover:text-black'}`}
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                          <span className="text-[8px] opacity-40 uppercase tracking-widest">{opt.res}</span>
                        </div>
                        {isOptLocked ? <Lock size={14} className="opacity-40" /> : <Download size={16} className="group-hover:translate-y-1 transition-transform" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
