import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env['VITE_FIREBASE_API_KEY'] as string | undefined,
  authDomain: import.meta.env['VITE_FIREBASE_AUTH_DOMAIN'] as string | undefined,
  projectId: import.meta.env['VITE_FIREBASE_PROJECT_ID'] as string | undefined,
  storageBucket: import.meta.env['VITE_FIREBASE_STORAGE_BUCKET'] as string | undefined,
  messagingSenderId: import.meta.env['VITE_FIREBASE_MESSAGING_SENDER_ID'] as string | undefined,
  appId: import.meta.env['VITE_FIREBASE_APP_ID'] as string | undefined,
};

/** True only when every required key is present. Drives the mock-data fallback. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (!app) {
    app = getApps().length
      ? getApp()
      : initializeApp({
          apiKey: firebaseConfig.apiKey ?? "",
          authDomain: firebaseConfig.authDomain ?? "",
          projectId: firebaseConfig.projectId ?? "",
          storageBucket: firebaseConfig.storageBucket ?? "",
          messagingSenderId: firebaseConfig.messagingSenderId ?? "",
          appId: firebaseConfig.appId ?? "",
        });
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!authInstance) authInstance = getAuth(a);
  return authInstance;
}

export function getDb(): Firestore | null {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!dbInstance) dbInstance = getFirestore(a);
  return dbInstance;
}