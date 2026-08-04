import { useSection } from "@/hooks/usePortfolioData";
import { MarqueeCarousel } from "@/components/effects/MarqueeCarousel";
import { Reveal } from "./Reveal";

/**
 * Cursor-steered tech marquee. The strip scrolls continuously and shifts as
 * the pointer moves across it.
 */
export function TechMarquee() {
  const { data: skills = [] } = useSection("skills");
  const items = skills.slice(0, 20);

  return (
    <section className="relative py-6" aria-label="Skills marquee">
      <Reveal>
        <MarqueeCarousel speed={30}>
          {(copy) =>
            items.map((s) => (
              <span
                key={`${s.id}-${copy}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/20 bg-primary/6 px-5 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <span className="size-1.5 rounded-full bg-primary/70 shadow-[0_0_8px_var(--primary)]" />
                {s.name}
              </span>
            ))
          }
        </MarqueeCarousel>
      </Reveal>
    </section>
  );
}
