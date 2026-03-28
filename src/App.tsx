import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { CustomCursor } from './components/CustomCursor';
import { WaterRipple } from './components/WaterRipple';
import { CursorRipple } from './components/CursorRipple';
import { ThreeBackground } from './components/ThreeBackground';
import { GlobalBackground } from './components/GlobalBackground';
import { CategoryCard } from './components/CategoryCard';
import { WallpaperGrid } from './components/WallpaperGrid';
import { WaterSimulation } from './components/WaterSimulation';
import { HorizontalGallery } from './components/HorizontalGallery';
import { auth, db, onAuthStateChanged, signOut, OperationType, handleFirestoreError } from './firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, getDocs, addDoc } from 'firebase/firestore';
import { CATEGORIES, LATEST_WALLPAPER } from './constants';
import { AppState, Category, User as UserType, Wallpaper } from './types';
import { Pricing } from './components/Pricing';
import { Auth } from './components/Auth';
import { CustomizationTools } from './components/CustomizationTools';
import { AccountManagement } from './components/AccountManagement';
import { Menu as GlassMenu } from './components/Menu';
import { ArrowLeft, Mail, Instagram, Twitter, Search, Bell, User, Zap, Sliders, Clock, Menu as MenuIcon } from 'lucide-react';
import { Toaster } from 'sonner';
import { downloadImage } from './lib/utils';

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-end text-white mix-blend-difference">
      <div className="flex items-center gap-4 opacity-40 mb-2">
        <Clock size={12} />
        <span className="text-[10px] uppercase tracking-[0.5em] font-light">Local Time</span>
      </div>
      <span className="text-4xl font-black tracking-tighter italic uppercase">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </span>
    </div>
  );
};

const FONT_MAP: Record<string, string> = {
  'Nature': 'font-serif',
  'Futuristic': 'font-space',
  'Minimal': 'font-sans',
  'Abstract': 'font-display',
  'Multi-Monitor': 'font-mono',
  'Live Wallpaper': 'font-outfit',
};

