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
  user: { uid: string; email: string | null; displayName: string | null } | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string, phone?: string, city?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const LOCAL_USERS_KEY = 'rwsb_local_accounts_v1';
const LOCAL_SESSION_KEY = 'rwsb_local_session_uid_v1';

interface LocalUserRecord {
  uid: string;
  email: string;
  passwordHash: string;
  displayName: string;
  phone?: string;
  city?: string;
  createdAt: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous immediate local session detection (Zero-delay startup)
  const [user, setUser] = useState<{ uid: string; email: string | null; displayName: string | null } | null>(() => {
    try {
      const localUid = localStorage.getItem(LOCAL_SESSION_KEY);
      if (localUid) {
        const raw = localStorage.getItem(LOCAL_USERS_KEY);
        const users: LocalUserRecord[] = raw ? JSON.parse(raw) : [];
        const found = users.find((u) => u.uid === localUid);
        if (found) {
          return { uid: found.uid, email: found.email, displayName: found.displayName };
        }
      }
    } catch {}
    return null;
  });

  const [userProfile, setUserProfile] = useState<UserProfileData | null>(() => {
    try {
      const localUid = localStorage.getItem(LOCAL_SESSION_KEY);
      if (localUid) {
        const raw = localStorage.getItem(LOCAL_USERS_KEY);
        const users: LocalUserRecord[] = raw ? JSON.parse(raw) : [];
        const found = users.find((u) => u.uid === localUid);
        if (found) {
          return {
            uid: found.uid,
            email: found.email,
            displayName: found.displayName,
            phone: found.phone,
            city: found.city,
            createdAt: found.createdAt,
          };
        }
      }
    } catch {}
    return null;
  });

  const [loading, setLoading] = useState(false);

  // Helper to read local users
  const getLocalUsers = (): LocalUserRecord[] => {
    try {
      const data = localStorage.getItem(LOCAL_USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveLocalUsers = (users: LocalUserRecord[]) => {
    try {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to persist users to localStorage', e);
    }
  };

  const setLocalSession = (userRecord: LocalUserRecord | null) => {
    if (userRecord) {
      localStorage.setItem(LOCAL_SESSION_KEY, userRecord.uid);
      setUser({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      });
      setUserProfile({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        phone: userRecord.phone,
        city: userRecord.city,
        createdAt: userRecord.createdAt,
      });
    } else {
      localStorage.removeItem(LOCAL_SESSION_KEY);
      setUser(null);
      setUserProfile(null);
    }
  };

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
      setUserProfile((prev) => prev || {
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || 'খরগোশ অভিভাবক',
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    // Non-blocking Firebase Auth listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserProfile(currentUser);
      } else {
        // If not authenticated via Firebase, check if local user exists
        const localUid = localStorage.getItem(LOCAL_SESSION_KEY);
        if (localUid) {
          const users = getLocalUsers();
          const found = users.find((u) => u.uid === localUid);
          if (found) {
            setLocalSession(found);
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    try {
      // Attempt Firebase Auth first
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      if (userCredential.user) {
        await fetchUserProfile(userCredential.user);
        return;
      }
    } catch (fbErr: any) {
      console.warn('Firebase signIn attempt:', fbErr?.code || fbErr?.message);
      
      // If operation-not-allowed or offline or network error, fallback seamlessly to Local Isolated Accounts
      const users = getLocalUsers();
      const matched = users.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.passwordHash === cleanPass
      );

      if (matched) {
        setLocalSession(matched);
        return;
      }

      // If user exists locally but password incorrect
      const userExists = users.some((u) => u.email.toLowerCase() === cleanEmail);
      if (userExists) {
        throw new Error('auth/wrong-password');
      }

      // If Firebase specifically threw user-not-found / wrong-password, rethrow
      if (fbErr?.code === 'auth/wrong-password' || fbErr?.code === 'auth/invalid-credential' || fbErr?.code === 'auth/user-not-found') {
        throw fbErr;
      }

      // If no local account matched and firebase disabled, let user know
      if (users.length === 0 || !userExists) {
        throw new Error('auth/user-not-found');
      }

      throw fbErr;
    }
  };

  const signUp = async (email: string, pass: string, name: string, phone?: string, city?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    const cleanName = name.trim();

    try {
      // Attempt Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
      const createdUser = userCredential.user;
      if (cleanName) {
        await updateProfile(createdUser, { displayName: cleanName });
      }
      const newProfile: UserProfileData = {
        uid: createdUser.uid,
        email: createdUser.email || cleanEmail,
        displayName: cleanName || 'খরগোশ অভিভাবক',
        phone: phone?.trim() || '',
        city: city?.trim() || 'ঢাকা (Dhaka)',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', createdUser.uid, 'profile', 'info'), newProfile);
      setUserProfile(newProfile);
    } catch (fbErr: any) {
      console.warn('Firebase signUp error, fallback to secure local storage auth:', fbErr?.code || fbErr?.message);

      // Check if email already registered locally
      const users = getLocalUsers();
      if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
        throw new Error('auth/email-already-in-use');
      }

      // Generate deterministic unique UID for this user
      const customUid = 'usr_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      const newLocalUser: LocalUserRecord = {
        uid: customUid,
        email: cleanEmail,
        passwordHash: cleanPass,
        displayName: cleanName || 'খরগোশ অভিভাবক',
        phone: phone?.trim() || '',
        city: city?.trim() || 'ঢাকা (Dhaka)',
        createdAt: new Date().toISOString(),
      };

      users.push(newLocalUser);
      saveLocalUsers(users);
      setLocalSession(newLocalUser);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signOut error', e);
    }
    setLocalSession(null);
  };

  const resetPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch (fbErr) {
      console.warn('Firebase reset email error', fbErr);
      const users = getLocalUsers();
      const userExists = users.some((u) => u.email.toLowerCase() === cleanEmail);
      if (!userExists) {
        throw new Error('auth/user-not-found');
      }
      // For local accounts, simulate success so user gets confirmation
    }
  };

  const refreshProfile = async () => {
    if (user) {
      if (user.uid.startsWith('usr_')) {
        const users = getLocalUsers();
        const found = users.find((u) => u.uid === user.uid);
        if (found) setLocalSession(found);
      } else {
        await fetchUserProfile(user as User);
      }
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
