import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Burst {
  id: number;
  x: number;
  y: number;
}

const SPARK_COUNT = 8;

/**
 * Click Spark (react-bits style): every click bursts a small fan of sparks
 * outward from the pointer. Mounted globally.
 */
export function ClickSpark() {
  const [enabled, setEnabled] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
    const onPointerDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const id = performance.now();
      setBursts((prev) => [...prev.slice(-6), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 650);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      <AnimatePresence>
        {bursts.map((b) => (
          <SparkBurst key={b.id} x={b.x} y={b.y} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function SparkBurst({ x, y }: { x: number; y: number }) {
  const sparks = Array.from({ length: SPARK_COUNT }, (_, i) => {
    const angle = (i / SPARK_COUNT) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 26 + Math.random() * 26;
    return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, hue: Math.random() };
  });

  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {sparks.map((s, i) => (
        <motion.span
          key={i}
          className="absolute size-1 rounded-full"
          style={{
            background:
              s.hue > 0.5 ? "var(--primary)" : s.hue > 0.25 ? "var(--accent2)" : "var(--accent3)",
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: s.dx, y: s.dy, scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
}
