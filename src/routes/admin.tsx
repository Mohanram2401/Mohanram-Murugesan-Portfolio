import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, LogOut, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { LoginCard } from "@/components/admin/LoginCard";
import { ProfileSettings } from "@/components/admin/ProfileSettings";
import { ResumesManager } from "@/components/admin/ResumesManager";
import { SectionManager } from "@/components/admin/SectionManager";
import { sectionConfigs } from "@/components/admin/sections-config";
import { VisibilitySettings } from "@/components/admin/VisibilitySettings";
import { useAuth } from "@/hooks/useAuth";
import type { Section } from "@/lib/types";

type AdminTab = Section | "profile" | "visibility" | "resumes";

const tabLabel = (key: AdminTab) =>
  key === "profile"
    ? "Profile & Hero"
    : key === "visibility"
      ? "Visibility"
      : key === "resumes"
        ? "Resumes"
        : (sectionConfigs.find((s) => s.key === key)?.label ?? key);

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
  const navigate = useNavigate();
  const [active, setActive] = useState<AdminTab>(sectionConfigs[0]!.key);

  /* Fixed X button — closes the admin panel and returns to the portfolio */
  const closeButton = (
    <motion.button
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 22 }}
      onClick={() => void navigate({ to: "/" })}
      aria-label="Back to portfolio"
      title="Back to portfolio"
      className="fixed right-5 top-5 z-50 grid size-11 place-items-center rounded-full border border-accent3/40 bg-background/60 text-muted-foreground shadow-lg shadow-black/25 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-accent3/70 hover:text-accent3 hover:shadow-[0_0_22px_-4px_var(--accent3)]"
    >
      <X className="size-4" />
    </motion.button>
  );

  if (loading) {
    return (
      <>
        {closeButton}
        <div className="grid min-h-screen place-items-center text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </>
    );
  }

  if (!user) return <LoginCard closeButton={closeButton} />;

  const contentTab =
    active === "profile" || active === "visibility" || active === "resumes"
      ? null
      : (sectionConfigs.find((s) => s.key === active) ?? null);

  return (
    <>
      {closeButton}
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
            {[
              ...sectionConfigs.map((s) => s.key as AdminTab),
              "resumes" as const,
              "profile" as const,
              "visibility" as const,
            ].map((key) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`relative shrink-0 rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                  active === key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active === key && (
                  <motion.span
                    layoutId="admin-pill"
                    className="absolute inset-0 rounded-xl bg-primary/12 ring-1 ring-primary/30"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{tabLabel(key)}</span>
              </button>
            ))}
          </nav>

          <main>
            {active === "profile" ? (
              <ProfileSettings />
            ) : active === "visibility" ? (
              <VisibilitySettings />
            ) : active === "resumes" ? (
              <ResumesManager />
            ) : contentTab ? (
              <SectionManager key={contentTab.key} config={contentTab} />
            ) : null}
          </main>
        </div>
      </div>
    </>
  );
}
