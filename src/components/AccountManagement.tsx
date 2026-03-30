import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Settings, Shield, CreditCard, LogOut, Camera, Bell, Eye, Plus, Trash2, LayoutGrid, ArrowLeft, Heart, History, Activity, MonitorPlay } from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType, toggleFavorite } from '../lib/firebase';
import { toast } from 'sonner';

import { User as UserType, Wallpaper, Category } from '../types';

interface AccountManagementProps {
  user: UserType | null;
  onLogout: () => void;
  onUpdateUser: (updates: Partial<UserType>) => void;
  onBack?: () => void;
  wallpapers?: Wallpaper[];
  onDownload?: (wp: Wallpaper, resolution: string) => void;
  onNavigate?: (state: string) => void;
}

export const AccountManagement: React.FC<AccountManagementProps> = ({ user, onLogout, onUpdateUser, onBack, wallpapers, onDownload, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [bio, setBio] = useState(user?.bio || '');

  // Admin states
  const [adminWallpapers, setAdminWallpapers] = useState<Wallpaper[]>([]);
  const [newWallpaper, setNewWallpaper] = useState<Partial<Wallpaper>>({
    title: '',
    url: '',
    category: 'Nature',
    isPro: false,
    isLive: false,
    resolution: '4K'
  });
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wallpaperToDelete, setWallpaperToDelete] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const favoriteWallpapers = wallpapers?.filter(wp => user?.favorites?.includes(wp.id)) || [];

  const handleUpdatePassword = async () => {
    if (!newPassword) return;
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        toast.success('Neural Cipher Updated', { description: 'Your security key has been rotated.' });
        setNewPassword('');
      }
    } catch (error: any) {
      toast.error('Sync Failed', { description: error.message });
    }
  };

  const TABS = [
    { id: 'profile', label: 'Identity', icon: User },
    { id: 'favorites', label: 'Archives', icon: Heart },
    { id: 'history', label: 'Deployments', icon: LayoutGrid },
    { id: 'billing', label: 'Subscription', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Interface', icon: Settings },
  ];

  if (user?.role === 'admin') {
    TABS.push({ id: 'admin', label: 'Control', icon: LayoutGrid });
  }

  useEffect(() => {
    if (activeTab === 'admin' && user?.role === 'admin') {
      fetchWallpapers();
    }
  }, [activeTab, user]);

  const fetchWallpapers = async () => {
    setIsAdminLoading(true);
    try {
      const q = query(collection(db, 'wallpapers'), orderBy('title'));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Wallpaper));
      setAdminWallpapers(docs);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.LIST, 'wallpapers');
      } catch (e: any) {
        setError(e);
      }
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleAddWallpaper = async () => {
    if (!newWallpaper.title || !newWallpaper.url) return;
    setIsAdminLoading(true);
    try {
      await addDoc(collection(db, 'wallpapers'), {
        ...newWallpaper,
        createdAt: new Date().toISOString()
      });
      setNewWallpaper({
        title: '',
        url: '',
        category: 'Nature',
        isPro: false,
        isLive: false,
        resolution: '4K'
      });
      fetchWallpapers();
      toast.success('Archive Updated', { description: 'New visual data synthesized.' });
    } catch (error: any) {
      try {
        handleFirestoreError(error, OperationType.CREATE, 'wallpapers');
      } catch (e: any) {
        setError(e);
      }
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleDeleteWallpaper = async (id: string) => {
    setWallpaperToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteWallpaper = async () => {
    if (!wallpaperToDelete) return;
    setIsAdminLoading(true);
    try {
      await deleteDoc(doc(db, 'wallpapers', wallpaperToDelete));
      fetchWallpapers();
      toast.success('Archive Purged', { description: 'Visual data removed from rift.' });
    } catch (error: any) {
      try {
        handleFirestoreError(error, OperationType.DELETE, `wallpapers/${wallpaperToDelete}`);
      } catch (e: any) {
        setError(e);
      }
    } finally {
      setIsAdminLoading(false);
      setShowDeleteModal(false);
      setWallpaperToDelete(null);
    }
  };

  if (!user) return null;

  if (error) {
    throw error;
  }

  return (
    <section className="py-48 px-6 md:px-12 bg-transparent text-white min-h-screen relative">
      {onBack && (
        <button 
          onClick={onBack}
          title="Back"
          aria-label="Back"
          className="absolute top-12 left-6 md:left-12 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all z-50 text-white"
        >
          <ArrowLeft size={18} />
        </button>
      )}
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 lg:gap-24">
        {/* Sidebar */}
        <div className="space-y-12">
          <div className="flex items-center gap-6 mb-16 p-6 bg-white/5 border border-white/5 rounded-[32px] backdrop-blur-3xl">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-white/5 overflow-hidden border border-white/10">
                <img 
                  src={user.photoURL || photoURL || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80"} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Profile"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button 
                onClick={() => {
                  const url = prompt('Enter new profile photo URL:', photoURL);
                  if (url !== null) setPhotoURL(url);
                }}
                title="Update Identity Image"
                aria-label="Update Identity Image"
                className="absolute bottom-0 right-0 p-2 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
              >
                <Camera size={12} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter italic uppercase leading-none mb-2">{user.displayName || 'Anonymous User'}</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{user.isPro ? 'Pro Elite Member' : 'Free Archive Access'}</p>
            </div>
          </div>

          <nav className="space-y-3">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-6 p-5 rounded-[24px] border transition-all ${activeTab === tab.id ? 'bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.2)]' : 'bg-white/5 border-white/5 hover:border-white/20 opacity-40 hover:opacity-100 hover:bg-white/10'}`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-black' : 'text-white'} />
                <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">{tab.label}</span>
              </button>
            ))}
            <div className="h-px bg-white/5 my-6" />
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-6 p-5 rounded-[24px] text-rose-500 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/20 transition-all group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">Terminate Session</span>
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white/[0.03] border border-white/5 rounded-[48px] p-8 md:p-16 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-16"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="space-y-2">
                  <h3 className="text-4xl font-black tracking-tighter italic uppercase">Identity Parameters</h3>
                  <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-bold">Synchronize your persona with the rift</p>
                </div>
                <button 
                  onClick={async () => {
                    try {
                      if (auth.currentUser) {
                        await updateProfile(auth.currentUser, {
                          displayName: displayName,
                          photoURL: photoURL
                        });
                        if (email !== auth.currentUser.email) {
                          await updateEmail(auth.currentUser, email);
                        }
                      }
                      onUpdateUser({ displayName, email, photoURL, bio });
                      toast.success('Identity Updated', { description: 'Profile parameters have been synchronized.' });
                    } catch (error: any) {
                      toast.error('Update Failed', { description: error.message });
                    }
                  }}
                  className="px-12 py-5 bg-white text-black rounded-full text-[10px] uppercase tracking-[0.3em] font-black italic hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                >
                  Save Identity
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4 group">
                  <label className="text-[10px] uppercase tracking-[0.5em] opacity-40 ml-4 font-black">Public Name</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="ENTER NAME"
                    className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-8 text-sm focus:border-white/40 focus:bg-white/10 outline-none transition-all font-bold italic"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.5em] opacity-40 ml-4 font-black">Email Link</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="EMAIL@RIFT.COM"
                    className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-8 text-sm focus:border-white/40 focus:bg-white/10 outline-none transition-all font-bold italic"
                  />
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-[0.5em] opacity-40 ml-4 font-black">Visual Identifier URL</label>
                  <input 
                    type="text" 
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://visuals.com/identity.jpg"
                    className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-8 text-sm focus:border-white/40 focus:bg-white/10 outline-none transition-all font-bold italic"
                  />
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-[0.5em] opacity-40 ml-4 font-black">Neural Narrative (Bio)</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder="Describe your frequency..."
                    className="w-full bg-white/5 border border-white/10 rounded-[32px] py-6 px-8 text-sm focus:border-white/40 focus:bg-white/10 outline-none transition-all font-bold italic resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h3 className="text-4xl font-black tracking-tighter italic uppercase">Personal Archive</h3>
                <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-bold">Visuals synchronized with your frequency</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {favoriteWallpapers.length > 0 ? (
                  favoriteWallpapers.map((wp) => (
                    <div 
                      key={wp.id} 
                      className="group relative aspect-video rounded-[32px] overflow-hidden border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                      onClick={() => onBack?.()} // Take back to explore
                    >
                      <img src={wp.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt={wp.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6">
                        <p className="text-[8px] uppercase tracking-widest text-white/40 mb-1">{wp.category}</p>
                        <h4 className="text-xl font-black italic uppercase tracking-tighter">{wp.title}</h4>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(user.uid, wp.id, true);
                        }}
                        title="Remove from Archives"
                        aria-label="Remove from Archives"
                        className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-2 py-32 text-center space-y-8 bg-white/5 border border-white/5 rounded-[40px]">
                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto opacity-20">
                      <Heart size={32} />
                    </div>
                    <p className="text-[10px] uppercase tracking-[1em] opacity-40">Archive is currently empty</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h3 className="text-4xl font-black tracking-tighter italic uppercase">Neural Deployments</h3>
                <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-bold">History of visuals integrated with your hardware</p>
              </div>
              
              <div className="space-y-4">
                {user.downloadHistory && user.downloadHistory.length > 0 ? (
                  [...user.downloadHistory].reverse().map((item) => (
                    <div key={item.id} className="p-8 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-between group hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                          <History size={20} className="opacity-40" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black italic uppercase tracking-tighter leading-none mb-2">{item.title}</h4>
                          <div className="flex items-center gap-4">
                            <span className="text-[8px] uppercase tracking-widest opacity-40 font-bold">Res: {item.resolution}</span>
                            <div className="w-1 h-1 bg-white/10 rounded-full" />
                            <span className="text-[8px] uppercase tracking-widest opacity-40 font-bold">{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const wp = wallpapers?.find(w => w.id === item.wallpaperId || w.title === item.title);
                          if (wp) onDownload?.(wp, item.resolution);
                        }}
                        title="Re-Deploy"
                        aria-label="Re-Deploy"
                        className="px-6 py-3 bg-white text-black rounded-full text-[8px] uppercase tracking-widest font-black italic hover:scale-105 transition-all shadow-xl"
                      >
                        Re-Deploy
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-32 text-center space-y-8 bg-white/5 border border-white/5 rounded-[40px]">
                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto opacity-20">
                      <LayoutGrid size={32} />
                    </div>
                    <p className="text-[10px] uppercase tracking-[1em] opacity-40">No deployments recorded</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h3 className="text-4xl font-black tracking-tighter italic uppercase">Subscription Flux</h3>
                <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-bold">Manage your access level to the neural archives</p>
              </div>

              <div className="p-12 bg-white text-black rounded-[40px] flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-[0_30px_60px_rgba(255,255,255,0.1)]">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4 font-black">Current Status</p>
                  <h4 className="text-6xl font-black tracking-tighter italic uppercase leading-none">
                    {user.isPro ? `Pro ${user.subscriptionType === 'yearly' ? 'Annual' : 'Monthly'}` : 'Public Entry'}
                  </h4>
                  {user.isPro && (
                    <div className="flex items-center gap-3 mt-6 opacity-40">
                      <Activity size={14} fill="currentColor" />
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Neural Link Stable: Renewal in 294 Days</p>
                    </div>
                  )}
                </div>
                {!user.isPro ? (
                  <button 
                    onClick={() => onBack?.()} 
                    className="px-12 py-6 bg-black text-white rounded-full text-xs font-black uppercase tracking-[0.3em] italic hover:scale-105 active:scale-95 transition-all"
                  >
                    Upgrade Level
                  </button>
                ) : (
                  <button className="px-10 py-5 border border-black/10 rounded-full text-[10px] uppercase tracking-widest font-black italic hover:bg-black/5 transition-all">
                    Cancel Access
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-8 border border-white/10 rounded-[32px] space-y-4 opacity-40 grayscale">
                    <h5 className="text-[10px] uppercase tracking-[0.5em] font-black italic">Payment Method</h5>
                    <div className="flex items-center gap-4">
                       <CreditCard size={20} />
                       <span className="text-sm font-bold">VISA •••• 4242</span>
                    </div>
                 </div>
                 <div className="p-8 border border-white/10 rounded-[32px] space-y-4 opacity-40 grayscale">
                    <h5 className="text-[10px] uppercase tracking-[0.5em] font-black italic">Next Invoice</h5>
                    <div className="flex items-center gap-4">
                       <LayoutGrid size={20} />
                       <span className="text-sm font-bold">$12.00 on March 19</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h3 className="text-4xl font-black tracking-tighter italic uppercase">Security Ciphers</h3>
                <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-bold">Protect your neural identity within the rift</p>
              </div>

              <div className="grid grid-cols-1 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-8">
                  <div className="flex items-center gap-4">
                     <Shield size={20} className="text-brand-peach" />
                     <h4 className="text-xl font-black italic uppercase tracking-tighter">Rotate Security Key</h4>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-3">
                       <label htmlFor="newPassword" className="text-[8px] uppercase tracking-widest opacity-30 ml-4 font-black">New Cipher Code</label>
                       <input 
                         type="password" 
                         placeholder="••••••••••••"
                         value={newPassword}
                         onChange={(e) => setNewPassword(e.target.value)}
                         className="w-full bg-black/40 border border-white/5 rounded-full py-5 px-8 text-sm focus:border-white/40 outline-none transition-all font-bold tracking-widest"
                       />
                    </div>
                    <button 
                      onClick={handleUpdatePassword}
                      className="px-10 py-5 bg-white text-black rounded-full text-[10px] uppercase tracking-[0.3em] font-black italic hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                      Update Security
                    </button>
                  </div>
                </div>
                
                <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] flex items-center justify-between group hover:bg-white/10 transition-all">
                  <div className="space-y-2">
                    <h4 className="text-xl font-black italic uppercase tracking-tighter leading-none">Dual-Factor Auth</h4>
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Multi-layer identity verification</p>
                  </div>
                  <button 
                    title="Initialize Dual-Factor Auth"
                    aria-label="Initialize Dual-Factor Auth"
                    className="px-8 py-4 bg-white/10 border border-white/10 rounded-full text-[10px] uppercase tracking-widest font-black italic hover:bg-white hover:text-black transition-all"
                  >
                    Initialize
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h3 className="text-4xl font-black tracking-tighter italic uppercase">Interface Flux</h3>
                <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-bold">Optimize the rift for your visual cortex</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  { id: 'showExplicit', label: 'Explicit Content', desc: 'Allow uncensored visual data' },
                  { id: 'emailNotifications', label: 'Neural Updates', desc: 'Receive direct updates from the rift' },
                  { id: 'publicProfile', label: 'Public Identity', desc: 'Expose your archive to other nodes' },
                  { id: 'dataUsage', label: 'Spectral Compression', desc: 'Optimize load times for lower bandwidth' },
                ].map((s) => (
                  <div key={s.id} className="p-10 bg-white/5 border border-white/10 rounded-[40px] flex items-center justify-between group hover:bg-white/10 transition-all">
                    <div className="space-y-2">
                      <h4 className="text-xl font-black italic uppercase tracking-tighter leading-none">{s.label}</h4>
                      <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{s.desc}</p>
                    </div>
                    <button 
                      onClick={() => {
                        const val = !(user.settings as any)?.[s.id];
                        onUpdateUser({ settings: { ...user.settings, [s.id]: val } });
                        toast.success(`${s.label} Adjusted`, { description: `Parameter is now ${val ? 'active' : 'suspended'}.` });
                      }}
                      className={`w-16 h-8 rounded-full relative p-1.5 transition-colors ${ (user.settings as any)?.[s.id] ? 'bg-brand-peach' : 'bg-white/10'}`}
                    >
                      <motion.div 
                        animate={{ x: (user.settings as any)?.[s.id] ? 32 : 0 }}
                        className="w-5 h-5 rounded-full bg-white shadow-lg" 
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'admin' && user?.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-16"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="space-y-2">
                  <h3 className="text-4xl font-black tracking-tighter italic uppercase">Rift Command</h3>
                  <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-bold">Global Archive Management</p>
                </div>
              </div>

              {/* Add New Wallpaper */}
              <div className="bg-white/5 border border-white/10 rounded-[40px] p-12 space-y-10">
                <h4 className="text-xl font-black italic uppercase tracking-tighter">Synthesize New Visual</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[8px] uppercase tracking-widest opacity-30 ml-4 font-black">Archive Title</label>
                    <input 
                      type="text" 
                      placeholder="ENTER TITLE"
                      value={newWallpaper.title}
                      onChange={(e) => setNewWallpaper({...newWallpaper, title: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-full py-4 px-8 text-xs focus:border-white/40 outline-none transition-all font-bold italic uppercase"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[8px] uppercase tracking-widest opacity-30 ml-4 font-black">Visual Data URL</label>
                    <input 
                      type="text" 
                      placeholder="HTTPS://..."
                      value={newWallpaper.url}
                      onChange={(e) => setNewWallpaper({...newWallpaper, url: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-full py-4 px-8 text-xs focus:border-white/40 outline-none transition-all font-bold italic"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[8px] uppercase tracking-widest opacity-30 ml-4 font-black">Classification</label>
                    <select 
                      value={newWallpaper.category}
                      onChange={(e) => setNewWallpaper({...newWallpaper, category: e.target.value as Category})}
                      title="Select Classification"
                      aria-label="Select Classification"
                      className="w-full bg-black/40 border border-white/5 rounded-full py-4 px-8 text-xs focus:border-white/40 outline-none transition-all font-bold italic uppercase appearance-none"
                    >
                      {['Nature', 'Minimal', 'Futuristic', 'Multi-Monitor', 'Abstract', 'Live Wallpaper'].map(c => (
                        <option key={c} value={c} className="bg-zinc-900">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-12 px-8 pt-6">
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${newWallpaper.isPro ? 'bg-brand-peach border-brand-peach' : 'border-white/20 group-hover:border-white/40'}`}>
                        {newWallpaper.isPro && <Shield size={12} className="text-black" />}
                      </div>
                      <input 
                        type="checkbox" 
                        checked={newWallpaper.isPro}
                        onChange={(e) => setNewWallpaper({...newWallpaper, isPro: e.target.checked})}
                        className="hidden"
                      />
                      <span className="text-[10px] uppercase tracking-widest font-black italic">Pro Level</span>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${newWallpaper.isLive ? 'bg-blue-500 border-blue-500' : 'border-white/20 group-hover:border-white/40'}`}>
                        {newWallpaper.isLive && <MonitorPlay size={12} className="text-black" />}
                      </div>
                      <input 
                        type="checkbox" 
                        checked={newWallpaper.isLive}
                        onChange={(e) => setNewWallpaper({...newWallpaper, isLive: e.target.checked})}
                        className="hidden"
                      />
                      <span className="text-[10px] uppercase tracking-widest font-black italic">Live Node</span>
                    </label>
                  </div>
                </div>
                <button 
                  onClick={handleAddWallpaper}
                  disabled={isAdminLoading}
                  className="w-full py-6 bg-white text-black rounded-full text-[10px] uppercase tracking-[0.5em] font-black italic hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xl"
                >
                  {isAdminLoading ? 'SYNTHESIZING...' : 'INJECT INTO RIFT'}
                </button>
              </div>

              {/* Wallpaper List */}
              <div className="space-y-8">
                <div className="flex items-center justify-between ml-4">
                  <h4 className="text-xl font-black italic uppercase tracking-tighter">Active Visual Archive ({adminWallpapers.length})</h4>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {adminWallpapers.length > 0 ? (
                    adminWallpapers.map((wp) => (
                      <div key={wp.id} className="bg-white/5 border border-white/5 rounded-[28px] p-6 flex items-center justify-between group hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-12 rounded-xl bg-black overflow-hidden border border-white/10 shadow-lg">
                            {wp.isLive ? (
                              <video src={wp.url} className="w-full h-full object-cover" muted />
                            ) : (
                              <img src={wp.url} className="w-full h-full object-cover" alt={wp.title} referrerPolicy="no-referrer" />
                            )}
                          </div>
                          <div>
                            <h5 className="text-sm font-black italic uppercase tracking-tighter leading-none mb-2">{wp.title}</h5>
                            <p className="text-[8px] uppercase tracking-widest opacity-40 font-bold">{wp.category} • {wp.isPro ? 'Pro' : 'Free'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteWallpaper(wp.id)}
                          title="Purge Visual"
                          aria-label="Purge Visual"
                          className="p-4 text-rose-500 hover:bg-rose-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-24 text-center bg-white/5 border border-white/5 rounded-[40px]">
                      <p className="text-[10px] uppercase tracking-[1em] opacity-40">Archive empty</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-[40px] p-12 max-w-md w-full space-y-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
          >
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-500">
               <Trash2 size={32} />
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">Purge Visual?</h3>
              <p className="text-sm opacity-60 font-medium">This action will permanently sever the link to this archive. This cannot be reversed.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setWallpaperToDelete(null);
                }}
                className="flex-1 py-5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest italic hover:bg-white/5 transition-colors"
              >
                Abort
              </button>
              <button 
                onClick={confirmDeleteWallpaper}
                disabled={isAdminLoading}
                className="flex-1 py-5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest italic hover:bg-rose-600 transition-colors disabled:opacity-50"
              >
                {isAdminLoading ? 'PURGING...' : 'PURGE'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};
