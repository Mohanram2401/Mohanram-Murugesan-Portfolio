import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { LoginCard } from "@/components/admin/LoginCard";
import { SectionManager } from "@/components/admin/SectionManager";
import { sectionConfigs } from "@/components/admin/sections-config";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Mohanram Murugesan" },
      {
        name: "description",
        content:
          "Secure content management dashboard for projects, experience, education, certifications and skills.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard — Mohanram Murugesan" },
      { property: "og:description", content: "Secure portfolio content management." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading, signOutUser } = useAuth();
  const [active, setActive] = useState(sectionConfigs[0]!.key);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginCard />;

  const config = sectionConfigs.find((s) => s.key === active)!;

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 -z-10 grid-bg opacity-40" aria-hidden />
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-5">
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">Content Dashboard</h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <ArrowLeft className="size-4" /> Portfolio
            </Link>
            <button
              onClick={async () => {
                await signOutUser();
                toast.success("Signed out");
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {sectionConfigs.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`relative shrink-0 rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                active === s.key
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active === s.key && (
                <motion.span
                  layoutId="admin-pill"
                  className="absolute inset-0 rounded-xl bg-primary/12 ring-1 ring-primary/30"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </nav>

        <main>
          <SectionManager key={config.key} config={config} />
        </main>
      </div>
    </div>
  );
}