export default function App() {
  const [state, setState] = useState<AppState>('loading');
  const [showRipple, setShowRipple] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customization, setCustomization] = useState({ blur: 0, gradient: 0, layout: 'grid' });
  const [user, setUser] = useState<UserType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [customSettings, setCustomSettings] = useState({ blur: 0, gradient: 0 });
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [isWallpapersLoading, setIsWallpapersLoading] = useState(true);

  const isPro = user?.isPro || false;
  const showExplicit = user?.settings?.showExplicit || false;
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Firebase Auth Listener
  useEffect(() => {
    // Safety timeout to ensure app leaves loading state
    const safetyTimeout = setTimeout(() => {
      if (state === 'loading') {
        setState('splash');
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Safety timeout to ensure app leaves loading state
      const safetyTimeout = setTimeout(() => {
        if (state === 'loading') {
          setState('splash');
        }
        setIsAuthReady(true);
      }, 5000);

      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserType;
            // Force Pro access for the specific admin email
            const isAdminEmail = firebaseUser.email?.toLowerCase() === 'jamessaikonde@gmail.com';
            const isProUser = isAdminEmail || userData.isPro || false;
            const updatedUser = { ...userData, isPro: isProUser };
            setUser(updatedUser);
          } else {
            // Create initial user profile if it doesn't exist
            const newUser: UserType = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              isPro: firebaseUser.email?.toLowerCase() === 'jamessaikonde@gmail.com',
              favorites: [],
              settings: {
                theme: 'dark',
                showExplicit: false,
                emailNotifications: true,
                publicProfile: true
              },
              downloadHistory: [],
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              ...newUser,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            setUser(newUser);
          }
        } catch (error) {
          try {
            handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          } catch (e: any) {
            setError(e);
          }
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
      clearTimeout(safetyTimeout);
      if (state === 'loading') {
        setState('splash');
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  // Fetch wallpapers
  useEffect(() => {
    const fetchWallpapers = async () => {
      setIsWallpapersLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'wallpapers'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Wallpaper));
        
        // If no wallpapers in Firestore, use initial data from constants
        if (docs.length === 0) {
          const { WALLPAPERS: initialWallpapers } = await import('./constants');
          // Seed Firestore with initial data
          for (const wp of initialWallpapers) {
            await addDoc(collection(db, 'wallpapers'), { 
              ...wp, 
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
          setWallpapers(initialWallpapers);
        } else {
          setWallpapers(docs);
        }
      } catch (error) {
        try {
          handleFirestoreError(error, OperationType.GET, 'wallpapers');
        } catch (e: any) {
          setError(e);
        }
      } finally {
        setIsWallpapersLoading(false);
      }
    };

    fetchWallpapers();
  }, []);

  useEffect(() => {
    if (state === 'loading' && isAuthReady) {
      const timer = setTimeout(() => {
        setState('splash');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state, isAuthReady]);

  const handleSplashClick = () => {
    setShowRipple(true);
  };

  const onRippleComplete = () => {
    setShowRipple(false);
    setState('main');
  };

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    setState('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (newUser: UserType) => {
    setUser(newUser);
    setIsAuthOpen(false);
  };

  const handleUpgrade = async (isYearly: boolean) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    
    try {
      // For jamessaikonde@gmail.com, we can just upgrade directly for testing
      if (user.email?.toLowerCase() === 'jamessaikonde@gmail.com') {
        const updates = {
          isPro: true,
          subscriptionType: isYearly ? 'yearly' : 'monthly',
          updatedAt: serverTimestamp(),
        };
        try {
          await updateDoc(doc(db, 'users', user.uid), updates);
        } catch (error) {
          try {
            handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
          } catch (e: any) {
            setError(e);
            return;
          }
        }
        setUser({ 
          ...user, 
          isPro: true, 
          subscriptionType: isYearly ? 'yearly' : 'monthly' 
        });
        setState('main');
        toast.success('Successfully upgraded to Pro!');
        return;
      }

      // For other users, redirect to Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: isYearly ? 'price_yearly_id' : 'price_monthly_id', // These should be real IDs from Stripe dashboard
          userId: user.uid,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast.error('Upgrade failed', { description: error.message });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setState('main');
      toast.success('Successfully logged out');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Logout failed', { description: error.message });
    }
  };

  const handleUpdateUser = async (updates: Partial<UserType>) => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          ...updates,
          updatedAt: serverTimestamp(),
        });
        const newUser = { ...user, ...updates };
        setUser(newUser);
      } catch (error) {
        try {
          handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
        } catch (e: any) {
          setError(e);
        }
      }
    }
  };

  const handleDownloadRecord = async (wp: Wallpaper, resolution: string) => {
    if (user) {
      const newDownload = {
        id: wp.id + '_' + Date.now(),
        wallpaperId: wp.id,
        title: wp.title,
        date: new Date().toLocaleDateString(),
        resolution: resolution
      };
      const newHistory = [newDownload, ...(user.downloadHistory || [])].slice(0, 50);
      await handleUpdateUser({ downloadHistory: newHistory });
    }
  };

  const filteredWallpapers = wallpapers.filter(wp => {
    const isCategoryMatch = wp.category === selectedCategory;
    const isExplicitMatch = user?.settings?.showExplicit ? true : !wp.tags?.includes('explicit');
    return isCategoryMatch && isExplicitMatch;
  });
  const searchedWallpapers = wallpapers.filter(wp => {
    const isSearchMatch = wp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wp.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const isExplicitMatch = user?.settings?.showExplicit ? true : !wp.tags?.includes('explicit');
    return isSearchMatch && isExplicitMatch;
  });
  const currentFont = selectedCategory ? FONT_MAP[selectedCategory] || 'font-sans' : 'font-sans';

  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const isLightState = state === 'category' || state === 'account';
  const navColorClass = isLightState ? 'text-black border-black/20 hover:bg-black/5' : 'text-white border-white/10 hover:bg-white/5';

  if (error) {
    throw error;
  }

  if (state === 'loading') {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-[1px] bg-white/20 mx-auto" />
          <p className="text-[10px] tracking-[1em] uppercase opacity-40">
            Please wait as we are it loads for a better experience
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen selection:bg-white selection:text-black overflow-x-hidden transition-all duration-700 bg-black text-white font-sans ${state === 'category' ? currentFont : ''}`}>
      <Toaster theme="dark" position="bottom-right" />
      <CustomCursor />
      {state !== 'category' && <GlobalBackground theme="dark" />}
      
      {/* Top Navigation */}
      <div className="fixed top-8 left-0 w-full z-[100] px-12 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          <button
            onClick={() => {
              if (state === 'category' || state === 'search' || state === 'account' || state === 'pricing' || state === 'new-releases') {
                setState('main');
              } else if (state === 'main') {
                setState('splash');
              } else {
                setState('main');
              }
            }}
            className={`p-3 rounded-full border backdrop-blur-md transition-all ${navColorClass}`}
          >
            <ArrowLeft size={18} />
          </button>
          {state === 'main' && (
            <button 
              onClick={() => setState('search')}
              className={`p-3 rounded-full border backdrop-blur-md transition-all ${navColorClass}`}
            >
              <Search size={18} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 md:gap-6 pointer-events-auto">
          <button 
            onClick={() => setState(state === 'pricing' ? 'main' : 'pricing')}
            className={`flex items-center gap-4 px-4 md:px-6 py-2 rounded-full border backdrop-blur-md transition-all ${navColorClass}`}
          >
            <Zap size={14} className={isPro ? 'text-amber-400 fill-amber-400' : ''} />
            <span className="text-[8px] md:text-[10px] tracking-[0.3em] uppercase font-bold">{isPro ? 'Pro Active' : 'Go Pro'}</span>
          </button>
          
          {user ? (
            <button
              onClick={() => setState('account')}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full border overflow-hidden transition-all ${isLightState ? 'border-black/20' : 'border-white/10'}`}
            >
              <img 
                src={user.photoURL || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80"} 
                className="w-full h-full object-cover"
                alt="Profile"
                referrerPolicy="no-referrer"
              />
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2 rounded-full border backdrop-blur-md transition-all ${navColorClass}`}
            >
              <User size={10} className="md:w-[12px] md:h-[12px]" />
              <span className="text-[7px] md:text-[9px] uppercase tracking-[0.2em] font-bold">Sign In</span>
            </button>
          )}

          <button 
            onClick={() => setIsMenuOpen(true)}
            className={`p-3 rounded-full border backdrop-blur-md transition-all ${navColorClass}`}
          >
            <MenuIcon size={20} />
          </button>
        </div>
      </div>

      {/* Right Side Scroll Indicator */}
      <div className={`fixed right-6 top-1/2 -translate-y-1/2 h-64 w-[2px] z-[100] hidden md:block ${isLightState ? 'bg-black/10' : 'bg-white/10'}`}>
        <motion.div 
          className={`w-full origin-top ${isLightState ? 'bg-black' : 'bg-white'}`}
          style={{ scaleY: scrollYProgress, height: '100%' }}
        />
      </div>

      <AnimatePresence>
        {showRipple && <WaterRipple onComplete={onRippleComplete} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {state === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSplashClick}
            className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer z-50 bg-black"
          >
            <CursorRipple />
            <div className="absolute inset-0 z-0">
              <img 
                src={LATEST_WALLPAPER.url} 
                className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
                alt="Splash"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 z-10" />
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/5 z-10" />
            
            <div className="relative z-20 text-center space-y-8">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-[10px] tracking-[1em] uppercase font-bold"
              >
                Click anywhere to open
              </motion.p>
            </div>
          </motion.div>
        )}

            {state === 'main' && (
              <motion.main
                key="main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10"
              >
                {/* Hero Section */}
                <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
                  <motion.div 
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="absolute inset-0"
                  >
                    <img
                      src={LATEST_WALLPAPER.url}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px]`} />
                  </motion.div>
                  
                  <div className={`absolute top-0 left-12 w-[1px] h-full bg-white/10`} />
                  <div className={`absolute top-0 right-12 w-[1px] h-full bg-white/10`} />
                  <div className={`absolute top-24 left-0 w-full h-[1px] bg-white/10`} />
                  <div className={`absolute bottom-24 left-0 w-full h-[1px] bg-white/10`} />

                  {/* Clock Widget */}
                  <div className="absolute top-32 right-12 md:right-24 z-20">
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2, duration: 1 }}
                    >
                      <ClockWidget />
                    </motion.div>
                  </div>

                  {/* Latest at Bottom Left */}
                  <div className="absolute bottom-32 left-12 md:left-24 z-20">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1, duration: 1 }}
                    >
                      <button 
                        onClick={() => setState('new-releases')}
                        className="group text-left relative"
                      >
                        <h1 className={`text-6xl md:text-[8vw] font-black tracking-tighter leading-[0.8] italic uppercase mix-blend-difference text-white transition-colors duration-500 group-hover:text-amber-400 relative overflow-hidden`}>
                          LATEST
                          <span className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100 mix-blend-overlay" style={{ transformOrigin: 'center' }}></span>
                        </h1>
                      </button>
                    </motion.div>
                  </div>

                  {/* About at Bottom Right */}
                  <div className="absolute bottom-12 md:bottom-32 right-12 md:right-24 z-20 max-w-[200px] md:max-w-xs text-right hidden md:block">
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2, duration: 1 }}
                    >
                      <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 mb-4 font-light">About</p>
                      <p className="text-[10px] md:text-sm font-light leading-relaxed opacity-60">
                        Studio Graphics is a premium digital studio specializing in high-fidelity visual experiences and curated motion wallpapers.
                      </p>
                    </motion.div>
                  </div>

                  <motion.div 
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                  >
                    <div className="w-[1px] h-16 bg-gradient-to-b from-white/40 to-transparent" />
                  </motion.div>
                </section>

                {/* Collections Section with Delayed Scroll */}
            <section className="py-48 px-12">
              <div className="flex items-center gap-12 mb-32 max-w-7xl mx-auto">
                <h2 className="text-xs tracking-[1em] uppercase opacity-20 whitespace-nowrap">Collections</h2>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>
              
              <div className="grid grid-cols-1 gap-24 max-w-7xl mx-auto">
                {CATEGORIES.map((cat, idx) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 150 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <CategoryCard
                      category={cat.name}
                      image={cat.image}
                      onClick={() => handleCategoryClick(cat.name)}
                      isLocked={cat.name === 'Live Wallpaper' && !isPro}
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Glass Quote Section - 1 scroll area */}
            <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-white text-black">
              <div className="relative z-10 max-w-7xl px-12 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  <p className="text-[10px] tracking-[1em] uppercase opacity-40 font-light">Vision</p>
                  <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter italic uppercase">
                    "Passion turns ideas into reality <br className="hidden md:block" /> and imagination into form."
                  </h2>
                  <div className="flex items-center justify-center gap-8 pt-12">
                    <div className="w-24 h-[1px] bg-black/20" />
                    <p className="text-xs tracking-[0.3em] uppercase opacity-40">James Saikonde</p>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Horizontal Gallery */}
            <HorizontalGallery />

            {/* Art Book Ad */}
            <section className="py-32 px-12 bg-white text-black border-b border-black/5">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="aspect-[3/4] bg-black/5 rounded-[40px] overflow-hidden relative group"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      alt="Layers of Passion Book"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-12 left-12">
                      <button 
                        onClick={() => setState('new-releases')}
                        className="px-6 py-2 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-bold rounded-full hover:scale-110 transition-transform"
                      >
                        New Release
                      </button>
                    </div>
                  </motion.div>
                  
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <p className="text-[10px] tracking-[1em] uppercase opacity-40 font-light">Art Book</p>
                      <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">
                        Layers of <br /> Passion
                      </h2>
                    </div>
                    
                    <p className="text-xl font-light leading-relaxed opacity-60">
                      A visual journey through the intersection of digital art and raw emotion. Curated by the Studio.
                    </p>
                    
                    <div className="pt-8">
                      <a 
                        href="https://www.amazon.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-12 py-6 bg-black text-white rounded-full text-xs font-bold tracking-[0.5em] uppercase hover:scale-105 transition-transform"
                      >
                        Order on Amazon
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Mobile App Ad */}
            <section className="py-32 px-12 bg-zinc-50 text-black">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row-reverse items-center gap-24">
                  <div className="flex-1 space-y-12">
                    <div className="space-y-4">
                      <p className="text-[10px] tracking-[1em] uppercase opacity-40 font-light">Mobile Experience</p>
                      <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">
                        Big Cat <br /> Graphics
                      </h2>
                    </div>
                    <p className="text-xl font-light leading-relaxed opacity-60 max-w-xl">
                      Take the ultimate visual experience with you. Download our mobile app for exclusive mobile-only wallpapers and real-time notifications.
                    </p>
                    <div className="pt-8">
                      <a 
                        href="https://play.google.com/store" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-12 py-6 bg-black text-white rounded-full text-xs font-bold tracking-[0.5em] uppercase hover:scale-105 transition-transform"
                      >
                        Get it on Google Play
                      </a>
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <div className="aspect-[9/16] max-w-[300px] mx-auto bg-black rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-zinc-800 relative">
                      <img 
                        src="https://picsum.photos/seed/mobile-app/600/1200" 
                        alt="Mobile App" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <footer className={`relative py-24 px-12 border-t transition-colors duration-1000 bg-black border-white/5 text-white`}>
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex flex-col gap-4">
                  <h2 className={`text-2xl font-black tracking-tighter italic uppercase opacity-40 text-white`}>
                    STUDIO GRAPHICS
                  </h2>
                  <p className="text-[10px] tracking-[0.3em] uppercase opacity-30">
                    © 2026 All Rights Reserved
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                  <button 
                    onClick={() => setState('new-releases')}
                    className="text-[10px] tracking-[0.5em] uppercase opacity-40 hover:opacity-100 transition-opacity"
                  >
                    New Releases
                  </button>
                  <a href="#" className="text-[10px] tracking-[0.5em] uppercase opacity-40 hover:opacity-100 transition-opacity">Contact</a>
                  <a href="https://www.instagram.com/bigcatgraphics/" target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-[0.5em] uppercase opacity-40 hover:opacity-100 transition-opacity">Instagram</a>
                  <a href="https://x.com/_bigcatgraphics" target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-[0.5em] uppercase opacity-40 hover:opacity-100 transition-opacity">Twitter</a>
                </div>
              </div>
            </footer>
          </motion.main>
        )}

            {state === 'category' && (
              <motion.div
                key="category"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 pt-48 pb-32 bg-white min-h-screen"
              >
                <div className="fixed top-0 left-0 w-full h-32 bg-white/80 backdrop-blur-xl border-b border-black/5 flex items-center justify-center px-12 z-50">
                  <div className="flex flex-col items-center text-center">
                    <p className="text-[10px] tracking-[1em] uppercase opacity-30 mb-2">Collection</p>
                    <h2 className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase text-black leading-none">
                      {selectedCategory}
                    </h2>
                  </div>
                </div>

                <button 
                  onClick={() => setIsToolsOpen(true)}
                  className={`fixed bottom-12 right-12 z-50 flex items-center gap-4 px-8 py-4 rounded-full text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-all shadow-2xl ${isLightState ? 'bg-black text-white' : 'bg-white text-black'}`}
                >
                  <Sliders size={16} />
                  Customize
                </button>
                
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/5 -z-10" />
                
                <div className="text-black">
                  {filteredWallpapers.length > 0 ? (
                    <WallpaperGrid 
                      wallpapers={filteredWallpapers} 
                      isProUser={isPro}
                      showExplicit={showExplicit}
                      onUpgrade={() => setState('pricing')}
                      customization={customization}
                      onDownload={handleDownloadRecord}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center px-12">
                      <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-bold mb-4">Empty Collection</p>
                      <h3 className="text-4xl font-black italic uppercase text-black/20">No Wallpapers Found</h3>
                      <p className="text-sm opacity-60 mt-4 max-w-md">We couldn't find any wallpapers matching your current filters in this category.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {state === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 pt-48 pb-32 bg-black min-h-screen"
              >
                <div className="fixed top-0 left-0 w-full h-32 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-center px-12 z-50">
                  <div className="max-w-xl w-full relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search wallpapers, styles, tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-16 pr-8 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>
                </div>

                <div className="px-12 mb-12">
                  <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-bold">
                    {searchQuery ? `Results for "${searchQuery}"` : 'Discover everything'}
                  </p>
                </div>

                {searchedWallpapers.length > 0 ? (
                  <WallpaperGrid 
                    wallpapers={searchedWallpapers} 
                    isProUser={isPro}
                    showExplicit={showExplicit}
                    onUpgrade={() => setState('pricing')}
                    customization={customization}
                    onDownload={handleDownloadRecord}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-center px-12">
                    <Search className="w-12 h-12 text-white/20 mb-6" />
                    <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-bold mb-4">No Results</p>
                    <h3 className="text-4xl font-black italic uppercase text-white/20">Nothing Found</h3>
                    <p className="text-sm opacity-60 mt-4 max-w-md">Try adjusting your search terms or browse our categories instead.</p>
                  </div>
                )}
              </motion.div>
            )}

            {state === 'new-releases' && (
              <motion.div
                key="new-releases"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`relative z-10 pt-48 pb-32 min-h-screen bg-black text-white`}
              >
                <div className="max-w-5xl mx-auto px-12 space-y-24">
                  <div className="space-y-8">
                    <p className="text-[10px] tracking-[1em] uppercase opacity-40 font-light">New Release</p>
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">
                      Mountain <br /> Peak
                    </h2>
                  </div>

                  <div className="aspect-video rounded-[40px] overflow-hidden bg-zinc-900 shadow-2xl">
                    <img 
                      src={LATEST_WALLPAPER.url} 
                      className="w-full h-full object-cover"
                      alt="New Release"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                    <div className="space-y-12">
                      <div className="space-y-4">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">The Vision</h3>
                        <p className="text-lg font-light leading-relaxed opacity-60">
                          Captured at the break of dawn, Mountain Peak represents the raw power and serenity of nature. This piece explores the interplay between light and shadow on jagged rock faces.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Artist</h3>
                        <p className="text-lg font-light leading-relaxed opacity-60">
                          Studio Graphics Core Team
                        </p>
                      </div>
                    </div>

                    <div className="space-y-12">
                      <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-widest opacity-40">Type</p>
                          <p className="text-sm font-bold uppercase">4K Static Wallpaper</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-widest opacity-40">Software</p>
                          <p className="text-sm font-bold uppercase">Blender, Photoshop</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-widest opacity-40">Category</p>
                          <p className="text-sm font-bold uppercase">Nature</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-widest opacity-40">Released</p>
                          <p className="text-sm font-bold uppercase">March 2026</p>
                        </div>
                      </div>
                      <button 
                        onClick={async () => {
                          if (user?.isPro) {
                            try {
                              await downloadImage(LATEST_WALLPAPER.url, 'Mountain_Peak_4K.jpg');
                              toast.success('Download started', { description: 'Your high-resolution wallpaper is downloading.' });
                              handleDownloadRecord(LATEST_WALLPAPER, '4K');
                            } catch (e) {
                              toast.error('Download failed', { description: 'Could not download the wallpaper.' });
                            }
                          } else {
                            setState('pricing');
                          }
                        }}
                        className={`w-full py-6 rounded-full text-xs font-bold tracking-[0.3em] uppercase transition-all bg-white text-black hover:scale-105 shadow-xl`}
                      >
                        {user?.isPro ? 'Download in 4K' : 'Upgrade to Download 4K'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {state === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AccountManagement 
                  user={user} 
                  onLogout={handleLogout} 
                  onUpdateUser={handleUpdateUser} 
                  onBack={() => setState('main')}
                />
              </motion.div>
            )}

            {state === 'pricing' && (
              <motion.div
                key="pricing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Pricing 
                  onUpgrade={handleUpgrade} 
                  currentPlan={user?.isPro ? 'Pro' : 'Free'} 
                  onBack={() => setState('main')}
                />
              </motion.div>
            )}
      </AnimatePresence>

      <AnimatePresence>
        {isToolsOpen && (
          <CustomizationTools 
            isOpen={isToolsOpen} 
            onClose={() => setIsToolsOpen(false)}
            onUpdate={setCustomization}
            isPro={user?.isPro || false}
            isLight={isLightState}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <GlassMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onNavigate={(newState) => setState(newState)}
            isPro={isPro}
            user={user}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthOpen && (
          <Auth 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)} 
            onAuthSuccess={handleAuthSuccess} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
