import React from 'react';
import { motion } from 'motion/react';
import { AccountManagement } from '../components/AccountManagement';
import { User, Wallpaper } from '../types';

interface AccountPageProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => Promise<void>;
  onLogout: () => void;
  wallpapers: Wallpaper[];
  onDownload: (wp: Wallpaper, resolution: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  user,
  onUpdateUser,
  onLogout,
  wallpapers,
  onDownload
}) => {
  return (
    <motion.div
      key="account"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 pt-32 pb-32 bg-white min-h-screen"
    >
      <AccountManagement 
        user={user}
        onUpdateUser={onUpdateUser}
        onLogout={onLogout}
        wallpapers={wallpapers}
        onDownload={onDownload}
      />
    </motion.div>
  );
};
