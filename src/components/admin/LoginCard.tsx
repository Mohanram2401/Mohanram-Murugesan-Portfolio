import { motion } from "framer-motion";
import { KeyRound, Loader2, Lock, Mail, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";

export function LoginCard({ closeButton }: { closeButton?: React.ReactNode }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const field =
    "w-full rounded-xl border border-border/70 bg-secondary/30 py-3 pl-10 pr-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      toast.success("Welcome back");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {closeButton}
      <div className="grid min-h-screen place-items-center px-6 py-24">
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 -z-10 size-[32rem] -translate-x-1/2 rounded-full bg-primary/14 blur-[150px]"
          aria-hidden
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md rounded-3xl p-8 glass shadow-2xl"
        >
          <span className="grid size-12 place-items-center rounded-2xl bg-gradient-brand shadow-[0_0_28px_-6px_var(--primary)]">
            <KeyRound className="size-5 text-background" />
          </span>
          <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage projects, experience, education, certifications and skills.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={field}
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={field}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-background disabled:opacity-75"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              Sign in
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
