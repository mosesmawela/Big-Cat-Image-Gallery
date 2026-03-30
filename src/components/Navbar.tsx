import React from 'react';
import { ArrowLeft, User, Menu as MenuIcon } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  state: string;
  setState: (state: any) => void;
  user: UserType | null;
  isPro: boolean;
  setIsAuthOpen: (open: boolean) => void;
  setIsMenuOpen: (open: boolean) => void;
  isLightState: boolean;
}

const LOGO_URL = "https://ik.imagekit.io/BigCat/Logo%20Assets/BCG%20Logo%20Black.svg?updatedAt=1774706599542";

export const Navbar: React.FC<NavbarProps> = ({
  state,
  setState,
  user,
  isPro,
  setIsAuthOpen,
  setIsMenuOpen,
  isLightState
}) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-[9999] px-12 py-8 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-8 pointer-events-auto">
        <button 
          onClick={() => setState('main')}
          className="hover:scale-105 transition-transform flex items-center gap-4"
          title="Go to Home"
        >
          <img 
            src={LOGO_URL} 
            alt="Big Cat Graphics Logo" 
            className="h-14 w-auto brightness-200" 
          />
          <div className="flex flex-col">
            <span className="text-sm font-black italic tracking-tighter text-white">BIG CAT</span>
            <span className="text-[8px] tracking-[0.3em] uppercase opacity-40 font-bold text-white">GRAPHICS GALLERY</span>
          </div>
        </button>

        {state !== 'main' && (
          <button 
            onClick={() => setState('main')}
            className="p-2 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-12 pointer-events-auto">
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setState('search')}
            className="text-[10px] tracking-[0.3em] uppercase font-bold text-white/40 hover:text-white transition-colors"
            title="Search Wallpapers"
          >
            Search
          </button>
          <button 
            onClick={() => setState('pricing')}
            className="text-[10px] tracking-[0.3em] uppercase font-bold text-white/40 hover:text-white transition-colors"
            title="View Collections"
          >
            Collections
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setState('pricing')}
            className={`px-6 py-2 rounded-full border text-[10px] tracking-[0.3em] uppercase font-bold transition-all ${isPro ? 'bg-brand-peach border-brand-peach text-deep-navy' : 'border-white/10 text-white hover:bg-white/5'}`}
            title={isPro ? "Pro Active" : "Upgrade to Pro"}
          >
            {isPro ? 'Pro Member' : 'Go Pro'}
          </button>

          {user ? (
            <button 
              onClick={() => setState('account')}
              className="w-10 h-10 rounded-full border border-white/10 overflow-hidden"
              title="Open Account Menu"
            >
              <img src={user.photoURL || ''} alt="User" className="w-full h-full object-cover" />
            </button>
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="p-3 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors"
              title="Log In"
            >
              <User size={18} />
            </button>
          )}

          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-3 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors"
            title="Open Menu"
          >
            <MenuIcon size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};
