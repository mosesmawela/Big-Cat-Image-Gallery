import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Folder, Upload, User, Info, Instagram, Twitter, LogOut, Shield, Sparkles, Lock } from 'lucide-react';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (state: any) => void;
  isPro: boolean;
  user: any;
  onLogout: () => void;
  onAbout: () => void;
}

export const Menu: React.FC<MenuProps> = ({ isOpen, onClose, onNavigate, isPro, user, onLogout, onAbout }) => {
  const profileSections = [
    {
      title: 'Neural Archives',
      items: [
        { icon: Heart, label: 'My Favorites', action: () => onNavigate('account'), isProOnly: false },
        { icon: Folder, label: 'My Collections', action: () => onNavigate('account'), isProOnly: false },
        { icon: Upload, label: 'Neural Upload', action: () => onNavigate('account'), isProOnly: true },
      ]
    },
    {
      title: 'Security & Access',
      items: [
        { icon: User, label: 'Identity / Profile', action: () => onNavigate('account'), isProOnly: false },
        { icon: Shield, label: 'Privacy Protocol', action: () => onNavigate('account'), isProOnly: false },
        { icon: Info, label: 'Neural License', action: onAbout, isProOnly: false },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-black/90 text-white backdrop-blur-3xl border-l border-white/10 z-[210] overflow-y-auto"
          >
            <div className="p-12 space-y-16">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[1em] uppercase opacity-40 font-black italic">Neural Link</span>
                  <span className="text-[8px] tracking-[0.5em] uppercase opacity-20">Session Established</span>
                </div>
                <button onClick={onClose} className="p-4 hover:bg-white/5 rounded-full transition-colors border border-white/5">
                  <X size={20} />
                </button>
              </div>

              {/* User Identity Card */}
              <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-navy to-brand-burgundy p-[1px]">
                    <div className="w-full h-full rounded-[23px] bg-black overflow-hidden flex items-center justify-center">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Identity" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="opacity-20" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">{user?.displayName || 'Unknown Subject'}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`text-[8px] px-3 py-1 rounded-full font-black tracking-widest uppercase ${isPro ? 'bg-brand-peach text-black' : 'bg-white/10 text-white/40'}`}>
                        {isPro ? 'Pro Access' : 'Standard'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {!isPro && (
                  <button 
                    onClick={() => { onNavigate('pro'); onClose(); }}
                    className="w-full py-4 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic hover:scale-105 transition-all flex items-center justify-center gap-3"
                  >
                    <Sparkles size={14} className="text-brand-peach" />
                    Elevate to Pro
                  </button>
                )}
              </div>

              {/* Sections */}
              <div className="space-y-12">
                {profileSections.map((section, idx) => (
                  <div key={idx} className="space-y-6">
                    <h2 className="text-[10px] uppercase tracking-[0.6em] font-black opacity-30 border-b border-white/5 pb-4 ml-4">
                      {section.title}
                    </h2>
                    <div className="grid gap-2">
                      {section.items.map((item, itemIdx) => (
                        <button
                          key={itemIdx}
                          onClick={() => {
                            if (item.isProOnly && !isPro) {
                              onNavigate('pro');
                            } else {
                              item.action();
                            }
                            onClose();
                          }}
                          className={`flex items-center justify-between group p-6 rounded-[24px] hover:bg-white/5 transition-all ${item.isProOnly && !isPro ? 'opacity-40' : ''}`}
                        >
                          <div className="flex items-center gap-6">
                            <item.icon size={18} className="opacity-40 group-hover:opacity-100 group-hover:text-brand-peach transition-all" />
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">{item.label}</span>
                          </div>
                          {item.isProOnly && !isPro && <Lock size={12} className="text-white/40" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Hub */}
              <div className="space-y-8 pt-8 border-t border-white/5">
                <p className="text-[10px] tracking-[0.5em] uppercase opacity-20 font-bold ml-4 text-center">Neural Connectivity</p>
                <div className="flex justify-center gap-6">
                  <button 
                    onClick={() => window.open('https://instagram.com', '_blank')}
                    className="p-5 bg-white/5 rounded-full hover:bg-white/10 hover:text-pink-500 transition-all border border-white/5 group"
                  >
                    <Instagram size={20} className="opacity-40 group-hover:opacity-100" />
                  </button>
                  <button 
                    onClick={() => window.open('https://twitter.com', '_blank')}
                    className="p-5 bg-white/5 rounded-full hover:bg-white/10 hover:text-blue-400 transition-all border border-white/5 group"
                  >
                    <Twitter size={20} className="opacity-40 group-hover:opacity-100" />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-12">
                <button 
                  onClick={() => { onLogout(); onClose(); }}
                  className="w-full py-6 rounded-[32px] border border-rose-500/20 text-rose-500 text-[10px] uppercase tracking-[0.5em] font-black italic hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-4 group"
                >
                  <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
                  Terminate Link
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
