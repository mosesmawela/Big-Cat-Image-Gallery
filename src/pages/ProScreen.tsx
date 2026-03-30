import React, { useState } from 'react';
import { useAuthContext } from '../providers/AuthProvider';
import { Pricing } from '../components/Pricing';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export const ProScreen = () => {
  const { user, isPro, login } = useAuthContext();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async (isYearly: boolean) => {
    if (!user) {
      toast.info('Identity Required', { description: 'Please establish a neural link to upgrade.' });
      login();
      return;
    }

    setIsUpgrading(true);
    toast.loading('Initializing Stripe Session...', { id: 'upgrade-toast' });

    // Simulate Stripe Checkout delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        isPro: true,
        subscriptionType: isYearly ? 'yearly' : 'monthly',
        updatedAt: new Date().toISOString()
      });

      toast.success('Neural Link Elevated', { 
        id: 'upgrade-toast',
        description: `Pro Access ${isYearly ? 'Annual' : 'Monthly'} session established.` 
      });

      // Redirect to account to show new status
      navigate('/account');
    } catch (error: any) {
      toast.error('Synthesis Failed', { 
        id: 'upgrade-toast',
        description: 'Could not elevate account status.' 
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Pricing 
        onUpgrade={handleUpgrade}
        currentPlan={isPro ? 'Pro' : 'Free'}
        isPro={isPro}
        onBack={() => navigate(-1)}
      />

      {isUpgrading && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-white/10 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-[10px] uppercase tracking-[1em] font-black italic animate-pulse text-amber-500">Elevating Clearance</p>
          </div>
        </div>
      )}
    </div>
  );
};
