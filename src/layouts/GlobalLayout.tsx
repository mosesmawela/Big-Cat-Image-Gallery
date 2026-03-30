import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlobalBackground } from '../components/GlobalBackground';
import { CustomCursor } from '../components/CustomCursor';
import { CursorRipple } from '../components/CursorRipple';
import { Menu } from '../components/Menu';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu as MenuIcon, Search, User as UserIcon, ChevronDown, Monitor, Sparkles, TrendingUp, Shuffle, Star, Sliders, RotateCcw } from 'lucide-react';
import { useAuthContext } from '../providers/AuthProvider';
import { Magnetic } from '../components/shared/Magnetic';
import { useCustomization } from '../hooks/useCustomization';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const LOGO_URL = "https://ik.imagekit.io/BigCat/Logo%20Assets/BCG%20Logo%20Black.svg?updatedAt=1774706599542";

const VisualLab = ({ settings, updateSetting, resetSettings }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed left-8 bottom-8 z-[150] flex flex-col items-start gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
            className="bg-deep-navy/60 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 w-72 shadow-2xl space-y-8"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-brand-peach">Visual Lab</span>
              <button onClick={resetSettings} aria-label="Reset Settings" className="p-2 hover:bg-white/5 rounded-full transition-all opacity-40 hover:opacity-100">
                <RotateCcw size={14} />
              </button>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Neural Blur', key: 'blur', min: 0, max: 20 },
                { label: 'Exposure', key: 'brightness', min: 50, max: 150 },
                { label: 'Saturation', key: 'saturation', min: 0, max: 200 },
                { label: 'Contrast', key: 'contrast', min: 50, max: 150 },
              ].map((control) => (
                <div key={control.key} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[8px] uppercase tracking-widest opacity-40 font-bold">{control.label}</label>
                    <span className="text-[8px] font-mono opacity-60">{settings[control.key]}%</span>
                  </div>
                  <input 
                    type="range"
                    min={control.min}
                    max={control.max}
                    value={settings[control.key]}
                    onChange={(e) => updateSetting(control.key, parseInt(e.target.value))}
                    className="w-full h-[2px] bg-white/10 appearance-none cursor-pointer accent-brand-peach"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Visual Lab"
        className={`p-5 rounded-full border transition-all ${isOpen ? 'bg-brand-peach border-brand-peach text-deep-navy' : 'bg-deep-navy/40 backdrop-blur-xl border-white/10 text-white/40 hover:text-white'}`}
      >
        <Sliders size={20} />
      </button>
    </div>
  );
};

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const { settings, updateSetting, resetSettings, getFilterString } = useCustomization();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white selection:bg-brand-crimson/30">
      <GlobalBackground />
      <CustomCursor />
      <CursorRipple />
      
      {/* GLOBAL NAVBAR */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
        <div className="bg-deep-navy/40 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-4 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.3)] saturate-[1.8]">
          <div className="flex items-center gap-12 text-white">
            <Magnetic strength={0.2}>
              <Link to="/" className="flex items-center gap-4 group">
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-navy to-brand-burgundy flex items-center justify-center group-hover:rotate-12 transition-transform duration-700 p-2">
                   <img src={LOGO_URL} alt="BCG Logo" className="w-full h-full object-contain invert" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tighter italic uppercase leading-none">Big Cat</span>
                  <span className="text-[9px] tracking-[0.6em] uppercase opacity-30 font-black">Archives</span>
                </div>
              </Link>
            </Magnetic>

            <div className="hidden lg:flex items-center gap-4">
              <button 
                onClick={() => handleNavClick('/search?filter=popular')}
                className="px-6 py-2 rounded-full hover:bg-white/5 transition-all text-[10px] uppercase tracking-[0.3em] font-black italic text-white/60 hover:text-white"
              >
                Discovery
              </button>
              <button 
                onClick={() => handleNavClick('/search?res=4k')}
                className="px-6 py-2 rounded-full hover:bg-white/5 transition-all text-[10px] uppercase tracking-[0.3em] font-black italic text-white/60 hover:text-white"
              >
                Filters
              </button>
              <Link to="/pro" className="flex items-center gap-3 px-6 py-2 rounded-full hover:bg-white/5 transition-all group">
                <Sparkles size={14} className="text-brand-peach opacity-60 group-hover:opacity-100 transition-all" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-black italic text-brand-peach/60 group-hover:text-brand-peach">Go Pro</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => handleNavClick('/search')} aria-label="Search" className="p-3 hover:bg-white/5 rounded-full transition-all group">
              <Search size={18} className="opacity-40 group-hover:opacity-100 transition-all" />
            </button>
            <div className="h-6 w-[1px] bg-white/10 mx-2" />
            <Magnetic strength={0.1}>
              <button onClick={() => setIsMenuOpen(true)} className="group flex items-center gap-4 bg-white/5 border border-white/10 pr-6 pl-3 py-3 rounded-full hover:bg-white/10 transition-all">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy to-brand-burgundy flex items-center justify-center overflow-hidden border border-white/10">
                  {user?.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : <UserIcon size={14} className="opacity-40" />}
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-black italic text-white">Neural Link</span>
                <MenuIcon size={16} className="text-brand-peach opacity-40 group-hover:opacity-100 transition-opacity" />
              </button>
            </Magnetic>
          </div>
        </div>
      </nav>

      {/* VISUAL LAB TOOLBAR */}
      <VisualLab settings={settings} updateSetting={updateSetting} resetSettings={resetSettings} />

      {/* CONTENT AREA WITH APPLIED GLOBAL FILTERS */}
      <main className="relative pt-40 pb-20 transition-all duration-500" style={{ filter: getFilterString() }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Menu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onNavigate={(state: string) => navigate(`/${state}`)}
        isPro={user?.isPro || false}
        user={user}
        onLogout={async () => {
          await logout();
          setIsMenuOpen(false);
          navigate('/');
        }}
        onAbout={() => navigate('/about')}
      />

      <footer className="fixed bottom-8 right-8 z-[100] pointer-events-none opacity-20">
        <p className="text-[10px] tracking-[0.5em] uppercase font-light italic text-white/50">BIG CAT IMAGE GALLERY © 2026</p>
      </footer>
    </div>
  );
};
