import { Award, ExternalLink } from "lucide-react";

import { ElectricBorder } from "@/components/effects/ElectricBorder";
import { useSection } from "@/hooks/usePortfolioData";
import { Reveal, SectionHeading } from "./Reveal";

function formatDate(value: string) {
  const parsed = new Date(value.length === 7 ? `${value}-01` : value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function Certifications() {
  const { data: certifications = [] } = useSection("certifications");

  return (
    <section id="certifications" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Credentials"
          title="Certifications"
          description="Verified industry credentials across defensive and offensive security."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06} className="h-full">
              <ElectricBorder className="group h-full rounded-2xl p-6 glass glow-hover">
                <div
                  className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-primary/15 blur-2xl"
                  aria-hidden
                />
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-primary/25 bg-primary/8">
                    {c.badge ? (
                      <img src={c.badge} alt="" className="size-full object-cover" loading="lazy" />
                    ) : (
                      <Award className="size-5 text-primary" />
                    )}
                  </span>
                  <span className="rounded-full border border-accent3/30 bg-accent3/8 px-2.5 py-1 font-mono text-[10px] tracking-wider text-accent3 uppercase">
                    Verified
                  </span>
                </div>
                <h3 className="mt-5 font-display text-base font-semibold text-foreground">
                  {c.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.issuer}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatDate(c.issuedDate)}
                  </span>
                  {c.credentialUrl ? (
                    <a
                      href={c.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                    >
                      Credential <ExternalLink className="size-3" />
                    </a>
                  ) : null}
                </div>
              </ElectricBorder>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
