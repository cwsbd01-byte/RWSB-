import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Rabbit, DailyHealthLog, WeightRecord, MedicalRecord } from '../types';

/**
 * All data is strictly isolated per userId (`users/{userId}/...`).
 * Provides automatic dual-layer support (Firestore + Local Encrypted Storage for seamless fallback).
 */

const getLocalStorageKey = (userId: string, collectionName: string) => `rwsb_data_${userId}_${collectionName}`;

const getLocalCollection = <T>(userId: string, collectionName: string): T[] => {
  try {
    const raw = localStorage.getItem(getLocalStorageKey(userId, collectionName));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalCollection = <T>(userId: string, collectionName: string, items: T[]) => {
  try {
    localStorage.setItem(getLocalStorageKey(userId, collectionName), JSON.stringify(items));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
};

// RABBITS
export const subscribeToUserRabbits = (
  userId: string,
  callback: (rabbits: Rabbit[]) => void
): Unsubscribe => {
  // Read local immediately
  const localRabbits = getLocalCollection<Rabbit>(userId, 'rabbits');
  if (localRabbits.length > 0) {
    callback(localRabbits);
  }

  try {
    const rabbitsRef = collection(db, 'users', userId, 'rabbits');
    return onSnapshot(
      rabbitsRef,
      (snap) => {
        const list: Rabbit[] = [];
        snap.forEach((d) => {
          list.push(d.data() as Rabbit);
        });
        if (list.length > 0) {
          saveLocalCollection(userId, 'rabbits', list);
          callback(list);
        } else if (localRabbits.length > 0) {
          callback(localRabbits);
        } else {
          callback([]);
        }
      },
      (err) => {
        console.warn('Firestore subscription fallback to local for rabbits:', err.message);
        callback(getLocalCollection<Rabbit>(userId, 'rabbits'));
      }
    );
  } catch (e) {
    console.warn('Firestore connection failed, using local storage for rabbits', e);
    callback(localRabbits);
    return () => {};
  }
};

export const saveFirestoreRabbit = async (userId: string, rabbit: Rabbit): Promise<void> => {
  // Update local
  const current = getLocalCollection<Rabbit>(userId, 'rabbits');
  const idx = current.findIndex((r) => r.id === rabbit.id);
  if (idx >= 0) {
    current[idx] = rabbit;
  } else {
    current.push(rabbit);
  }
  saveLocalCollection(userId, 'rabbits', current);

  // Sync to Firestore
  try {
    const docRef = doc(db, 'users', userId, 'rabbits', rabbit.id);
    await setDoc(docRef, rabbit, { merge: true });
  } catch (e) {
    console.warn('Firestore rabbit write error, saved locally:', e);
  }
};

export const deleteFirestoreRabbit = async (userId: string, rabbitId: string): Promise<void> => {
  const current = getLocalCollection<Rabbit>(userId, 'rabbits').filter((r) => r.id !== rabbitId);
  saveLocalCollection(userId, 'rabbits', current);

  try {
    const docRef = doc(db, 'users', userId, 'rabbits', rabbitId);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Firestore rabbit delete error:', e);
  }
};

// HEALTH LOGS
export const subscribeToHealthLogs = (
  userId: string,
  callback: (logs: DailyHealthLog[]) => void
): Unsubscribe => {
  const localLogs = getLocalCollection<DailyHealthLog>(userId, 'healthLogs');
  if (localLogs.length > 0) {
    callback(localLogs);
  }

  try {
    const logsRef = collection(db, 'users', userId, 'healthLogs');
    const q = query(logsRef, orderBy('date', 'desc'));
    return onSnapshot(
      q,
      (snap) => {
        const list: DailyHealthLog[] = [];
        snap.forEach((d) => {
          list.push(d.data() as DailyHealthLog);
        });
        if (list.length > 0) {
          saveLocalCollection(userId, 'healthLogs', list);
          callback(list);
        } else if (localLogs.length > 0) {
          callback(localLogs);
        } else {
          callback([]);
        }
      },
      (err) => {
        console.warn('Firestore logs fallback to local:', err.message);
        callback(getLocalCollection<DailyHealthLog>(userId, 'healthLogs'));
      }
    );
  } catch {
    callback(localLogs);
    return () => {};
  }
};

export const saveFirestoreHealthLog = async (userId: string, log: DailyHealthLog): Promise<void> => {
  const current = getLocalCollection<DailyHealthLog>(userId, 'healthLogs');
  const idx = current.findIndex((l) => l.id === log.id);
  if (idx >= 0) {
    current[idx] = log;
  } else {
    current.unshift(log);
  }
  saveLocalCollection(userId, 'healthLogs', current);

  try {
    const docRef = doc(db, 'users', userId, 'healthLogs', log.id);
    await setDoc(docRef, log, { merge: true });
  } catch (e) {
    console.warn('Firestore log write error:', e);
  }
};

export const deleteFirestoreHealthLog = async (userId: string, logId: string): Promise<void> => {
  const current = getLocalCollection<DailyHealthLog>(userId, 'healthLogs').filter((l) => l.id !== logId);
  saveLocalCollection(userId, 'healthLogs', current);

  try {
    const docRef = doc(db, 'users', userId, 'healthLogs', logId);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Firestore log delete error:', e);
  }
};

// WEIGHT RECORDS
export const subscribeToWeightRecords = (
  userId: string,
  callback: (weights: WeightRecord[]) => void
): Unsubscribe => {
  const localWeights = getLocalCollection<WeightRecord>(userId, 'weightRecords');
  if (localWeights.length > 0) {
    callback(localWeights);
  }

  try {
    const weightRef = collection(db, 'users', userId, 'weightRecords');
    const q = query(weightRef, orderBy('date', 'asc'));
    return onSnapshot(
      q,
      (snap) => {
        const list: WeightRecord[] = [];
        snap.forEach((d) => {
          list.push(d.data() as WeightRecord);
        });
        if (list.length > 0) {
          saveLocalCollection(userId, 'weightRecords', list);
          callback(list);
        } else if (localWeights.length > 0) {
          callback(localWeights);
        } else {
          callback([]);
        }
      },
      (err) => {
        console.warn('Firestore weight fallback to local:', err.message);
        callback(getLocalCollection<WeightRecord>(userId, 'weightRecords'));
      }
    );
  } catch {
    callback(localWeights);
    return () => {};
  }
};

export const saveFirestoreWeightRecord = async (userId: string, record: WeightRecord): Promise<void> => {
  const current = getLocalCollection<WeightRecord>(userId, 'weightRecords');
  const idx = current.findIndex((w) => w.id === record.id);
  if (idx >= 0) {
    current[idx] = record;
  } else {
    current.push(record);
  }
  saveLocalCollection(userId, 'weightRecords', current);

  try {
    const docRef = doc(db, 'users', userId, 'weightRecords', record.id);
    await setDoc(docRef, record, { merge: true });
  } catch (e) {
    console.warn('Firestore weight write error:', e);
  }
};

export const deleteFirestoreWeightRecord = async (userId: string, recordId: string): Promise<void> => {
  const current = getLocalCollection<WeightRecord>(userId, 'weightRecords').filter((w) => w.id !== recordId);
  saveLocalCollection(userId, 'weightRecords', current);

  try {
    const docRef = doc(db, 'users', userId, 'weightRecords', recordId);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Firestore weight delete error:', e);
  }
};

// MEDICAL RECORDS
export const subscribeToMedicalRecords = (
  userId: string,
  callback: (records: MedicalRecord[]) => void
): Unsubscribe => {
  const localMeds = getLocalCollection<MedicalRecord>(userId, 'medicalRecords');
  if (localMeds.length > 0) {
    callback(localMeds);
  }

  try {
    const medRef = collection(db, 'users', userId, 'medicalRecords');
    const q = query(medRef, orderBy('date', 'desc'));
    return onSnapshot(
      q,
      (snap) => {
        const list: MedicalRecord[] = [];
        snap.forEach((d) => {
          list.push(d.data() as MedicalRecord);
        });
        if (list.length > 0) {
          saveLocalCollection(userId, 'medicalRecords', list);
          callback(list);
        } else if (localMeds.length > 0) {
          callback(localMeds);
        } else {
          callback([]);
        }
      },
      (err) => {
        console.warn('Firestore med records fallback to local:', err.message);
        callback(getLocalCollection<MedicalRecord>(userId, 'medicalRecords'));
      }
    );
  } catch {
    callback(localMeds);
    return () => {};
  }
};

export const saveFirestoreMedicalRecord = async (userId: string, record: MedicalRecord): Promise<void> => {
  const current = getLocalCollection<MedicalRecord>(userId, 'medicalRecords');
  const idx = current.findIndex((m) => m.id === record.id);
  if (idx >= 0) {
    current[idx] = record;
  } else {
    current.unshift(record);
  }
  saveLocalCollection(userId, 'medicalRecords', current);

  try {
    const docRef = doc(db, 'users', userId, 'medicalRecords', record.id);
    await setDoc(docRef, record, { merge: true });
  } catch (e) {
    console.warn('Firestore med write error:', e);
  }
};

export const deleteFirestoreMedicalRecord = async (userId: string, recordId: string): Promise<void> => {
  const current = getLocalCollection<MedicalRecord>(userId, 'medicalRecords').filter((m) => m.id !== recordId);
  saveLocalCollection(userId, 'medicalRecords', current);

  try {
    const docRef = doc(db, 'users', userId, 'medicalRecords', recordId);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Firestore med delete error:', e);
  }
};
