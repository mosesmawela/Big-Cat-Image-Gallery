import { useState, useEffect, useCallback } from 'react';
import { 
  db, 
  OperationType,
  handleFirestoreError
} from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { Wallpaper, Category } from '../types';
import { WALLPAPERS as FALLBACK_WALLPAPERS } from '../constants';

interface UseWallpapersProps {
  category?: Category | 'All';
  searchQuery?: string;
  pageSize?: number;
  filter?: 'popular' | 'latest' | 'featured' | 'random';
  resolution?: string;
}

export const useWallpapers = ({ 
  category = 'All', 
  searchQuery = '', 
  pageSize = 12,
  filter = 'latest',
  resolution = ''
}: UseWallpapersProps = {}) => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchWallpapers = useCallback(async (isNextPage = false) => {
    if (!isNextPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const wallpapersRef = collection(db, 'wallpapers');
      let q = query(wallpapersRef);

      // Filtering logic...
      if (category && category !== 'All') {
        q = query(q, where('category', '==', category));
      }
      if (resolution) {
        q = query(q, where('resolution', '==', resolution.toUpperCase()));
      }
      if (searchQuery) {
        q = query(q, where('tags', 'array-contains', searchQuery.toLowerCase()));
      }
      if (filter === 'popular') {
        q = query(q, orderBy('downloadCount', 'desc'));
      } else if (filter === 'featured') {
        q = query(q, where('isFeatured', '==', true), orderBy('createdAt', 'desc'));
      } else {
        q = query(q, orderBy('createdAt', 'desc'));
      }

      q = query(q, limit(pageSize));
      if (isNextPage && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const snapshot = await getDocs(q);
      let fetchedWallpapers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Wallpaper[];

      // Fallback to local constants if database returns empty (likely config issue)
      if (!isNextPage && fetchedWallpapers.length === 0) {
        console.warn('Firebase returned 0 results. Falling back to local WALLPAPERS.');
        let fb = FALLBACK_WALLPAPERS;
        if (category && category !== 'All') fb = fb.filter(w => w.category === category);
        if (resolution) fb = fb.filter(w => w.resolution === resolution.toUpperCase());
        fetchedWallpapers = fb.slice(0, pageSize);
      }

      if (isNextPage) {
        setWallpapers(prev => [...prev, ...fetchedWallpapers]);
      } else {
        setWallpapers(fetchedWallpapers);
      }

      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === pageSize);
    } catch (err) {
      // If Firestore fails entirely (config error), fall back to local constants
      console.error('Firestore Error, falling back to local data:', err);
      if (!isNextPage) {
        let fb = FALLBACK_WALLPAPERS;
        if (category && category !== 'All') fb = fb.filter(w => w.category === category);
        if (resolution) fb = fb.filter(w => w.resolution === resolution.toUpperCase());
        setWallpapers(fb.slice(0, pageSize));
        setHasMore(fb.length > pageSize);
      }
      setError(err as Error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, searchQuery, pageSize, filter, lastVisible, resolution]);

  useEffect(() => {
    fetchWallpapers();
    return () => {
      setLastVisible(null);
      setHasMore(true);
    };
  }, [category, searchQuery, filter, resolution]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchWallpapers(true);
    }
  };

  return {
    wallpapers,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    refresh: () => fetchWallpapers(false)
  };
};
