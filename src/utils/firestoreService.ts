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
 * All data queries are strictly scoped to `users/{userId}/...`
 * This ensures 100% data isolation where no user can see or edit another user's rabbits or health logs.
 */

export const getFirestoreRabbits = async (userId: string): Promise<Rabbit[]> => {
  try {
    const rabbitsRef = collection(db, 'users', userId, 'rabbits');
    const snap = await getDocs(rabbitsRef);
    const list: Rabbit[] = [];
    snap.forEach((d) => {
      list.push(d.data() as Rabbit);
    });
    return list;
  } catch (err) {
    console.error('Error fetching rabbits from Firestore:', err);
    return [];
  }
};

export const subscribeToUserRabbits = (
  userId: string,
  callback: (rabbits: Rabbit[]) => void
): Unsubscribe => {
  const rabbitsRef = collection(db, 'users', userId, 'rabbits');
  return onSnapshot(rabbitsRef, (snap) => {
    const list: Rabbit[] = [];
    snap.forEach((d) => {
      list.push(d.data() as Rabbit);
    });
    callback(list);
  }, (err) => {
    console.error('Snapshot error for rabbits:', err);
  });
};

export const saveFirestoreRabbit = async (userId: string, rabbit: Rabbit): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'rabbits', rabbit.id);
  await setDoc(docRef, rabbit, { merge: true });
};

export const deleteFirestoreRabbit = async (userId: string, rabbitId: string): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'rabbits', rabbitId);
  await deleteDoc(docRef);
};

// Health Logs
export const subscribeToHealthLogs = (
  userId: string,
  callback: (logs: DailyHealthLog[]) => void
): Unsubscribe => {
  const logsRef = collection(db, 'users', userId, 'healthLogs');
  const q = query(logsRef, orderBy('date', 'desc'));
  return onSnapshot(q, (snap) => {
    const list: DailyHealthLog[] = [];
    snap.forEach((d) => {
      list.push(d.data() as DailyHealthLog);
    });
    callback(list);
  }, (err) => {
    console.error('Snapshot error for health logs:', err);
  });
};

export const saveFirestoreHealthLog = async (userId: string, log: DailyHealthLog): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'healthLogs', log.id);
  await setDoc(docRef, log, { merge: true });
};

export const deleteFirestoreHealthLog = async (userId: string, logId: string): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'healthLogs', logId);
  await deleteDoc(docRef);
};

// Weight Records
export const subscribeToWeightRecords = (
  userId: string,
  callback: (weights: WeightRecord[]) => void
): Unsubscribe => {
  const weightRef = collection(db, 'users', userId, 'weightRecords');
  const q = query(weightRef, orderBy('date', 'asc'));
  return onSnapshot(q, (snap) => {
    const list: WeightRecord[] = [];
    snap.forEach((d) => {
      list.push(d.data() as WeightRecord);
    });
    callback(list);
  }, (err) => {
    console.error('Snapshot error for weight records:', err);
  });
};

export const saveFirestoreWeightRecord = async (userId: string, record: WeightRecord): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'weightRecords', record.id);
  await setDoc(docRef, record, { merge: true });
};

export const deleteFirestoreWeightRecord = async (userId: string, recordId: string): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'weightRecords', recordId);
  await deleteDoc(docRef);
};

// Medical Records
export const subscribeToMedicalRecords = (
  userId: string,
  callback: (records: MedicalRecord[]) => void
): Unsubscribe => {
  const medRef = collection(db, 'users', userId, 'medicalRecords');
  const q = query(medRef, orderBy('date', 'desc'));
  return onSnapshot(q, (snap) => {
    const list: MedicalRecord[] = [];
    snap.forEach((d) => {
      list.push(d.data() as MedicalRecord);
    });
    callback(list);
  }, (err) => {
    console.error('Snapshot error for medical records:', err);
  });
};

export const saveFirestoreMedicalRecord = async (userId: string, record: MedicalRecord): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'medicalRecords', record.id);
  await setDoc(docRef, record, { merge: true });
};

export const deleteFirestoreMedicalRecord = async (userId: string, recordId: string): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'medicalRecords', recordId);
  await deleteDoc(docRef);
};
