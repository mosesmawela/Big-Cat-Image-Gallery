import { useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  signOut, 
  googleProvider, 
  signInWithPopup,
  OperationType,
  handleFirestoreError
} from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Set up a real-time listener for the user document
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          
          const unsubscribeSnapshot = onSnapshot(userDocRef, async (snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.data() as User;
              setUser(userData);
              setLoading(false);
            } else {
              // Create initial user profile if it doesn't exist
              const newUser: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || '',
                photoURL: firebaseUser.photoURL || '',
                isPro: false, // Default to false, can be updated in DB
                favorites: [],
                settings: {
                  theme: 'dark',
                  showExplicit: false,
                  emailNotifications: true,
                  publicProfile: true
                },
                downloadHistory: [],
                createdAt: new Date().toISOString(),
              };

              try {
                await setDoc(userDocRef, {
                  ...newUser,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                });
                // Snapshot listener will pick this up and set user
              } catch (err) {
                handleFirestoreError(err, OperationType.CREATE, `users/${firebaseUser.uid}`);
              }
            }
          }, (err) => {
            handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
          });

          return () => unsubscribeSnapshot();
        } catch (err) {
          setError(err as Error);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    user,
    isPro: user?.isPro || false,
    isAdmin: user?.role === 'admin',
    loading,
    error,
    login,
    logout
  };
};
