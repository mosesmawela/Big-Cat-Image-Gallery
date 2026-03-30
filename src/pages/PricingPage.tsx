import React from 'react';
import { motion } from 'motion/react';
import { Pricing } from '../components/Pricing';

interface PricingPageProps {
  onUpgrade: (isYearly: boolean) => void;
  isPro: boolean;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onUpgrade, isPro }) => {
  return (
    <motion.div
      key="pricing"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative z-10 pt-32 pb-32 min-h-screen flex items-center justify-center bg-black/80 backdrop-blur-xl"
    >
      <div className="max-w-4xl w-full px-12">
        <Pricing onUpgrade={onUpgrade} isPro={isPro} />
      </div>
    </motion.div>
  );
};
