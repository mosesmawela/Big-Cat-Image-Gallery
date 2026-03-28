import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight, Chrome } from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { toast } from 'sonner';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onAuthSuccess(result.user);
      toast.success('Successfully signed in with Google');
      onClose();
    } catch (err: any) {
      setError(err.message);
      toast.error('Google sign in failed', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(result.user);
        toast.success('Successfully signed in');
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(result.user, { displayName: name });
        }
        onAuthSuccess(result.user);
        toast.success('Account created successfully');
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
      toast.error('Authentication failed', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-white text-black rounded-3xl overflow-hidden relative p-12"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-12 space-y-4">
              <p className="text-[10px] tracking-[1em] uppercase opacity-40 font-light">Account</p>
              <h2 className="text-4xl font-black tracking-tighter italic uppercase">
                {isLogin ? 'Welcome Back' : 'Join the Studio'}
              </h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-[10px] uppercase tracking-widest font-bold rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="bg-black/5 text-black py-4 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-black/10 transition-all flex items-center justify-center gap-4 border border-black/5"
              >
                <Chrome size={16} />
                Google
              </button>
              <button 
                disabled={loading}
                className="bg-black/5 text-black py-4 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-black/10 transition-all flex items-center justify-center gap-4 border border-black/5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05 1.61-3.22 1.61-1.14 0-1.53-.67-2.82-.67-1.28 0-1.76.65-2.82.67-1.15.02-2.36-.73-3.39-1.73-2.11-2.03-3.22-5.78-3.22-8.53 0-4.33 2.68-6.63 5.23-6.63 1.32 0 2.41.81 3.22.81.79 0 2.1-.92 3.64-.92 1.54 0 2.87.73 3.64 1.83-3.15 1.83-2.64 6.27.53 7.55-1.1 2.64-2.58 4.96-3.99 6.01zm-3.92-15.17c-.02-2.11 1.73-3.83 3.83-3.85.02 2.11-1.73 3.83-3.83 3.85z"/>
                </svg>
                Apple
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-white px-4 opacity-40">Or use email</span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-40 ml-4">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/5 rounded-full py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40 ml-4">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/5 rounded-full py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40 ml-4">Password</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/5 rounded-full py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-black text-white py-5 rounded-full text-xs font-bold tracking-[0.3em] uppercase hover:bg-black/90 transition-all flex items-center justify-center gap-4 mt-8 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-12 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity font-bold underline underline-offset-4"
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
