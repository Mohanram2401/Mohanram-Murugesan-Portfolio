import { motion } from "framer-motion";
import { KeyRound, Loader2, Lock, Mail, ShieldAlert, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";

export function LoginCard({ closeButton }: { closeButton?: React.ReactNode }) {
  const { signIn, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

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

  const field =
    "w-full rounded-xl border border-border/70 bg-secondary/30 py-3 pl-10 pr-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

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
          {/* X close button — returns to the portfolio */}
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 22 }}
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = "/";
              }
            }}
            aria-label="Back to portfolio"
            title="Back to portfolio"
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-xl border border-border/70 bg-secondary/50 text-muted-foreground transition-all duration-300 hover:border-accent3/70 hover:bg-accent3/10 hover:text-accent3"
          >
            <X className="size-4" />
          </motion.button>

          <span className="grid size-12 place-items-center rounded-2xl bg-gradient-brand shadow-[0_0_28px_-6px_var(--primary)]">
            <KeyRound className="size-5 text-background" />
          </span>
          <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage projects, experience, education, certifications and skills.
          </p>

          {!configured ? (
            <div className="mt-5 flex gap-3 rounded-xl border border-accent2/30 bg-accent2/8 p-3.5 text-xs text-muted-foreground">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-accent2" />
              <span>
                Firebase keys aren't configured yet, so the dashboard runs in demo mode — any email
                with a 6+ character password signs you in locally.
              </span>
            </div>
          ) : null}

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
