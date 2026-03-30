import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GlobalLayout } from './layouts/GlobalLayout';
import { HomeScreen } from './pages/HomeScreen';
import { CategoryScreen } from './pages/CategoryScreen';
import { SearchScreen } from './pages/SearchScreen';
import { ProScreen } from './pages/ProScreen';
import { AccountScreen } from './pages/AccountScreen';
import { AboutScreen } from './pages/AboutScreen';
import { AuthProvider, useAuthContext } from './providers/AuthProvider';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { WelcomeScreen } from './components/WelcomeScreen';

/**
 * AppContent handles the conditional rendering of the WelcomeScreen
 * and the main application routes.
 */
const AppContent = () => {
  const { showWelcome, setShowWelcome } = useAuthContext();

  return (
    <AnimatePresence mode="wait">
      {showWelcome ? (
        <WelcomeScreen key="welcome" onEnter={() => setShowWelcome(false)} />
      ) : (
        <GlobalLayout key="main">
           <Routes>
             {/* Core Discovery Routes */}
             <Route path="/" element={<HomeScreen />} />
             <Route path="/new-releases" element={<HomeScreen />} />
             
             {/* Dynamic Content Routes */}
             <Route path="/category/:id" element={<CategoryScreen />} />
             <Route path="/search" element={<SearchScreen />} />
             
             {/* User & Billing Routes */}
             <Route path="/pro" element={<ProScreen />} />
             <Route path="/account" element={<AccountScreen />} />
             <Route path="/about" element={<AboutScreen />} />
             
             {/* Fallback */}
             <Route path="*" element={<Navigate to="/" replace />} />
           </Routes>
        </GlobalLayout>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppContent />
          
          {/* Notification System */}
          <Toaster 
            position="top-center" 
            expand={false}
            richColors 
            theme="dark"
            toastOptions={{
              className: 'bg-black/90 border border-white/10 backdrop-blur-xl text-white font-bold tracking-widest uppercase text-[10px]',
            }}
          />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
