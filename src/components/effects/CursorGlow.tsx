import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

interface Pulse {
  id: number;
  x: number;
  y: number;
}

/**
 * Global cursor overlay combining:
 * - macOS-style velocity scaling (dot + ring enlarge on fast movement)
 * - Target Cursor crosshair lines + expanding pulse rings on click
 * - Page-wide spotlight glow
 * - Click Spark is separate (ClickSpark.tsx)
 */
export function CursorGlow() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [pulses, setPulses] = useState<Pulse[]>([]);

  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const spotX = useSpring(x, { stiffness: 110, damping: 22, mass: 0.4 });
  const spotY = useSpring(y, { stiffness: 110, damping: 22, mass: 0.4 });
  const ringX = useSpring(x, { stiffness: 280, damping: 26, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 280, damping: 26, mass: 0.5 });

  // macOS-style velocity cursor
  const velocity = useMotionValue(0);
  const speed = useSpring(velocity, { stiffness: 130, damping: 16, mass: 0.4 });
  const dotScale = useTransform(speed, [0, 1.4], [1, 3]);
  const ringScale = useTransform(speed, [0, 1.4], [1, 2.1]);
  const crosshairScale = useTransform(speed, [0, 1.4], [1, 1.8]);
  const hoverScale = useMotionValue(1);
  const interactiveDotScale = useTransform([dotScale, hoverScale], (latest: number[]) => {
    return latest[0]! * latest[1]!;
  });

  const spotlight = useMotionTemplate`radial-gradient(38rem circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--primary) 9%, transparent), transparent 65%)`;
  const pointerGlow = useMotionTemplate`radial-gradient(9rem circle at ${x}px ${y}px, color-mix(in oklab, var(--accent3) 10%, transparent), transparent 70%)`;

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const now = performance.now();
      if (lastTime > 0) {
        const dt = Math.max(now - lastTime, 1);
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        velocity.set(Math.hypot(dx, dy) / dt);
      }
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest?.(
          "a, button, [role='button'], input, textarea, select, [data-interactive]",
        ),
      );
      setInteractive(isInteractive);
      hoverScale.set(isInteractive ? 0.45 : 1);
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const id = performance.now();
      setPulses((prev) => [...prev.slice(-4), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => setPulses((prev) => prev.filter((p) => p.id !== id)), 700);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [reduced, x, y, velocity, hoverScale]);

  if (!enabled) return null;

  return (
    <>
      {/* Page-wide spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] hidden lg:block"
        style={{ background: spotlight }}
      />
      {/* Tight accent glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] hidden lg:block"
        style={{ background: pointerGlow }}
      />

      {/* Click pulse rings (Target Cursor) */}
      <AnimatePresence>
        {pulses.map((p) => (
          <motion.div
            key={p.id}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[89] hidden lg:block"
            style={{ left: p.x, top: p.y }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{ scale: 0.4, opacity: 0.8 }}
                animate={{ scale: 3.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="size-8 rounded-full border-2 border-primary/50"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Trailing ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden lg:block"
        style={{ x: ringX, y: ringY, scale: ringScale }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ opacity: interactive ? 0.45 : 0.3 }}
            className="size-8 rounded-full border border-primary/50 shadow-[0_0_18px_-4px_var(--primary)]"
          />
        </div>
      </motion.div>

      {/* Crosshair lines (Target Cursor) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[91] hidden lg:block"
        style={{ x: ringX, y: ringY, scale: crosshairScale }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          {/* Horizontal line */}
          <div
            className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2"
            style={{ background: "rgba(59,130,246,0.25)" }}
          />
          {/* Vertical line */}
          <div
            className="absolute left-1/2 top-1/2 h-8 w-px -translate-x-1/2 -translate-y-1/2"
            style={{ background: "rgba(59,130,246,0.25)" }}
          />
        </div>
      </motion.div>

      {/* Cursor dot — velocity + hover */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[92] hidden lg:block"
        style={{ x, y }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <motion.div
            style={{ scale: interactiveDotScale }}
            className="size-1.5 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]"
          />
        </div>
      </motion.div>
    </>
  );
}
