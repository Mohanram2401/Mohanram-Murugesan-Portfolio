import { motion } from "framer-motion";
import { Cpu, Database, Layers, Server, ShieldCheck, Wrench } from "lucide-react";

import { useSection } from "@/hooks/usePortfolioData";
import { profile } from "@/lib/profile";
import type { Skill } from "@/lib/types";
import { Reveal, SectionHeading } from "./Reveal";

const categoryMeta: Record<string, { icon: typeof Cpu; accent: string }> = {
  Frontend: { icon: Layers, accent: "var(--primary)" },
  Backend: { icon: Server, accent: "var(--accent2)" },
  Database: { icon: Database, accent: "var(--accent3)" },
  Security: { icon: ShieldCheck, accent: "var(--primary)" },
  Tools: { icon: Wrench, accent: "var(--accent2)" },
};

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  return (
    <div className="group">
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-foreground/90 transition-colors group-hover:text-primary">
          {skill.name}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary/60">
        <motion.div
          className="h-full rounded-full bg-gradient-brand"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export function About() {
  const { data: skills = [] } = useSection("skills");
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 size-[34rem] -translate-x-1/2 rounded-full bg-accent2/10 blur-[150px]"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="About"
          title="Security engineering, end to end"
          description="From detection pipelines to exploit chains — here's how I work and what I work with."
        />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.4fr]">
          <Reveal className="rounded-3xl p-8 glass glow-hover">
            <Cpu className="size-6 text-primary" />
            <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
              {profile.title}
            </h3>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {profile.about.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {["Threat Hunting", "Incident Response", "Detection Engineering", "VAPT"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-primary/25 bg-primary/8 px-3 py-1 font-mono text-xs text-primary"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {categories.map((category, ci) => {
              const meta = categoryMeta[category] ?? { icon: Wrench, accent: "var(--primary)" };
              const Icon = meta.icon;
              const items = skills.filter((s) => s.category === category);
              return (
                <Reveal key={category} delay={ci * 0.08} className="rounded-3xl p-6 glass glow-hover">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid size-9 place-items-center rounded-xl border border-border/60"
                      style={{ background: `color-mix(in oklab, ${meta.accent} 14%, transparent)` }}
                    >
                      <Icon className="size-4" style={{ color: meta.accent }} />
                    </span>
                    <h4 className="font-display text-sm font-semibold tracking-wide text-foreground uppercase">
                      {category}
                    </h4>
                  </div>
                  <div className="mt-5 space-y-4">
                    {items.map((s, i) => (
                      <SkillBar key={s.id} skill={s} index={i} />
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}