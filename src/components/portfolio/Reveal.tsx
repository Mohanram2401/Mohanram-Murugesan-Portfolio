import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { ShinyText } from "@/components/effects/ShinyText";
import { TextGenerate } from "@/components/effects/TextGenerate";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="mx-auto mb-14 max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-primary">
        <span className="size-1.5 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
        <ShinyText text={eyebrow} speed={7} />
      </span>
      <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        <TextGenerate text={title} />
      </h2>
      {description ? (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 text-base text-muted-foreground"
        >
          {description}
        </motion.p>
      ) : null}
    </Reveal>
  );
}
