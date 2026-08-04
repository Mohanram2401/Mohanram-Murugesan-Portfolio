import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, ChevronDown, GraduationCap, MapPin } from "lucide-react";
import { useState } from "react";

import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { useSection, useSettings } from "@/hooks/usePortfolioData";
import { Reveal, SectionHeading } from "./Reveal";

interface Node {
  id: string;
  title: string;
  subtitle: string;
  meta?: string;
  period: string;
  logo?: string;
  bullets: string[];
}

function TimelineNode({ node, index, kind }: { node: Node; index: number; kind: "work" | "edu" }) {
  const [open, setOpen] = useState(index === 0);
  const Icon = kind === "work" ? Briefcase : GraduationCap;

  return (
    <Reveal delay={index * 0.06} className="relative pl-12">
      <span className="absolute left-[13px] top-6 grid size-4 place-items-center">
        <span className="absolute size-4 rounded-full bg-primary/25 blur-[6px]" />
        <span className="size-2.5 rounded-full bg-gradient-brand shadow-[0_0_14px_var(--primary)]" />
      </span>
      <SpotlightCard className="rounded-2xl p-5 glass glow-hover sm:p-6">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-start justify-between gap-4 text-left"
        >
          <div className="flex items-start gap-4">
            <span className="hidden size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-border/60 bg-secondary/50 sm:grid">
              {node.logo ? (
                <img src={node.logo} alt="" className="size-full object-cover" loading="lazy" />
              ) : (
                <Icon className="size-5 text-primary" />
              )}
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-foreground sm:text-lg">
                {node.title}
              </h3>
              <p className="mt-0.5 text-sm text-primary">{node.subtitle}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
                <span>{node.period}</span>
                {node.meta ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" />
                    {node.meta}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`mt-1 size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && node.bullets.length > 0 && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2.5 border-t border-border/60 pt-4">
                {node.bullets.map((b) => (
                  <li key={b.slice(0, 24)} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent3 shadow-[0_0_10px_var(--accent3)]" />
                    {b}
                  </li>
                ))}
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </SpotlightCard>
    </Reveal>
  );
}

export function Timeline() {
  const { data: experience = [] } = useSection("experience");
  const { data: education = [] } = useSection("education");
  const { data: settings } = useSettings();
  const visible = settings?.visibleSections;
  const showExp = visible?.experience ?? true;
  const showEdu = visible?.education ?? true;

  const work: Node[] = experience.map((e) => ({
    id: e.id,
    title: e.role,
    subtitle: e.company,
    ...(e.location ? { meta: e.location } : {}),
    period: `${e.startDate} — ${e.endDate ?? "Present"}`,
    ...(e.logo ? { logo: e.logo } : {}),
    bullets: e.bullets ?? [],
  }));

  const study: Node[] = education.map((e) => ({
    id: e.id,
    title: e.degree,
    subtitle: e.institution,
    period: `${e.startDate} — ${e.endDate ?? "Present"}`,
    ...(e.logo ? { logo: e.logo } : {}),
    bullets: e.details ? [e.details] : [],
  }));

  const groups = [
    showExp ? { label: "Experience", nodes: work, kind: "work" as const } : null,
    showEdu ? { label: "Education", nodes: study, kind: "edu" as const } : null,
  ].filter(Boolean) as { label: string; nodes: Node[]; kind: "work" | "edu" }[];

  return (
    <section id="experience" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Journey"
          title="Experience & Education"
          description="Roles, milestones and the training behind them. Tap any node to expand."
        />
        <div className={`grid gap-12 ${groups.length > 1 ? "lg:grid-cols-2" : ""}`}>
          {groups.map((group) => (
            <div key={group.label}>
              <h3 className="mb-6 font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
                {group.label}
              </h3>
              <div className="relative space-y-5">
                <span
                  className="absolute left-[19px] top-2 bottom-2 w-1 rounded-full blur-[6px]"
                  style={{
                    background:
                      "linear-gradient(to bottom, var(--primary), var(--accent2), transparent)",
                    opacity: 0.2,
                  }}
                  aria-hidden
                />
                <span className="absolute left-[20px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-accent2/40 to-transparent" />
                {group.nodes.map((n, i) => (
                  <TimelineNode key={n.id} node={n} index={i} kind={group.kind} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
