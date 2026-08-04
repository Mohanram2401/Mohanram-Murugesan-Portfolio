import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Cursor-scrubbable marquee carousel (react-bits Carousel style).
 * The strip continuously scrolls via CSS and shifts sideways as the cursor
 * moves across it, so it feels steered by the pointer.
 *
 * `children` is a render function invoked twice with "a" / "b" keys so the
 * two copies of the track keep distinct React keys.
 */
export function MarqueeCarousel({
  children,
  className = "",
  speed = 28,
  reverse = false,
  maxNudge = 150,
}: {
  children: (copy: "a" | "b") => ReactNode;
  className?: string;
  /** Seconds per 50% loop. */
  speed?: number;
  reverse?: boolean;
  /** Max horizontal offset (px) applied from cursor position. */
  maxNudge?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 90, damping: 18, mass: 0.4 });

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const progress = (e.clientX - rect.left) / Math.max(rect.width, 1);
    x.set((progress - 0.5) * 2 * maxNudge);
  };

  const onMouseLeave = () => x.set(0);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`group relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
        aria-hidden
      />
      <motion.div style={{ x: reduced ? 0 : sx }} className="w-max">
        <div
          className={`flex w-max gap-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
          style={{ animationDuration: `${speed}s` }}
        >
          {children("a")}
          {children("b")}
        </div>
      </motion.div>
    </div>
  );
}
