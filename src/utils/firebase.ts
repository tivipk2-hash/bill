import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { SavedInvoiceRecord } from '../types';
import { SAMPLE_INVOICES } from './storage';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom database ID if specified in config
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const INVOICES_COLLECTION = 'invoices';

let isSeeding = false;
export const seedInitialSamplesIfEmpty = async (): Promise<void> => {
  if (isSeeding) return;
  try {
    const q = collection(db, INVOICES_COLLECTION);
    const snap = await getDocs(q);
    if (snap.empty) {
      isSeeding = true;
      for (const sample of SAMPLE_INVOICES) {
        const docRef = doc(db, INVOICES_COLLECTION, sample.id);
        await setDoc(docRef, sample, { merge: true });
      }
    }
  } catch (err) {
    console.warn('Could not seed initial samples to Firestore:', err);
  } finally {
    isSeeding = false;
  }
};

/**
 * Save invoice record directly to Firestore cloud database
 */
export const saveInvoiceToCloud = async (record: SavedInvoiceRecord): Promise<void> => {
  try {
    const docRef = doc(db, INVOICES_COLLECTION, record.id);
    const payload = {
      ...record,
      updatedAt: Date.now(),
      createdAt: record.createdAt || Date.now(),
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    console.error('Error saving invoice to Firestore:', error);
    throw error;
  }
};

/**
 * Delete invoice record from Firestore cloud database
 */
export const deleteInvoiceFromCloud = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, INVOICES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting invoice from Firestore:', error);
    throw error;
  }
};

/**
 * Fetch all invoices from Firestore cloud database
 */
export const fetchInvoicesFromCloud = async (): Promise<SavedInvoiceRecord[]> => {
  try {
    const q = query(collection(db, INVOICES_COLLECTION), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    const records: SavedInvoiceRecord[] = [];
    snapshot.forEach((docSnap) => {
      records.push(docSnap.data() as SavedInvoiceRecord);
    });
    return records;
  } catch (error) {
    console.error('Error fetching invoices from Firestore:', error);
    return [];
  }
};

/**
 * Real-time subscription to Firestore invoices collection
 */
export const subscribeToCloudInvoices = (
  onUpdate: (invoices: SavedInvoiceRecord[]) => void,
  onError?: (error: Error) => void
) => {
  try {
    const q = query(collection(db, INVOICES_COLLECTION), orderBy('updatedAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          seedInitialSamplesIfEmpty().catch(() => {});
        }
        const records: SavedInvoiceRecord[] = [];
        snapshot.forEach((docSnap) => {
          records.push(docSnap.data() as SavedInvoiceRecord);
        });
        onUpdate(records);
      },
      (err) => {
        console.error('Firestore snapshot listener error:', err);
        if (onError) onError(err);
      }
    );
  } catch (error) {
    console.error('Failed to subscribe to cloud invoices:', error);
    return () => {};
  }
};
