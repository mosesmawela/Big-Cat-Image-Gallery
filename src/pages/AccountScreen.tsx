import React from 'react';
import { useAuthContext } from '../providers/AuthProvider';
import { AccountManagement } from '../components/AccountManagement';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export const AccountScreen = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  if (!user) {
    // Redirect or show Login (Will be handled by AuthModal later)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center space-y-8">
        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center opacity-20">
          <UserIcon size={32} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tighter italic uppercase italic">Neural Link Required</h2>
          <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 max-w-sm mx-auto">
            Please authenticate your session to access your personal archives.
          </p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="px-12 py-5 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest italic"
        >
          Return to Discovery
        </button>
      </div>
    );
  }

  const handleUpdateUser = async (updates: Partial<User>) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      // UI will auto-update via snapshot listener in AuthProvider
    } catch (error: any) {
      toast.error('Sync Failed', { description: 'Could not synchronize identity parameters.' });
    }
  };

  return (
    <div className="min-h-screen">
      <AccountManagement 
        user={user} 
        onLogout={async () => {
          await logout();
          navigate('/');
        }}
        onUpdateUser={handleUpdateUser}
        onBack={() => navigate(-1)}
      />
    </div>
  );
};

