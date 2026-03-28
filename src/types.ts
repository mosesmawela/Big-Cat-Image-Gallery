export type Category = 'Nature' | 'Minimal' | 'Futuristic' | 'Multi-Monitor' | 'Abstract' | 'Live Wallpaper';

export interface Wallpaper {
  id: string;
  url: string;
  downloadUrls?: {
    '1080p'?: string;
    '4K'?: string;
    'Ultrawide'?: string;
  };
  title: string;
  category: Category;
  description?: string;
  tags?: string[];
  software?: string[];
  isPro?: boolean;
  resolution?: '1080p' | '4K' | 'Ultrawide';
  isLive?: boolean;
}

export type AppState = 'loading' | 'splash' | 'main' | 'category' | 'account' | 'pricing' | 'auth' | 'search' | 'new-releases';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  bio?: string;
  isPro: boolean;
  role?: 'admin' | 'user';
  subscriptionType?: 'monthly' | 'yearly';
  settings?: {
    theme: 'light' | 'dark';
    showExplicit: boolean;
    emailNotifications?: boolean;
    publicProfile?: boolean;
    dataUsage?: boolean;
  };
  downloadHistory?: {
    id: string;
    wallpaperId?: string;
    title: string;
    date: string;
    resolution: string;
  }[];
  favorites: string[];
  createdAt?: string;
  updatedAt?: string;
}
