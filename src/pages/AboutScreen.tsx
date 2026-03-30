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
            <h1 className="text-5xl font-black tracking-tighter italic uppercase">
              About Neural Link
            </h1>
            <p className="text-[12px] tracking-[0.5em] uppercase opacity-60 max-w-xl mx-auto">
              Exploring the frontiers of digital consciousness through curated 
              visual experiences that push the boundaries of perception.
            </p>
          </div>
          
          {/* Mission */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tighter italic uppercase">
              Our Mission
            </h2>
            <p className="text-[10px] leading-relaxed opacity-80 max-w-3xl">
              At Neural Link, we believe that imagery has the power to reshape 
              consciousness. Our platform curates transcendent visual experiences 
              that challenge perception and expand awareness. Through cutting-edge 
              technology and artistic vision, we create portals to new dimensions 
              of understanding.
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tighter italic uppercase">
              Platform Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 space-y-6 text-center">
                <MenuIcon size={32} className="mx-auto mb-4 text-blue-400" />
                <h3 className="text-xl font-black tracking-tighter italic uppercase">
                  Neural Discovery
                </h3>
                <p className="text-[9px] opacity-60">
                  Explore our ever-expanding gallery of consciousness-expanding 
                  visuals, curated for the discerning explorer.
                </p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 space-y-6 text-center">
                <Upload size={32} className="mx-auto mb-4 text-blue-400" />
                <h3 className="text-xl font-black tracking-tighter italic uppercase">
                  Creative Contribution
                </h3>
                <p className="text-[9px] opacity-60">
                  Share your own visionary creations with the community and 
                  potentially feature them in our premium collections.
                </p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 space-y-6 text-center">
                <Heart size={32} className="mx-auto mb-4 text-blue-400" />
                <h3 className="text-xl font-black tracking-tighter italic uppercase">
                  Community Connection
                </h3>
                <p className="text-[9px] opacity-60">
                  Join a community of like-minded seekers who appreciate the 
                  transformative power of visual art and digital expression.
                </p>
              </div>
            </div>
          </div>
          
          {/* Technology */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tighter italic uppercase">
              Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-black tracking-tighter italic uppercase">
                  Frontend Experience
                </h3>
                <p className="text-[9px] opacity-60">
                  Built with React, TypeScript, and Framer Motion for fluid, 
                  responsive interactions that feel alive and responsive.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-black tracking-tighter italic uppercase">
                  Backend Infrastructure
                </h3>
                <p className="text-[9px] opacity-60">
                  Powered by Firebase for secure authentication, real-time 
                  database functionality, and scalable cloud storage.
                </p>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="text-center space-y-8">
            <p className="text-[10px] tracking-[0.5em] uppercase opacity-60">
              Ready to expand your consciousness?
            </p>
            <button 
              onClick={() => navigate('/pro')}
              className="px-8 py-4 bg-white text-black rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-white/90 transition-all"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};