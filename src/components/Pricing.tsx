import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, ArrowLeft } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for casual users',
    features: [
      '1080p Image Downloads',
      'Standard Categories',
      'Community Support',
    ],
    cta: 'Current Plan',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$5',
    yearlyPrice: '$4',
    description: 'For the ultimate visual experience',
    features: [
      '7-Day Free Trial',
      '4K Ultra HD Wallpapers',
      'Live Wallpapers Access',
      'Customization Tools (Blur, Gradients)',
      'No Ads',
    ],
    cta: 'Upgrade to Pro',
    highlight: true,
  }
];

interface PricingProps {
  onUpgrade: (isYearly: boolean) => void;
  currentPlan?: string;
  onBack?: () => void;
  isPro: boolean;
}

export const Pricing: React.FC<PricingProps> = ({ onUpgrade, currentPlan = 'Free', onBack }) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-32 px-12 bg-white text-black min-h-screen relative">
      {onBack && (
        <button 
          onClick={onBack}
          title="Back"
          aria-label="Back"
          className="absolute top-12 left-12 p-3 rounded-full border border-black/10 hover:bg-black/5 transition-all z-50"
        >
          <ArrowLeft size={18} />
        </button>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-6">
          <p className="text-[10px] tracking-[1em] uppercase opacity-40 font-light">Pricing</p>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase">Choose Your Vision</h2>
          
          <div className="flex items-center justify-center gap-4 pt-8">
            <span className={`text-xs uppercase tracking-widest ${!isYearly ? 'opacity-100' : 'opacity-30'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              title={isYearly ? "Switch to Monthly" : "Switch to Yearly"}
              aria-label={isYearly ? "Switch to Monthly" : "Switch to Yearly"}
              className="w-12 h-6 rounded-full bg-black/10 relative p-1 transition-colors"
            >
              <motion.div 
                animate={{ x: isYearly ? 24 : 0 }}
                className="w-4 h-4 rounded-full bg-black" 
              />
            </button>
            <span className={`text-xs uppercase tracking-widest ${isYearly ? 'opacity-100' : 'opacity-30'}`}>
              Yearly <span className="text-[10px] text-emerald-600 font-bold ml-2">Save 25%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -10 }}
              className={`p-12 rounded-3xl border ${plan.highlight ? 'bg-black text-white border-black' : 'bg-white text-black border-black/5'} flex flex-col`}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter italic uppercase mb-2">{plan.name}</h3>
                  <p className={`text-xs uppercase tracking-widest opacity-40`}>{plan.description}</p>
                </div>
                {plan.highlight && <Sparkles className="text-white" size={24} />}
              </div>

              <div className="mb-12">
                <span className="text-6xl font-black tracking-tighter">
                  {isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
                </span>
                <span className="text-xs uppercase tracking-widest opacity-40 ml-2">/ month</span>
              </div>

              <div className="space-y-4 mb-12 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-4">
                    <Check size={16} className={plan.highlight ? 'text-white' : 'text-black'} />
                    <span className="text-sm font-light opacity-80">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => plan.name === 'Pro' && onUpgrade(isYearly)}
                disabled={plan.name === currentPlan}
                className={`w-full py-6 rounded-full text-xs font-bold tracking-[0.3em] uppercase transition-all ${plan.highlight ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {plan.name === currentPlan ? 'Current Plan' : plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
