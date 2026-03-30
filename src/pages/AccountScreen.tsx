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

