import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";

/**
 * Firebase web configuration.
 *
 * Values are read from VITE_FIREBASE_* env vars (see .env.example) so they can
 * be overridden per environment. When a key is missing the live project config
 * below is used instead, which keeps the portfolio reading from Firestore out
 * of the box.
 */
const firebaseConfig = {
  apiKey:
    (import.meta.env["VITE_FIREBASE_API_KEY"] as string | undefined) ??
    "AIzaSyChgsyoRu-nA1-RJtMAZihJw2Gl_XmdHP0",
  authDomain:
    (import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] as string | undefined) ??
    "mohan-profile-beafa.firebaseapp.com",
  projectId:
    (import.meta.env["VITE_FIREBASE_PROJECT_ID"] as string | undefined) ?? "mohan-profile-beafa",
  storageBucket:
    (import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] as string | undefined) ??
    "mohan-profile-beafa.firebasestorage.app",
  messagingSenderId:
    (import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] as string | undefined) ?? "683130955395",
  appId:
    (import.meta.env["VITE_FIREBASE_APP_ID"] as string | undefined) ??
    "1:683130955395:web:f3e1839219f77f4e57ddb6",
};

/** True only when every required key is present. Drives the mock-data fallback. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

/** True when the Cloudinary env vars are present — needed for file uploads (photos & resumes). */
export const isCloudinaryConfigured = Boolean(
  (import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"] as string | undefined) &&
  (import.meta.env["VITE_CLOUDINARY_UPLOAD_PRESET"] as string | undefined),
);

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
  if (!dbInstance) {
    try {
      // experimentalForceLongPolling uses plain XHR long-polling instead of
      // WebChannel streaming, which avoids Edge / Brave Tracking Prevention
      // blocking the Firestore write channel (net::ERR_BLOCKED_BY_CLIENT).
      dbInstance = initializeFirestore(a, {
        experimentalForceLongPolling: true,
      });
    } catch {
      // initializeFirestore throws if the app was already initialised.
      dbInstance = getFirestore(a);
    }
  }
  return dbInstance;
}
