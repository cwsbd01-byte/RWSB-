import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  city?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string, phone?: string, city?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (currentUser: User) => {
    try {
      const docRef = doc(db, 'users', currentUser.uid, 'profile', 'info');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfileData);
      } else {
        const fallbackProfile: UserProfileData = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || 'খরগোশ অভিভাবক',
          createdAt: new Date().toISOString(),
        };
        await setDoc(docRef, fallbackProfile);
        setUserProfile(fallbackProfile);
      }
    } catch (err) {
      console.warn('Could not fetch user profile from firestore:', err);
      setUserProfile({
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || 'খরগোশ অভিভাবক',
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    if (userCredential.user) {
      await fetchUserProfile(userCredential.user);
    }
  };

  const signUp = async (email: string, pass: string, name: string, phone?: string, city?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const createdUser = userCredential.user;
    if (name.trim()) {
      await updateProfile(createdUser, { displayName: name.trim() });
    }
    const newProfile: UserProfileData = {
      uid: createdUser.uid,
      email: createdUser.email || email.trim(),
      displayName: name.trim() || 'খরগোশ অভিভাবক',
      phone: phone?.trim() || '',
      city: city?.trim() || 'Dhaka',
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', createdUser.uid, 'profile', 'info'), newProfile);
    setUserProfile(newProfile);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
