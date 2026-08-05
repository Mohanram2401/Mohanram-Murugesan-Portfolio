import { motion } from "framer-motion";
import { ArrowRight, FileText, Github, Globe, Linkedin, Mail, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

import { ElectricBorder } from "@/components/effects/ElectricBorder";
import { Magnet } from "@/components/effects/Magnet";
import { Meteors } from "@/components/effects/Meteors";
import { Orb } from "@/components/effects/Orb";
import { OrbitImages } from "@/components/effects/OrbitImages";
import { ShinyText } from "@/components/effects/ShinyText";
import { ShapeBlur } from "@/components/effects/ShapeBlur";
import { SplashCursor } from "@/components/effects/SplashCursor";
import { Strands } from "@/components/effects/Strands";
import { GlobeModal } from "@/components/portfolio/GlobeModal";
import { useResumes, useSettings } from "@/hooks/usePortfolioData";
import { defaultSettings } from "@/lib/profile";
import { ParticleField } from "./ParticleField";

/* Orbiting tech badges — cybersecurity-flavoured stack (all visible on dark bg) */
const ORBIT_IMAGES = [
  {
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    alt: "Linux",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    alt: "Python",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg",
    alt: "Elastic Stack",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg",
    alt: "Grafana",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg",
    alt: "Kubernetes",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    alt: "Docker",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    alt: "Git",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg",
    alt: "Nginx",
  },
];

function RotatingRole({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (roles.length < 2) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), 2600);
    return () => window.clearInterval(t);
  }, [roles]);
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
        {roles[index] ?? roles[0]}
      </motion.span>
    </span>
  );
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  const { data: settings } = useSettings();
  const { data: resumes = [] } = useResumes();
  const p = settings ?? defaultSettings;
  const [imgError, setImgError] = useState(false);
  const [globeOpen, setGlobeOpen] = useState(false);

  const roles = p.roles?.length ? p.roles : [p.title];
  const socials = [
    p.github ? { href: p.github, Icon: Github, label: "GitHub" } : null,
    p.linkedin ? { href: p.linkedin, Icon: Linkedin, label: "LinkedIn" } : null,
    p.email ? { href: `mailto:${p.email}`, Icon: Mail, label: "Email" } : null,
  ].filter(Boolean) as { href: string; Icon: typeof Github; label: string }[];

  const showStats = p.showStats && p.stats.length > 0;
  const showProjects = p.visibleSections.projects;
  const showContact = p.visibleSections.contact;

  /* Active resume → "View Resume" button */
  const activeResume = resumes.find((r) => r.active) ?? null;
  const resumeHref =
    activeResume?.fileUrl && activeResume.fileUrl !== "#" ? activeResume.fileUrl : p.resumeUrl;
  const showResumeButton = p.showResume && Boolean(resumeHref);

  return (
    <section id="hero" className="relative isolate overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      {/* Background layers */}
      <div className="absolute inset-0 -z-20 grid-bg opacity-60" aria-hidden />
      <div className="absolute inset-0 -z-10" aria-hidden>
        <ParticleField />
        <Strands className="opacity-60" count={24} />
        <SplashCursor className="opacity-60" />
        <Meteors count={12} />
        <ShapeBlur />
      </div>
      <Orb
        className="absolute -top-48 left-1/2 -translate-x-1/2"
        size={672}
        color="var(--primary)"
        opacity={0.18}
      />
      <Orb className="absolute -right-40 top-32" size={448} color="var(--accent2)" opacity={0.14} />
      <Orb
        className="absolute -left-32 bottom-0"
        size={384}
        color="var(--accent3)"
        opacity={0.12}
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          {/* Left — text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 font-mono text-xs text-primary"
            >
              <Terminal className="size-3.5" />
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              <ShinyText text="Available for security engagements" speed={6} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-4xl font-display text-4xl leading-[1.05] font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            >
              {p.name}
              <span className="mt-2 block text-2xl sm:text-4xl lg:text-5xl">
                <RotatingRole roles={roles} />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18 }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {p.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Magnet strength={0.4}>
                {showProjects ? (
                  <button
                    onClick={() => scrollTo("projects")}
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-background shadow-[0_16px_50px_-18px_var(--primary)] transition-transform hover:-translate-y-0.5"
                  >
                    Explore Projects
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : null}
              </Magnet>
              <Magnet strength={0.35}>
                {showResumeButton ? (
                  <a
                    href={resumeHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/40 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <FileText className="size-4" />
                    View Resume
                  </a>
                ) : null}
              </Magnet>
              <Magnet strength={0.35}>
                {showContact ? (
                  <button
                    onClick={() => scrollTo("contact")}
                    className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/40 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:border-accent2/50 hover:text-accent2"
                  >
                    <Mail className="size-4" />
                    Get in Touch
                  </button>
                ) : null}
              </Magnet>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex items-center gap-3"
            >
              {socials.map(({ href, Icon, label }) => (
                <Magnet key={label} strength={0.5}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-xl border border-border/70 bg-card/40 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                  >
                    <Icon className="size-4" />
                  </a>
                </Magnet>
              ))}
            </motion.div>
          </div>

          {/* Right — profile photo with OrbitImages */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto flex items-center justify-center lg:mx-0"
          >
            <OrbitImages
              images={ORBIT_IMAGES}
              radius={188}
              size={44}
              duration={36}
              center={
                <button
                  onClick={() => setGlobeOpen(true)}
                  className="group relative block cursor-pointer outline-none"
                  aria-label="Open skills globe"
                >
                  <ElectricBorder className="rounded-full" ringWidth={2}>
                    <div className="relative size-52 overflow-hidden rounded-full bg-gradient-to-br from-primary/25 via-accent2/20 to-accent3/15 p-1 shadow-[0_0_60px_-12px_var(--primary)] transition-transform duration-500 group-hover:scale-[1.03]">
                      {imgError ? (
                        <div className="flex size-full items-center justify-center rounded-full bg-secondary/70 font-display text-5xl font-bold text-gradient">
                          {p.name.charAt(0)}
                        </div>
                      ) : (
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="size-full rounded-full object-cover"
                          onError={() => setImgError(true)}
                        />
                      )}
                    </div>
                  </ElectricBorder>
                </button>
              }
            />
          </motion.div>
        </div>

        {/* Stats row */}
        {showStats ? (
          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            {p.stats.map((s) => (
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
        ) : null}
      </div>
      <GlobeModal open={globeOpen} onClose={() => setGlobeOpen(false)} />
    </section>
  );
}
