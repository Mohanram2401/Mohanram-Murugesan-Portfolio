import { motion } from "framer-motion";
import { ArrowRight, FileText, Github, Linkedin, Mail, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

import { profile } from "@/lib/profile";
import { ParticleField } from "./ParticleField";

function RotatingRole() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setIndex((i) => (i + 1) % profile.roles.length), 2600);
    return () => window.clearInterval(t);
  }, []);
  return (
    <span className="relative inline-flex h-[1.25em] overflow-hidden align-bottom">
      <motion.span
        key={index}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-gradient animate-shimmer whitespace-nowrap"
      >
        {profile.roles[index]}
      </motion.span>
    </span>
  );
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  return (
    <section id="hero" className="relative isolate overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="absolute inset-0 -z-20 grid-bg opacity-60" aria-hidden />
      <div className="absolute inset-0 -z-10" aria-hidden>
        <ParticleField />
      </div>
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[42rem] -translate-x-1/2 rounded-full bg-primary/18 blur-[140px] animate-orb"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-40 -z-10 size-[28rem] rounded-full bg-accent2/18 blur-[130px] animate-orb"
        style={{ animationDelay: "-6s" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 -z-10 size-[24rem] rounded-full bg-accent3/14 blur-[120px] animate-orb"
        style={{ animationDelay: "-11s" }}
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 font-mono text-xs text-primary"
        >
          <Terminal className="size-3.5" />
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          Available for security engagements
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-4xl font-display text-4xl leading-[1.05] font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          {profile.name}
          <span className="mt-2 block text-2xl sm:text-4xl lg:text-5xl">
            <RotatingRole />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <button
            onClick={() => scrollTo("projects")}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-background shadow-[0_16px_50px_-18px_var(--primary)] transition-transform hover:-translate-y-0.5"
          >
            Explore Projects
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
          <a
            href={profile.resumeUrl}
            className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/40 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-primary"
          >
            <FileText className="size-4" />
            View Resume
          </a>
          <button
            onClick={() => scrollTo("contact")}
            className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/40 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:border-accent2/50 hover:text-accent2"
          >
            <Mail className="size-4" />
            Get in Touch
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 flex items-center gap-3"
        >
          {[
            { href: profile.github, Icon: Github, label: "GitHub" },
            { href: profile.linkedin, Icon: Linkedin, label: "LinkedIn" },
            { href: `mailto:${profile.email}`, Icon: Mail, label: "Email" },
          ].map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="grid size-10 place-items-center rounded-xl border border-border/70 bg-card/40 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {profile.stats.map((s) => (
            <div key={s.label} className="rounded-2xl p-5 glass glow-hover">
              <dt className="font-display text-2xl font-bold text-gradient sm:text-3xl">
                {s.value}
              </dt>
              <dd className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
                {s.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}