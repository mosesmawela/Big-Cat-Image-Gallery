import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { ChevronDown, Mail, CheckCircle2, Send, MousePointer2, Sparkles } from 'lucide-react';
import { ScrollSequence } from './ScrollSequence';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuthContext } from '../providers/AuthProvider';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

gsap.registerPlugin(ScrollTrigger);

const STORY_IMAGES = [
  "https://ik.imagekit.io/BigCat/IMAGES/Flower%20Head2%20copy.jpg?updatedAt=1774707101891",
  "https://ik.imagekit.io/BigCat/IMAGES/Book%20Cover%20(2).png?updatedAt=1774707955630",
  "https://ik.imagekit.io/BigCat/IMAGES/Royal.jpg?updatedAt=1774707348235",
  "https://ik.imagekit.io/BigCat/IMAGES/Panther%20Wallpaper1.jpg?updatedAt=1774707122410"
];

const LOGO_URL = "https://ik.imagekit.io/BigCat/Logo%20Assets/BCG%20Logo%20Black.svg?updatedAt=1774706599542";

const StorySection = ({ 
  title, 
  subtitle, 
  image,
  className = "" 
}: { 
  title: string; 
  subtitle: string; 
  image: string;
  className?: string; 
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!textRef.current || !sectionRef.current || !imageRef.current) return;
    
    const words = textRef.current.querySelectorAll('.story-word');
    
    gsap.fromTo(words, 
      { opacity: 0, y: 60, filter: "blur(12px)" },
      {
        opacity: 1, 
        y: 0,
        filter: "blur(0px)",
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 25%",
          scrub: 1
        }
      }
    );

    gsap.to(imageRef.current, {
      y: -80,
      scale: 1.05,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

  }, []);

  return (
    <section ref={sectionRef} className={`min-h-screen flex items-center justify-center py-60 px-12 md:px-24 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-32 items-center max-w-screen-2xl w-full">
        {/* Left: Text Content */}
        <div ref={textRef} className="space-y-16">
          <h2 className="text-[6rem] md:text-[11rem] font-black uppercase tracking-tighter leading-[0.7] font-outfit text-white">
            {title.split(' ').map((word, i) => (
              <span key={i} className="story-word inline-block mr-6 py-2">{word}</span>
            ))}
          </h2>
          <div className="max-w-xl">
             <p className="text-xl md:text-4xl font-bold uppercase tracking-[0.3em] opacity-40 leading-relaxed font-inter italic border-l-8 border-brand-peach pl-10 text-white">
               {subtitle}
             </p>
          </div>
        </div>

        {/* Right: Slideshow Fragment */}
        <div ref={imageRef} className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-[0_80px_160px_rgba(0,0,0,0.8)] border border-white/5 group bg-zinc-900">
           <img 
             src={image} 
             alt="Visual Shift" 
             className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
             loading="lazy"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
           <div className="absolute bottom-16 left-16 flex items-center gap-6">
              <div className="w-16 h-px bg-brand-peach" />
              <p className="text-[10px] uppercase font-black tracking-[1em] opacity-40 text-white">Module.Seq_0{Math.floor(Math.random()*9)}</p>
           </div>
        </div>
      </div>
    </section>
  );
};

export const WelcomeScreen: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const { user } = useAuthContext();
  const { scrollYProgress } = useScroll();
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [vibe, setVibe] = useState('');
  const [source, setSource] = useState('');
  const [email, setEmail] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const nextStep = () => {
    if (onboardingStep < 3) {
      setOnboardingStep(prev => prev + 1);
    } else {
      handleFinalize();
    }
  };

  const handleFinalize = async () => {
    if (user) {
      setIsSyncing(true);
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          onboarding: { vibe, source, email: email || user.email },
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.error('Failed to save onboarding data:', e);
      } finally {
        setIsSyncing(false);
        onEnter();
      }
    } else {
      onEnter();
    }
  };

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      if (v > 0.98 && !showOnboarding) {
        setShowOnboarding(true);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, showOnboarding]);

  return (
    <div className="relative bg-[#050505] text-white selection:bg-brand-peach/30">
        {/* Cinematic Background Layer */}
        <ScrollSequence frameCount={157} progress={scrollYProgress} className="opacity-40" />

        {/* Studio Grain Texture */}
        <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.02] mix-blend-overlay">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="studioNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#studioNoise)" />
          </svg>
        </div>

        {/* Narrative Flow */}
        <div className="relative z-10">
            {/* Entry Portal */}
            <section className="h-screen flex flex-col justify-center px-12 md:px-24">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                  className="mb-12 flex items-center gap-6"
                >
                   <img src={LOGO_URL} className="h-8 invert brightness-100" alt="BCG" />
                   <div className="h-6 w-px bg-white/20" />
                   <span className="text-[10px] tracking-[0.5em] uppercase font-black opacity-20 italic font-space">Production Unit 2026</span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[12rem] md:text-[22rem] font-black italic uppercase leading-[0.55] tracking-tighter mix-blend-screen font-outfit"
                >
                  BIG <br /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-800">CAT</span>
                </motion.h1>

                <div className="flex items-center gap-12 mt-24">
                   <div className="w-24 h-1 bg-brand-peach" />
                   <p className="text-[10px] uppercase tracking-[1.5em] font-black opacity-20 whitespace-nowrap animate-pulse">Neural Thread Active</p>
                </div>
            </section>

            {/* Story Sequence */}
            <StorySection 
              title="Digital Mastery" 
              subtitle="Where high-fidelity pixels meet artistic soul. We redefine the desktop environment."
              image={STORY_IMAGES[0]}
            />
            
            <StorySection 
              title="The Archive" 
              subtitle="Access an ever-evolving library of elite textures, scenes, and visual narratives."
              image={STORY_IMAGES[1]}
              className="bg-black/30 backdrop-blur-3xl"
            />

            <StorySection 
              title="Elite Curation" 
              subtitle="Optimized for ultrawide rigs and 4K displays. No compromises. No static."
              image={STORY_IMAGES[2]}
            />

            <StorySection 
              title="Final Descent" 
              subtitle="The rift is opening. Prepare for total visual sensory immersion."
              image={STORY_IMAGES[3]}
              className="bg-black/60 backdrop-blur-3xl"
            />

            {/* Gap for Onboarding Reveal */}
            <div className="h-[20vh]" />
        </div>

        {/* High-End Onboarding Overlay */}
        <AnimatePresence>
          {showOnboarding && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="fixed inset-0 z-[1000] flex items-center justify-center p-12 bg-black/90 backdrop-blur-3xl"
            >
               <div className="max-w-4xl w-full">
                  {onboardingStep === 0 && (
                    <motion.div key="s1" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                       <div className="space-y-4">
                         <p className="text-[10px] uppercase font-black tracking-widest text-brand-peach">Phase 01</p>
                         <h2 className="text-7xl font-black italic uppercase tracking-tighter text-white">Your Visual Frequency?</h2>
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                         {['CYBERPUNK', 'MINIMALIST', 'NATURE', 'ABSTRACT'].map((v) => (
                           <button 
                             key={v} 
                             onClick={() => { setVibe(v); nextStep(); }}
                             className="group relative h-32 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all rounded-2xl flex items-center justify-center overflow-hidden"
                           >
                             <div className="absolute inset-0 bg-gradient-to-br from-brand-peach/0 to-brand-peach/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                             <span className="text-sm font-black uppercase tracking-[0.5em] italic text-white">{v}</span>
                           </button>
                         ))}
                       </div>
                    </motion.div>
                  )}

                  {onboardingStep === 1 && (
                    <motion.div key="s2" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 text-center">
                       <Sparkles className="mx-auto text-brand-peach" size={48} />
                       <h2 className="text-7xl font-black italic uppercase tracking-tighter text-white">How did you find us?</h2>
                       <div className="flex flex-wrap justify-center gap-6">
                         {['Instagram', 'Dribbble', 'Twitter', 'Referral'].map((s) => (
                           <button 
                             key={s} 
                             onClick={() => { setSource(s); nextStep(); }}
                             className="px-12 py-6 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all font-black uppercase text-[10px] tracking-widest italic text-white"
                           >
                             {s}
                           </button>
                         ))}
                       </div>
                    </motion.div>
                  )}

                  {onboardingStep === 2 && (
                    <motion.div key="s3" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                       <h2 className="text-7xl font-black italic uppercase tracking-tighter text-center text-white">Neural Updates</h2>
                       <div className="relative max-w-2xl mx-auto group">
                          <input 
                            type="email" 
                            placeholder="YOUR_EMAIL@ARCHIVE.COM" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-white/20 py-8 text-3xl font-black uppercase tracking-tighter focus:border-brand-peach outline-none transition-colors italic text-white"
                          />
                          <button 
                            onClick={nextStep}
                            aria-label="Send"
                            className="absolute right-0 bottom-8 p-4 bg-white text-black rounded-full hover:scale-110 transition-transform"
                          >
                             <Send size={24} />
                          </button>
                       </div>
                    </motion.div>
                  )}

                  {onboardingStep === 3 && (
                    <motion.div key="s4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-12">
                       <div className="w-32 h-32 bg-brand-peach rounded-full flex items-center justify-center mx-auto shadow-[0_0_100px_rgba(255,209,185,0.4)]">
                          <CheckCircle2 size={64} className="text-black" />
                       </div>
                       <div className="space-y-4">
                         <h2 className="text-8xl font-black italic uppercase tracking-tighter text-white">Welcome to Rift</h2>
                         <p className="text-sm uppercase tracking-[1em] opacity-40 text-white">Profile synchronization complete</p>
                       </div>
                       <button 
                         onClick={() => {
                           window.scrollTo(0, 0);
                           handleFinalize();
                         }}
                         disabled={isSyncing}
                         className="px-24 py-8 bg-white text-black rounded-full font-black uppercase text-xs tracking-[0.5em] italic hover:scale-105 transition-transform disabled:opacity-50"
                       >
                         {isSyncing ? 'Synchronizing...' : 'Enter The Studio'}
                       </button>
                    </motion.div>
                  )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
};
