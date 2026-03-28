import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Settings, Shield, CreditCard, LogOut, Camera, Bell, Eye, Plus, Trash2, LayoutGrid, ArrowLeft } from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { toast } from 'sonner';

import { User as UserType, Wallpaper, Category } from '../types';

interface AccountManagementProps {
  user: UserType | null;
  onLogout: () => void;
  onUpdateUser: (updates: Partial<UserType>) => void;
  onBack?: () => void;
}

export const AccountManagement: React.FC<AccountManagementProps> = ({ user, onLogout, onUpdateUser, onBack }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [bio, setBio] = useState(user?.bio || '');

  // Admin states
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [newWallpaper, setNewWallpaper] = useState<Partial<Wallpaper>>({
    title: '',
    url: '',
    category: 'Nature',
    isPro: false,
    isLive: false,
    resolution: '4K'
  });
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wallpaperToDelete, setWallpaperToDelete] = useState<string | null>(null);

  const [error, setError] = useState<Error | null>(null);

  const handleUpdatePassword = async () => {
    if (!newPassword) return;
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        toast.success('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (error: any) {
      toast.error('Failed to update password', { description: error.message });
    }
  };

  const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'options', label: 'Account Options', icon: Bell },
    { id: 'history', label: 'Downloads', icon: LayoutGrid },
  ];

  if (user?.role === 'admin') {
    TABS.push({ id: 'admin', label: 'Admin', icon: LayoutGrid });
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
      setWallpapers(docs);
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
      toast.success('Wallpaper added successfully');
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
      toast.success('Wallpaper deleted successfully');
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
    <section className="py-48 px-12 bg-white text-black min-h-screen relative">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-12 left-12 p-3 rounded-full border border-black/10 hover:bg-black/5 transition-all z-50"
        >
          <ArrowLeft size={18} />
        </button>
      )}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-24">
        {/* Sidebar */}
        <div className="space-y-12">
          <div className="flex items-center gap-6 mb-16">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-black/5 overflow-hidden border border-black/5">
                <img 
                  src={user.photoURL || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80"} 
                  className="w-full h-full object-cover"
                  alt="Profile"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={12} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter italic uppercase">{user.displayName || 'User'}</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-40">{user.isPro ? 'Pro Member' : 'Free Member'}</p>
            </div>
          </div>

          <nav className="space-y-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-6 p-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-black text-white' : 'hover:bg-black/5 opacity-40 hover:opacity-100'}`}
              >
                <tab.icon size={18} />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{tab.label}</span>
              </button>
            ))}
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-6 p-4 rounded-2xl text-rose-500 hover:bg-rose-500/5 transition-all opacity-60 hover:opacity-100"
            >
              <LogOut size={18} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Log Out</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-black/5 rounded-[40px] p-16">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black tracking-tighter italic uppercase">Profile Settings</h3>
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
                      toast.success('Profile updated successfully');
                    } catch (error: any) {
                      toast.error('Failed to update profile', { description: error.message });
                    }
                  }}
                  className="px-8 py-3 bg-black text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-black/80 transition-all"
                >
                  Save Changes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest opacity-40 ml-4">Display Name</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-white rounded-full py-4 px-8 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest opacity-40 ml-4">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white rounded-full py-4 px-8 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-40 ml-4">Profile Photo URL</label>
                  <input 
                    type="text" 
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="w-full bg-white rounded-full py-4 px-8 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-40 ml-4">Bio / Description</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-white rounded-[32px] py-4 px-8 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <h3 className="text-2xl font-black tracking-tighter italic uppercase">Security Settings</h3>
              <div className="grid grid-cols-1 gap-8">
                <div className="p-8 bg-white rounded-3xl border border-black/5 space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-tight">Change Password</h4>
                  <div className="space-y-4">
                    <input 
                      type="password" 
                      placeholder="Current Password"
                      className="w-full bg-black/5 rounded-full py-3 px-6 text-xs focus:outline-none"
                    />
                    <input 
                      type="password" 
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-black/5 rounded-full py-3 px-6 text-xs focus:outline-none"
                    />
                    <button 
                      onClick={handleUpdatePassword}
                      className="px-8 py-3 bg-black text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-black/80 transition-all"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
                
                <div className="p-8 bg-white rounded-3xl border border-black/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-tight mb-1">Two-Factor Authentication</h4>
                    <p className="text-[10px] uppercase tracking-widest opacity-40">Add an extra layer of security to your account</p>
                  </div>
                  <button className="px-6 py-2 border border-black/10 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-black/5 transition-all">
                    Enable
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <h3 className="text-2xl font-black tracking-tighter italic uppercase">Subscription & Billing</h3>
              <div className="p-12 bg-black text-white rounded-[32px] flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">Current Plan</p>
                  <h4 className="text-4xl font-black tracking-tighter italic uppercase">
                    {user.isPro ? `Pro ${user.subscriptionType === 'yearly' ? 'Annual' : 'Monthly'}` : 'Free Plan'}
                  </h4>
                  {user.isPro && (
                    <p className="text-[10px] uppercase tracking-widest opacity-40 mt-4">Next billing: March 19, 2027</p>
                  )}
                </div>
                {!user.isPro && (
                  <button 
                    onClick={onBack} // This will take them back to main, where they can see pricing if state is main
                    className="px-8 py-4 bg-white text-black rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-white/90 transition-all"
                  >
                    Upgrade Now
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <h3 className="text-2xl font-black tracking-tighter italic uppercase">App Settings</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="p-8 bg-white rounded-3xl border border-black/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-tight mb-1">Explicit Content</h4>
                    <p className="text-[10px] uppercase tracking-widest opacity-40">Show or hide explicit content in galleries</p>
                  </div>
                  <button 
                    onClick={() => {
                      onUpdateUser({ settings: { ...user.settings, showExplicit: !user.settings?.showExplicit } });
                      toast.success(`Explicit content ${!user.settings?.showExplicit ? 'enabled' : 'disabled'}`);
                    }}
                    className={`w-12 h-6 rounded-full relative p-1 transition-colors ${user.settings?.showExplicit ? 'bg-emerald-500' : 'bg-black/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all ${user.settings?.showExplicit ? 'ml-auto' : ''}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <h3 className="text-2xl font-black tracking-tighter italic uppercase">Download History</h3>
              <div className="space-y-4">
                {user.downloadHistory && user.downloadHistory.length > 0 ? (
                  user.downloadHistory.map((item) => (
                    <div key={item.id} className="p-6 bg-white rounded-2xl border border-black/5 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-tight">{item.title}</h4>
                        <p className="text-[8px] uppercase tracking-widest opacity-40">{item.date} · {item.resolution}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center bg-white rounded-3xl border border-black/5">
                    <p className="text-[10px] uppercase tracking-widest opacity-40">No downloads yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'options' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <h3 className="text-2xl font-black tracking-tighter italic uppercase">Account Options</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="p-8 bg-white rounded-3xl border border-black/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-tight mb-1">Email Notifications</h4>
                    <p className="text-[10px] uppercase tracking-widest opacity-40">Receive updates about new wallpapers</p>
                  </div>
                  <button 
                    onClick={() => {
                      onUpdateUser({ settings: { ...user.settings, emailNotifications: !user.settings?.emailNotifications } });
                      toast.success(`Email notifications ${!user.settings?.emailNotifications ? 'enabled' : 'disabled'}`);
                    }}
                    className={`w-12 h-6 rounded-full relative p-1 transition-colors ${user.settings?.emailNotifications ? 'bg-emerald-500' : 'bg-black/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all ${user.settings?.emailNotifications ? 'ml-auto' : ''}`} />
                  </button>
                </div>
                <div className="p-8 bg-white rounded-3xl border border-black/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-tight mb-1">Public Profile</h4>
                    <p className="text-[10px] uppercase tracking-widest opacity-40">Allow others to see your favorites</p>
                  </div>
                  <button 
                    onClick={() => {
                      onUpdateUser({ settings: { ...user.settings, publicProfile: !user.settings?.publicProfile } });
                      toast.success(`Public profile ${!user.settings?.publicProfile ? 'enabled' : 'disabled'}`);
                    }}
                    className={`w-12 h-6 rounded-full relative p-1 transition-colors ${user.settings?.publicProfile ? 'bg-emerald-500' : 'bg-black/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all ${user.settings?.publicProfile ? 'ml-auto' : ''}`} />
                  </button>
                </div>
                <div className="p-8 bg-white rounded-3xl border border-black/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-tight mb-1">Data Usage</h4>
                    <p className="text-[10px] uppercase tracking-widest opacity-40">Optimize image loading for slower connections</p>
                  </div>
                  <button 
                    onClick={() => {
                      onUpdateUser({ settings: { ...user.settings, dataUsage: !user.settings?.dataUsage } });
                      toast.success(`Data usage optimization ${!user.settings?.dataUsage ? 'enabled' : 'disabled'}`);
                    }}
                    className={`w-12 h-6 rounded-full relative p-1 transition-colors ${user.settings?.dataUsage ? 'bg-emerald-500' : 'bg-black/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all ${user.settings?.dataUsage ? 'ml-auto' : ''}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'admin' && user?.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black tracking-tighter italic uppercase">Admin Panel</h3>
                <p className="text-[10px] uppercase tracking-widest opacity-40">Manage Wallpapers</p>
              </div>

              {/* Add New Wallpaper */}
              <div className="bg-white rounded-[32px] p-12 space-y-8">
                <h4 className="text-sm font-black tracking-tighter italic uppercase">Add New Wallpaper</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input 
                    type="text" 
                    placeholder="Title"
                    value={newWallpaper.title}
                    onChange={(e) => setNewWallpaper({...newWallpaper, title: e.target.value})}
                    className="w-full bg-black/5 rounded-full py-3 px-6 text-xs focus:outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="URL"
                    value={newWallpaper.url}
                    onChange={(e) => setNewWallpaper({...newWallpaper, url: e.target.value})}
                    className="w-full bg-black/5 rounded-full py-3 px-6 text-xs focus:outline-none"
                  />
                  <select 
                    value={newWallpaper.category}
                    onChange={(e) => setNewWallpaper({...newWallpaper, category: e.target.value as Category})}
                    className="w-full bg-black/5 rounded-full py-3 px-6 text-xs focus:outline-none appearance-none"
                  >
                    <option value="Nature">Nature</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Futuristic">Futuristic</option>
                    <option value="Multi-Monitor">Multi-Monitor</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Live Wallpaper">Live Wallpaper</option>
                  </select>
                  <div className="flex items-center gap-8 px-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newWallpaper.isPro}
                        onChange={(e) => setNewWallpaper({...newWallpaper, isPro: e.target.checked})}
                        className="w-4 h-4 rounded border-black/10 text-black focus:ring-black"
                      />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Pro</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newWallpaper.isLive}
                        onChange={(e) => setNewWallpaper({...newWallpaper, isLive: e.target.checked})}
                        className="w-4 h-4 rounded border-black/10 text-black focus:ring-black"
                      />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Live</span>
                    </label>
                  </div>
                </div>
                <button 
                  onClick={handleAddWallpaper}
                  disabled={isAdminLoading}
                  className="w-full py-4 bg-black text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-black/80 transition-all disabled:opacity-50"
                >
                  {isAdminLoading ? 'Processing...' : 'Add Wallpaper'}
                </button>
              </div>

              {/* Wallpaper List */}
              <div className="space-y-4">
                <h4 className="text-sm font-black tracking-tighter italic uppercase ml-4">Current Wallpapers ({wallpapers.length})</h4>
                <div className="grid grid-cols-1 gap-4">
                  {wallpapers.length > 0 ? (
                    wallpapers.map((wp) => (
                      <div key={wp.id} className="bg-white rounded-2xl p-6 flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-10 rounded-lg bg-black/5 overflow-hidden">
                            {wp.isLive ? (
                              <video src={wp.url} className="w-full h-full object-cover" muted />
                            ) : (
                              <img src={wp.url} className="w-full h-full object-cover" alt={wp.title} referrerPolicy="no-referrer" />
                            )}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold uppercase tracking-tight">{wp.title}</h5>
                            <p className="text-[8px] uppercase tracking-widest opacity-40">{wp.category} · {wp.isPro ? 'Pro' : 'Free'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteWallpaper(wp.id)}
                          className="p-3 text-rose-500 hover:bg-rose-500/5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center bg-white rounded-3xl border border-black/5">
                      <p className="text-[10px] uppercase tracking-widest opacity-40">No wallpapers found</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full space-y-6"
          >
            <h3 className="text-xl font-black uppercase tracking-tight">Delete Wallpaper</h3>
            <p className="text-sm opacity-60">Are you sure you want to delete this wallpaper? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setWallpaperToDelete(null);
                }}
                className="flex-1 py-3 rounded-full border border-black/10 text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteWallpaper}
                disabled={isAdminLoading}
                className="flex-1 py-3 rounded-full bg-rose-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50"
              >
                {isAdminLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};
