import {
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

interface Shape {
  id: number;
  size: number;
  depth: number;
  color: string;
  shape: "circle" | "square" | "triangle";
  top: string;
  left: string;
  blur: number;
}

const SHAPES: Shape[] = [
  {
    id: 1,
    size: 160,
    depth: 0.35,
    color: "var(--primary)",
    shape: "circle",
    top: "10%",
    left: "6%",
    blur: 60,
  },
  {
    id: 2,
    size: 120,
    depth: 0.55,
    color: "var(--accent2)",
    shape: "square",
    top: "56%",
    left: "14%",
    blur: 46,
  },
  {
    id: 3,
    size: 200,
    depth: 0.25,
    color: "var(--accent3)",
    shape: "circle",
    top: "20%",
    left: "78%",
    blur: 72,
  },
  {
    id: 4,
    size: 96,
    depth: 0.7,
    color: "var(--primary)",
    shape: "triangle",
    top: "70%",
    left: "84%",
    blur: 38,
  },
  {
    id: 5,
    size: 140,
    depth: 0.45,
    color: "var(--accent2)",
    shape: "circle",
    top: "4%",
    left: "46%",
    blur: 54,
  },
];

/**
 * Shape Blur (react-bits style): large heavily-blurred geometric shapes that
 * drift (CSS float) and parallax away from the cursor, creating a liquid
 * depth field behind the content.
 */
export function ShapeBlur({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      px.set((e.clientX - rect.left) / rect.width);
      py.set((e.clientY - rect.top) / rect.height);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [px, py]);

  if (reduced) return null;

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {SHAPES.map((s) => (
        <BlurShape key={s.id} shape={s} sx={sx} sy={sy} />
      ))}
    </div>
  );
}

function BlurShape({
  shape,
  sx,
  sy,
}: {
  shape: Shape;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const x = useTransform(sx, (v) => (v - 0.5) * -shape.depth * 150);
  const y = useTransform(sy, (v) => (v - 0.5) * -shape.depth * 150);

  return (
    <motion.div className="absolute" style={{ top: shape.top, left: shape.left, x, y }}>
      <div
        className="animate-orb"
        style={{
          width: shape.size,
          height: shape.size,
          background: shape.color,
          borderRadius:
            shape.shape === "circle" ? "9999px" : shape.shape === "square" ? "22%" : "0%",
          clipPath: shape.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
          filter: `blur(${shape.blur}px)`,
          opacity: 0.55,
        }}
      />
    </motion.div>
  );
}
