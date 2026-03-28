import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, Clock, Star, Shuffle, Heart, Folder, Upload, Monitor, User, Moon, Sun, Info, Shield } from 'lucide-react';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (state: any) => void;
  isPro: boolean;
  user: any;
  onLogout: () => void;
}

export const Menu: React.FC<MenuProps> = ({ isOpen, onClose, onNavigate, isPro, user, onLogout }) => {
  const menuSections = [
    {
      title: '1. Discovery & Curation',
      items: [
        { icon: TrendingUp, label: 'Top Charts / Popular', action: () => onNavigate('main') },
        { icon: Clock, label: 'New Releases', action: () => onNavigate('new-releases') },
        { icon: Star, label: "Editor's Choice", action: () => onNavigate('main') },
        { icon: Shuffle, label: 'Random', action: () => onNavigate('main') },
      ]
    },
    {
      title: '2. Personalization & Community',
      items: [
        { icon: Heart, label: 'My Favorites / Likes', action: () => onNavigate('account') },
        { icon: Folder, label: 'My Collections', action: () => onNavigate('account') },
        { icon: Upload, label: 'Upload', action: () => onNavigate('account'), isProOnly: true },
      ]
    },
    {
      title: '3. Technical Filters',
      items: [
        { icon: Monitor, label: 'Resolution Filters', action: () => onNavigate('main') },
        { icon: Monitor, label: 'Desktop', action: () => onNavigate('main'), sub: true },
        { icon: Monitor, label: 'Ultrawide', action: () => onNavigate('main'), sub: true },
        { icon: Monitor, label: '4K / 8K', action: () => onNavigate('main'), sub: true },
      ]
    },
    {
      title: '4. Utility & Settings',
      items: [
        { icon: User, label: 'Account / Profile', action: () => onNavigate('account') },
        { icon: Info, label: 'About / License', action: () => onNavigate('main') },
      ]
    },
    {
      title: '5. Social',
      items: [
        { icon: Heart, label: 'Instagram', action: () => window.open('https://www.instagram.com/bigcatgraphics/', '_blank') },
        { icon: Shuffle, label: 'Twitter (X)', action: () => window.open('https://x.com/_bigcatgraphics', '_blank') },
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-black/90 text-white backdrop-blur-2xl border-l border-white/10 z-[210] overflow-y-auto"
          >
            <div className="p-12 space-y-16">
              <div className="flex items-center justify-between">
                <p className="text-[10px] tracking-[1em] uppercase opacity-40 font-light">Menu</p>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-12">
                {menuSections.map((section, idx) => (
                  <div key={idx} className="space-y-6">
                    <h3 className="text-[10px] uppercase tracking-widest font-black opacity-40 border-b border-white/10 pb-4">
                      {section.title}
                    </h3>
                    <div className="grid gap-2">
                      {section.items.map((item, itemIdx) => (
                        <button
                          key={itemIdx}
                          onClick={() => {
                            if (item.isProOnly && !isPro) return;
                            item.action();
                            onClose();
                          }}
                          className={`flex items-center justify-between group p-4 rounded-2xl hover:bg-white/5 transition-all ${item.sub ? 'ml-6' : ''} ${item.isProOnly && !isPro ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center gap-4">
                            <item.icon size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                            <span className="text-xs font-bold tracking-widest uppercase italic">{item.label}</span>
                          </div>
                          {item.isProOnly && !isPro && (
                            <span className="text-[8px] px-2 py-1 bg-amber-400 text-black rounded-full font-black">PRO</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {user && (
                <div className="pt-12 border-t border-white/10">
                  <button 
                    onClick={() => { onLogout(); onClose(); }}
                    className="w-full py-4 rounded-full border border-white/20 text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
