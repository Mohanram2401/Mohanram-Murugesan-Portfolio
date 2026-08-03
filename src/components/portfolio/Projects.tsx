import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Github, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";

import { useSection } from "@/hooks/usePortfolioData";
import type { Project } from "@/lib/types";
import { Reveal, SectionHeading } from "./Reveal";

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-3xl glass glow-hover"
    >
      <button onClick={onOpen} className="relative aspect-16/10 overflow-hidden text-left">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-108"
          />
        ) : (
          <div className="grid size-full place-items-center bg-secondary/50">
            <Sparkles className="size-8 text-primary/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        {project.featured ? (
          <span className="absolute left-4 top-4 rounded-full border border-primary/40 bg-background/70 px-3 py-1 font-mono text-[10px] tracking-wider text-primary uppercase backdrop-blur">
            Featured
          </span>
        ) : null}
      </button>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-md border border-border/70 bg-secondary/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={onOpen}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/12 px-3 py-2 text-xs font-medium text-primary ring-1 ring-primary/25 transition-colors hover:bg-primary/20"
          >
            Case study
            <ArrowUpRight className="size-3.5" />
          </button>
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-accent3/50 hover:text-accent3"
            >
              Live demo
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              className="grid size-8 place-items-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Github className="size-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  const { data: projects = [] } = useSection("projects");
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<Project | null>(null);

  const tags = useMemo(
    () => ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags ?? [])))],
    [projects],
  );
  const visible = filter === "All" ? projects : projects.filter((p) => p.tags?.includes(filter));

  return (
    <section id="projects" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute right-0 top-1/4 -z-10 size-[30rem] rounded-full bg-accent3/10 blur-[150px]"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Work"
          title="Projects & Builds"
          description="Security tooling, automation platforms and product engineering — filter by stack."
        />

        <Reveal className="mb-10 flex flex-wrap justify-center gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                filter === tag
                  ? "text-background"
                  : "border border-border/70 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {filter === tag && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-gradient-brand"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative font-medium">{tag}</span>
            </button>
          ))}
        </Reveal>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={() => setActive(p)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-70 grid place-items-center bg-background/80 p-4 backdrop-blur-md"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl glass shadow-2xl"
            >
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border border-border/70 bg-background/70 text-foreground backdrop-blur transition-colors hover:text-primary"
              >
                <X className="size-4" />
              </button>
              {active.image ? (
                <div className="relative aspect-16/9 overflow-hidden">
                  <img src={active.image} alt={active.title} className="size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>
              ) : null}
              <div className="p-7">
                <h3 className="font-display text-2xl font-bold text-foreground">{active.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {active.longDescription ?? active.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {active.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-primary/25 bg-primary/8 px-2.5 py-1 font-mono text-[11px] text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  {active.demoUrl ? (
                    <a
                      href={active.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-background"
                    >
                      Live demo <ArrowUpRight className="size-4" />
                    </a>
                  ) : null}
                  {active.githubUrl ? (
                    <a
                      href={active.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-border/70 px-4 py-2.5 text-sm text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      <Github className="size-4" /> Source
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}