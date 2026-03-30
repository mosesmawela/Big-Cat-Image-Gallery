import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, getDocFromServer, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { User, Wallpaper } from '../types';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const toggleFavorite = async (userId: string, wallpaperId: string, isFavorite: boolean) => {
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      favorites: isFavorite ? arrayRemove(wallpaperId) : arrayUnion(wallpaperId),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/favorites`);
  }
};

export const recordDownload = async (userId: string, wallpaper: Wallpaper, resolution: string) => {
  const userRef = doc(db, 'users', userId);
  const wallpaperRef = doc(db, 'wallpapers', wallpaper.id);

  const downloadEntry = {
    id: crypto.randomUUID(),
    wallpaperId: wallpaper.id,
    title: wallpaper.title,
    date: new Date().toISOString(),
    resolution: resolution
  };

  try {
    await Promise.all([
      updateDoc(userRef, {
        downloadHistory: arrayUnion(downloadEntry),
        updatedAt: new Date().toISOString()
      }),
      updateDoc(wallpaperRef, {
        downloadCount: increment(1)
      })
    ]);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/downloadHistory`);
  }
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate Connection to Firestore
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
    // Skip logging for other errors, as this is simply a connection test.
  }
}
testConnection();

export { signInWithPopup, signOut, onAuthStateChanged };
export type { FirebaseUser };
