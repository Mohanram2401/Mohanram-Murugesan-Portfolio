import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Github, Linkedin, Lock, Mail } from "lucide-react";

import { ShinyText } from "@/components/effects/ShinyText";
import { useSettings } from "@/hooks/usePortfolioData";
import { defaultSettings } from "@/lib/profile";

export function Footer() {
  const navigate = useNavigate();
  const { data: settings } = useSettings();
  const p = settings ?? defaultSettings;

  const socials = [
    p.github ? { href: p.github, Icon: Github, label: "GitHub" } : null,
    p.linkedin ? { href: p.linkedin, Icon: Linkedin, label: "LinkedIn" } : null,
    p.email ? { href: `mailto:${p.email}`, Icon: Mail, label: "Email" } : null,
  ].filter(Boolean) as { href: string; Icon: typeof Github; label: string }[];

  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {p.name}. Built with{" "}
          <ShinyText text="React, Tailwind & Framer Motion" speed={6} />.
        </p>
        <div className="flex items-center gap-3">
          {socials.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Icon className="size-4" />
            </a>
          ))}

          {/* Divider — separates socials from the admin access */}
          <span className="mx-1 hidden h-4 w-px bg-border/60 sm:block" aria-hidden />

          {/* Admin access — minimalist glass lock */}
          <motion.button
            onClick={() => void navigate({ to: "/admin" })}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            aria-label="Admin access"
            title="Admin"
            className="group relative grid size-10 place-items-center rounded-full border border-accent3/40 bg-background/40 shadow-lg shadow-black/25 backdrop-blur-md transition-[box-shadow,border-color,background-color] duration-300 hover:border-accent3/70 hover:bg-background/60 hover:shadow-[0_0_22px_-2px_var(--accent3)]"
          >
            {/* Soft inner halo */}
            <span
              className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ boxShadow: "inset 0 0 14px -4px var(--accent3)" }}
              aria-hidden
            />
            <Lock className="relative size-4 text-white/85 transition-colors duration-300 group-hover:text-accent3" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
