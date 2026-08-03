import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { getDb, isFirebaseConfigured } from "./firebase";
import { mockData } from "./mock-data";
import type { Section, SectionTypeMap } from "./types";

/**
 * Reads a content collection from Firestore. When Firebase credentials are not
 * configured (or the request fails) the curated mock data is returned instead,
 * so the portfolio always renders complete content.
 */
export async function fetchSection<S extends Section>(section: S): Promise<SectionTypeMap[S][]> {
  const db = getDb();
  if (!isFirebaseConfigured || !db) {
    return mockData[section] as SectionTypeMap[S][];
  }
  try {
    const snap = await getDocs(query(collection(db, section), orderBy("order", "asc")));
    if (snap.empty) return mockData[section] as SectionTypeMap[S][];
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SectionTypeMap[S]);
  } catch {
    try {
      const snap = await getDocs(collection(db, section));
      if (snap.empty) return mockData[section] as SectionTypeMap[S][];
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SectionTypeMap[S]);
    } catch {
      return mockData[section] as SectionTypeMap[S][];
    }
  }
}

function assertDb() {
  const db = getDb();
  if (!db) {
    throw new Error(
      "Firebase is not configured. Add your VITE_FIREBASE_* keys to enable saving content.",
    );
  }
  return db;
}

export async function createItem<S extends Section>(
  section: S,
  data: Omit<SectionTypeMap[S], "id">,
): Promise<string> {
  const db = assertDb();
  const ref = await addDoc(collection(db, section), data as Record<string, unknown>);
  return ref.id;
}

export async function updateItem<S extends Section>(
  section: S,
  id: string,
  data: Partial<SectionTypeMap[S]>,
): Promise<void> {
  const db = assertDb();
  const { id: _omit, ...rest } = data as Record<string, unknown> & { id?: string };
  void _omit;
  await updateDoc(doc(db, section, id), rest);
}

export async function deleteItem(section: Section, id: string): Promise<void> {
  const db = assertDb();
  await deleteDoc(doc(db, section, id));
}