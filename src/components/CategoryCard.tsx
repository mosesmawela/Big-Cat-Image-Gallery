import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  image: string;
  onClick: () => void;
  isLocked?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, image, onClick, isLocked }) => {
  return (
    <motion.div
      whileHover={isLocked ? {} : { scale: 1.01 }}
      whileTap={isLocked ? {} : { scale: 0.99 }}
      onClick={isLocked ? undefined : onClick}
      className={`relative h-[450px] w-full overflow-hidden cursor-pointer group border-b border-white/10 ${isLocked ? 'cursor-not-allowed' : ''}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="relative overflow-hidden order-2 md:order-1">
          <motion.img
            src={image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
            alt={category}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${isLocked ? 'opacity-20 grayscale' : 'group-hover:scale-110 opacity-40 group-hover:opacity-60'}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full">
                <span className="text-xl font-black tracking-[0.5em] uppercase italic text-white">PRO</span>
              </div>
            </div>
          )}
        </div>
        
        <div className={`flex flex-col items-start justify-center p-12 md:p-24 order-1 md:order-2 bg-black/20 backdrop-blur-sm ${isLocked ? 'opacity-40' : ''}`}>
          <p className="text-[10px] tracking-[1em] uppercase opacity-40 mb-6 font-light">Collection</p>
          <h3 className="text-4xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.8] group-hover:translate-x-4 transition-transform duration-700">
            {category}
          </h3>
          <div className="mt-12 flex items-center gap-6 group-hover:gap-10 transition-all duration-500">
            <div className="w-12 h-[1px] bg-white/20" />
            <span className="text-[10px] tracking-[0.5em] uppercase font-light text-white/60">
              {isLocked ? 'Locked' : 'Explore'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
