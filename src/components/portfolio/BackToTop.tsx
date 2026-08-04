import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const CIRCUMFERENCE = 2 * Math.PI * 19.5; // ≈ 122.5

/**
 * Back-to-top floating button with a circular scroll-progress ring.
 * Appears after the user scrolls past ~600px.
 */
export function BackToTop() {
  const { scrollYProgress } = useScroll();
  const dashOffset = useTransform(scrollYProgress, [0, 1], [CIRCUMFERENCE, 0]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-4 bottom-5 z-40">
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="relative grid size-11 place-items-center rounded-full border border-primary/30 bg-background/80 shadow-xl shadow-black/30 backdrop-blur transition-colors hover:border-primary/60"
          >
            <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 44 44" aria-hidden>
              <circle
                cx="22"
                cy="22"
                r="19.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-border/40"
                strokeDasharray={CIRCUMFERENCE}
              />
              <motion.circle
                cx="22"
                cy="22"
                r="19.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                style={{ strokeDashoffset: dashOffset }}
                className="text-primary"
              />
            </svg>
            <ArrowUp className="size-4 text-primary" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
