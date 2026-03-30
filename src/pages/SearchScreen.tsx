import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useWallpapers } from '../hooks/useWallpapers';
import { useAuthContext } from '../providers/AuthProvider';
import { WallpaperGrid } from '../components/WallpaperGrid';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Sliders, TrendingUp, Sparkles, Filter, BrainCircuit, Loader2 } from 'lucide-react';
import { useAISearch } from '../hooks/useAISearch';

export const SearchScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get('q') || '';
  const filterParam = (searchParams.get('filter') as any) || 'latest';
  const resParam = searchParams.get('res') || '';
  
  const [inputValue, setInputValue] = useState(queryParam);
  const { user, isPro } = useAuthContext();
  const { extractSearchParameters, isAnalyzing } = useAISearch();

  const { wallpapers, loading, hasMore, loadMore } = useWallpapers({ 
    searchQuery: queryParam,
    filter: filterParam,
    resolution: resParam,
    pageSize: 12 
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // AI Analysis if the query looks like a description (more than 2 words)
    if (inputValue.split(' ').length > 2) {
      const aiParams = await extractSearchParameters(inputValue);
      setSearchParams(prev => {
        prev.set('q', aiParams.optimizedQuery || inputValue);
        if (aiParams.category) prev.set('category', aiParams.category.toLowerCase());
        return prev;
      });
    } else {
      setSearchParams(prev => {
        prev.set('q', inputValue);
        return prev;
      });
    }
  };

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

  const activeFilters = [
    { id: 'latest', label: 'Latest', icon: Sparkles },
    { id: 'popular', label: 'Popular', icon: TrendingUp },
    { id: 'featured', label: 'Featured', icon: Filter },
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Search Header */}
      <div className="px-6 md:px-24 py-12 space-y-12">
        <form onSubmit={handleSearch} className="relative max-w-4xl">
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-4">
            {isAnalyzing ? (
              <Loader2 className="text-blue-500 animate-spin" size={24} />
            ) : (
              <Search className="text-white opacity-20" size={24} />
            )}
          </div>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe a vibe (e.g. 'moody mountain night')..."
            className={`w-full bg-white/5 border ${isAnalyzing ? 'border-blue-500/50' : 'border-white/10'} rounded-3xl py-8 pl-24 pr-8 text-2xl font-black italic tracking-tighter uppercase focus:bg-white/10 outline-none transition-all placeholder:opacity-20`}
          />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-4">
            {inputValue && !isAnalyzing && (
              <button 
                type="button"
                onClick={() => { setInputValue(''); setSearchParams({}); }}
                title="Clear Search"
                aria-label="Clear Search"
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={20} className="opacity-40" />
              </button>
            )}
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <BrainCircuit className={`transition-opacity ${isAnalyzing ? 'opacity-100 text-blue-400' : 'opacity-20'}`} size={20} />
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-6">
          <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-black italic mr-4">Filter By</p>
          {activeFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setSearchParams(prev => {
                prev.set('filter', f.id);
                return prev;
              })}
              className={`flex items-center gap-3 px-8 py-4 rounded-full border transition-all ${filterParam === f.id ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/40'}`}
            >
              <f.icon size={14} className={filterParam === f.id ? 'opacity-100' : 'opacity-40'} />
              <span className="text-[10px] font-black uppercase tracking-widest italic">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <section className="px-6 py-12">
        <div className="px-12 mb-12 flex items-center justify-between">
          <h2 className="text-[10px] tracking-[1em] uppercase opacity-40 font-black italic">
            {queryParam ? `Search Results for "${queryParam}"` : `${filterParam.charAt(0).toUpperCase() + filterParam.slice(1)} Gallery`}
          </h2>
          <span className="text-[10px] tracking-[0.5em] uppercase opacity-20 font-light">
            {wallpapers.length} pieces found
          </span>
        </div>

        <WallpaperGrid 
          wallpapers={wallpapers} 
          isProUser={isPro}
          showExplicit={user?.settings?.showExplicit}
          onUpgrade={() => navigate('/pro')}
        />

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-8">
            <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
            <p className="text-[10px] uppercase tracking-[1em] opacity-40 animate-pulse">Scanning Gallery Archive</p>
          </div>
        )}

        {!loading && wallpapers.length === 0 && (
          <div className="py-40 text-center space-y-8">
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto opacity-20">
              <Search size={32} />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black italic uppercase tracking-tighter">No visuals detected</p>
              <p className="text-[10px] tracking-[0.5em] uppercase opacity-40">Try searching for broader tags or categories</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
