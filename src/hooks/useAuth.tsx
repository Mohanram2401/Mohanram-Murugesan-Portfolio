import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

export interface AuthUser {
  uid: string;
  email: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_KEY = "portfolio-demo-admin";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const auth = getFirebaseAuth();

    if (!auth) {
      // Demo mode: no Firebase keys yet, keep a local-only session.
      const stored = window.sessionStorage.getItem(DEMO_KEY);
      setUser(stored ? { uid: "demo", email: stored } : null);
      setLoading(false);
      return;
    }

    let unsub: (() => void) | undefined;
    void import("firebase/auth").then(({ onAuthStateChanged }) => {
      if (!active) return;
      unsub = onAuthStateChanged(auth, (fbUser) => {
        setUser(fbUser ? { uid: fbUser.uid, email: fbUser.email } : null);
        setLoading(false);
      });
    });

    return () => {
      active = false;
      unsub?.();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configured: isFirebaseConfigured,
      signIn: async (email: string, password: string) => {
        const auth = getFirebaseAuth();
        if (!auth) {
          if (password.length < 6) throw new Error("Password must be at least 6 characters.");
          window.sessionStorage.setItem(DEMO_KEY, email);
          setUser({ uid: "demo", email });
          return;
        }
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        await signInWithEmailAndPassword(auth, email, password);
      },
      signOutUser: async () => {
        const auth = getFirebaseAuth();
        if (!auth) {
          window.sessionStorage.removeItem(DEMO_KEY);
          setUser(null);
          return;
        }
        const { signOut } = await import("firebase/auth");
        await signOut(auth);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
