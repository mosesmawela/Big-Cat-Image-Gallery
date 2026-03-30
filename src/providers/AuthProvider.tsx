import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isPro: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: Error | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);

  // Auto-hide welcome if already visited in this session
  useEffect(() => {
    const visited = sessionStorage.getItem('bcg_visited');
    if (visited) {
      setShowWelcome(false);
    }
  }, []);

  const handleSetShowWelcome = (show: boolean) => {
    setShowWelcome(show);
    if (!show) {
      sessionStorage.setItem('bcg_visited', 'true');
    }
  };

  return (
    <AuthContext.Provider value={{ ...auth, showWelcome, setShowWelcome: handleSetShowWelcome }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
