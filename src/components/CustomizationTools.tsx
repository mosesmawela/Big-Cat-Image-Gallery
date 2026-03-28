import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sliders, Droplets, Palette, X, Layout, Grid, Columns, Rows } from 'lucide-react';

interface CustomizationToolsProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (settings: { blur: number; gradient: number; layout: string }) => void;
  isPro: boolean;
  isLight?: boolean;
}

export const CustomizationTools: React.FC<CustomizationToolsProps> = ({ isOpen, onClose, onUpdate, isPro, isLight }) => {
  const [blur, setBlur] = useState(0);
  const [gradient, setGradient] = useState(0);
  const [layout, setLayout] = useState('grid');

  const handleUpdate = (newBlur: number, newGradient: number, newLayout: string) => {
    if (!isPro) return;
    setBlur(newBlur);
    setGradient(newGradient);
    setLayout(newLayout);
    onUpdate({ blur: newBlur, gradient: newGradient, layout: newLayout });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      className={`fixed bottom-8 right-8 w-80 backdrop-blur-2xl border z-[150] p-10 rounded-[40px] shadow-2xl transition-colors duration-500 ${isLight ? 'bg-black/90 text-white border-white/10' : 'bg-white/80 text-black border-black/5'}`}
    >
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <Sliders size={18} className="opacity-40" />
          <h2 className="text-[10px] font-black tracking-widest uppercase italic text-inherit">Customize</h2>
        </div>
        <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
          <X size={16} />
        </button>
      </div>

      <div className="space-y-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Droplets size={14} className="opacity-40" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-inherit">Blur</span>
            </div>
            <span className="text-[10px] font-mono opacity-40 text-inherit">{blur}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={blur}
            disabled={!isPro}
            onChange={(e) => handleUpdate(Number(e.target.value), gradient, layout)}
            className={`w-full h-[2px] appearance-none cursor-pointer ${isLight ? 'bg-white/20 accent-white' : 'bg-black/20 accent-black'} ${!isPro ? 'opacity-20 cursor-not-allowed' : ''}`}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Palette size={14} className="opacity-40" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-inherit">Gradient</span>
            </div>
            <span className="text-[10px] font-mono opacity-40 text-inherit">{gradient}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={gradient}
            disabled={!isPro}
            onChange={(e) => handleUpdate(blur, Number(e.target.value), layout)}
            className={`w-full h-[2px] appearance-none cursor-pointer ${isLight ? 'bg-white/20 accent-white' : 'bg-black/20 accent-black'} ${!isPro ? 'opacity-20 cursor-not-allowed' : ''}`}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Layout size={14} className="opacity-40" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-inherit">Layout</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'grid', icon: Grid },
              { id: 'columns', icon: Columns },
              { id: 'rows', icon: Rows },
            ].map((item) => (
              <button
                key={item.id}
                disabled={!isPro}
                onClick={() => handleUpdate(blur, gradient, item.id)}
                className={`flex items-center justify-center p-3 rounded-2xl border transition-all ${layout === item.id ? (isLight ? 'bg-white text-black border-white' : 'bg-black text-white border-black') : (isLight ? 'border-white/10 hover:bg-white/10' : 'border-black/5 hover:bg-black/5')} ${!isPro ? 'opacity-20 cursor-not-allowed' : ''}`}
              >
                <item.icon size={16} />
              </button>
            ))}
          </div>
        </div>

        <div className={`pt-8 border-t ${isLight ? 'border-white/10' : 'border-black/5'}`}>
          <p className="text-[8px] uppercase tracking-widest opacity-40 leading-relaxed font-light text-inherit">
            {isPro ? 'Pro features unlocked.' : 'Pro membership required for customization.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
