import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MenuIcon, User, Heart, Shield, Upload, Info, LogOut } from 'lucide-react';

export const AboutScreen = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black text-white"
    >
      <div className="max-w-4xl mx-auto px-8 py-24">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-black tracking-tighter italic uppercase text-brand-peach">
              About Sunset Noir
            </h1>
            <p className="text-[12px] tracking-[0.5em] uppercase opacity-60 max-w-xl mx-auto">
              A premium digital studio specializing in curated 
              visual experiences and high-fidelity art.
            </p>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tighter italic uppercase">
              Our Vision
            </h2>
            <p className="text-[10px] leading-relaxed opacity-80 max-w-3xl">
              Sunset Noir is dedicated to the art of high-end digital environments. 
              We curate exclusive collections that transform digital spaces into 
              immersive landscapes. Through professional craftsmanship and a focus 
              on visual excellence, we provide the tools to personalize your world 
              with premium clarity and intent.
            </p>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tighter italic uppercase">
              Studio Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 space-y-6 text-center group hover:border-brand-peach/30 transition-all">
                <MenuIcon size={32} className="mx-auto mb-4 text-brand-peach" />
                <h3 className="text-xl font-black tracking-tighter italic uppercase">
                  Studio Collections
                </h3>
                <p className="text-[9px] opacity-60">
                  Explore our ever-expanding gallery of high-resolution 
                  visuals, designed for professional excellence.
                </p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 space-y-6 text-center group hover:border-brand-peach/30 transition-all">
                <Upload size={32} className="mx-auto mb-4 text-brand-peach" />
                <h3 className="text-xl font-black tracking-tighter italic uppercase">
                  Artist Submission
                </h3>
                <p className="text-[9px] opacity-60">
                  Share your high-end creations with our community and 
                  potentially feature them in our curated collections.
                </p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 space-y-6 text-center group hover:border-brand-peach/30 transition-all">
                <Heart size={32} className="mx-auto mb-4 text-brand-peach" />
                <h3 className="text-xl font-black tracking-tighter italic uppercase">
                  Studio Community
                </h3>
                <p className="text-[9px] opacity-60">
                  Join a community of collectors who appreciate the 
                  transformative impact of high-fidelity visual art.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tighter italic uppercase">
              The Architecture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-black tracking-tighter italic uppercase">
                  Visual Interface
                </h3>
                <p className="text-[9px] opacity-60">
                  Built with React, TypeScript, and Frame-Exact motion systems for fluid, 
                  responsive interactions that feel high-end and intentional.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-black tracking-tighter italic uppercase">
                  Data Systems
                </h3>
                <p className="text-[9px] opacity-60">
                  Powered by Firebase for secure access, real-time 
                   updates, and global, high-speed asset delivery.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-8">
            <p className="text-[10px] tracking-[0.5em] uppercase opacity-60 text-brand-peach">
              Ready to elevate your space?
            </p>
            <button 
              onClick={() => navigate('/pro')}
              className="px-8 py-4 bg-brand-peach text-brand-burgundy rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl shadow-brand-peach/10"
            >
              Experience Studio Pro
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};