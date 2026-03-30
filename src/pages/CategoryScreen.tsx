import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallpapers } from '../hooks/useWallpapers';
import { useAuthContext } from '../providers/AuthProvider';
import { WallpaperGrid } from '../components/WallpaperGrid';
import { Category } from '../types';
import { motion } from 'motion/react';
import { ArrowLeft, Sliders, LayoutGrid, List } from 'lucide-react';
import { CATEGORIES } from '../constants';

export const CategoryScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isPro } = useAuthContext();
  
  // Convert id to Category type (capitalize first letter)
  const categoryName = (id?.charAt(0).toUpperCase() + id?.slice(1)) as Category;
  const categoryData = CATEGORIES.find(c => c.name === categoryName);

  const { wallpapers, loading, hasMore, loadMore } = useWallpapers({ 
    category: categoryName,
    pageSize: 12 
  });

  // Handle intersection for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >=
        document.documentElement.offsetHeight
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  return (
    <div className="min-h-screen">
      {/* Category Header */}
      <div className="relative h-[60vh] w-full overflow-hidden flex flex-col justify-end p-12 md:p-24">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5 }}
          src={categoryData?.image} 
          className="absolute inset-0 w-full h-full object-cover grayscale"
          alt={categoryName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="relative z-10 space-y-8">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.5em] font-black italic opacity-40 hover:opacity-100 transition-all"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
            Back to Discovery
          </button>
          
          <div className="space-y-4">
            <p className="text-[10px] tracking-[1em] uppercase opacity-40 font-light">Collection</p>
            <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter italic uppercase leading-none text-white">
              {categoryName}
            </h1>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-24 z-50 px-12 py-8 bg-black/60 backdrop-blur-xl border-y border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-bold italic">
            {wallpapers.length} Wallpapers Found
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
            <Sliders size={16} className="opacity-40" />
          </button>
          <div className="h-8 w-[1px] bg-white/10" />
          <button className="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest italic">
            <LayoutGrid size={14} />
            Grid View
          </button>
        </div>
      </div>

      {/* Grid */}
      <section className="px-6 py-12">
        <WallpaperGrid 
          wallpapers={wallpapers} 
          isProUser={isPro}
          showExplicit={user?.settings?.showExplicit}
          onUpgrade={() => navigate('/pro')}
        />

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-8">
            <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
            <p className="text-[10px] uppercase tracking-[1em] opacity-40">Loading {categoryName} Gallery</p>
          </div>
        )}
      </section>
    </div>
  );
};
