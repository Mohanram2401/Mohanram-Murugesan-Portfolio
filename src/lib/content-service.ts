import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { getDb, getFirebaseAuth, isFirebaseConfigured } from "./firebase";
import { mockData } from "./mock-data";
import { defaultSettings } from "./profile";
import type { Resume, Section, SectionTypeMap, Settings } from "./types";

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

/* ------------------------------------------------------------------ */
/* Settings (profile, hero, visibility)                                */
/* ------------------------------------------------------------------ */

const SETTINGS_DOC = "settings/profile";

/** Merges a partial Firestore document over the defaults so new fields never go missing. */
function mergeSettings(partial: Partial<Settings>): Settings {
  return {
    ...defaultSettings,
    ...partial,
    visibleSections: {
      ...defaultSettings.visibleSections,
      ...(partial.visibleSections ?? {}),
    },
    stats:
      Array.isArray(partial.stats) && partial.stats.length ? partial.stats : defaultSettings.stats,
    roles: Array.isArray(partial.roles) ? partial.roles : defaultSettings.roles,
    about: Array.isArray(partial.about) ? partial.about : defaultSettings.about,
    showResume: partial.showResume ?? defaultSettings.showResume,
  };
}

/**
 * Reads the `settings/profile` document from Firestore. When Firebase is not
 * configured or the read fails, the curated default settings are returned so
 * the portfolio always renders complete content.
 */
export async function fetchSettings(): Promise<Settings> {
  const db = getDb();
  if (!isFirebaseConfigured || !db) return defaultSettings;
  try {
    const [path, id] = SETTINGS_DOC.split("/") as [string, string];
    const snap = await getDoc(doc(db, path, id));
    if (!snap.exists()) return defaultSettings;
    return mergeSettings(snap.data() as Partial<Settings>);
  } catch {
    return defaultSettings;
  }
}
/** Persists the full settings document (replaces the previous one). */
export async function saveSettings(settings: Settings): Promise<void> {
  const db = assertDb();

  // Verify the user is signed in before writing.
  const auth = getFirebaseAuth();
  if (!auth?.currentUser) {
    throw new Error(
      "You're not signed in to Firebase Auth. Please sign out and sign in again, then retry.",
    );
  }

  const [path, id] = SETTINGS_DOC.split("/") as [string, string];
  await setDoc(doc(db, path, id), settings);
}

/**
 * Diagnostic helper — writes a throwaway document to `settings/_test` and
 * returns a short status string so the admin UI can show what Firestore
 * actually returned. Used to distinguish rules errors from browser blocking.
 */
export async function testFirestoreWrite(): Promise<string> {
  const db = assertDb();
  const auth = getFirebaseAuth();
  if (!auth?.currentUser) return "not-signed-in";
  try {
    await setDoc(doc(db, "settings", "_test"), { ok: true, at: Date.now() });
    return "ok";
  } catch (err) {
    return err instanceof Error ? err.message : "unknown error";
  }
}
/* ------------------------------------------------------------------ */
/* File uploads (Cloudinary free tier)                                 */
/* ------------------------------------------------------------------ */

const CLOUDINARY_CLOUD_NAME = import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"] as string | undefined;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env["VITE_CLOUDINARY_UPLOAD_PRESET"] as
  string | undefined;

/**
 * Uploads a file via Cloudinary's unsigned upload API (free tier — no Firebase
 * Storage needed, so no paid plan required) and returns the secure URL.
 *
 * Images go through the `image` endpoint, documents through the `raw` endpoint.
 * Requires a Cloudinary account with an unsigned upload preset:
 *   VITE_CLOUDINARY_CLOUD_NAME=<your cloud name>
 *   VITE_CLOUDINARY_UPLOAD_PRESET=<your unsigned preset>
 */
export async function uploadFile(folder: string, file: File): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary isn't configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your environment.",
    );
  }

  const resourceType = file.type.startsWith("image/") ? "image" : "raw";
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

  const body = new FormData();
  body.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  body.append("folder", folder);
  body.append("file", file);

  const res = await fetch(endpoint, { method: "POST", body });
  if (!res.ok) {
    let detail = `Upload failed (${res.status})`;
    try {
      const data = (await res.json()) as { error?: { message?: string } };
      if (data.error?.message) detail = data.error.message;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(detail);
  }

  const data = (await res.json()) as { secure_url?: string; url?: string };
  const url = data.secure_url ?? data.url;
  if (!url) throw new Error("Upload succeeded but no URL was returned.");
  return url;
}

/* ------------------------------------------------------------------ */
/* Resumes                                                             */
/* ------------------------------------------------------------------ */

export async function fetchResumes(): Promise<Resume[]> {
  const db = getDb();
  if (!isFirebaseConfigured || !db) return [];
  try {
    const snap = await getDocs(query(collection(db, "resumes"), orderBy("order", "asc")));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Resume);
  } catch {
    return [];
  }
}

export async function createResume(data: Omit<Resume, "id">): Promise<string> {
  const db = assertDb();
  const ref = await addDoc(collection(db, "resumes"), data as Record<string, unknown>);
  return ref.id;
}

export async function updateResume(id: string, data: Partial<Resume>): Promise<void> {
  const db = assertDb();
  const { id: _omit, ...rest } = data as Record<string, unknown> & { id?: string };
  void _omit;
  await updateDoc(doc(db, "resumes", id), rest);
}

export async function deleteResume(id: string): Promise<void> {
  const db = assertDb();
  await deleteDoc(doc(db, "resumes", id));
}
