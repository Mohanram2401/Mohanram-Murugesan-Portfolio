import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Glare Hover (react-bits style): a glassy reflection that sweeps over the
 * card following the cursor, with a subtle border glow.
 */
export function GlareHover({
  children,
  className = "",
  glareColor = "rgba(255, 255, 255, 0.18)",
  borderColor = "rgba(59, 130, 246, 0.35)",
}: {
  children: ReactNode;
  className?: string;
  glareColor?: string;
  borderColor?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    node.style.setProperty("--g-x", `${px}px`);
    node.style.setProperty("--g-y", `${py}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMouseMove} className={`relative overflow-hidden ${className}`}>
      {/* Soft radial glare */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
        style={{
          background: `radial-gradient(340px circle at var(--g-x, 50%) var(--g-y, 50%), ${glareColor}, transparent 55%)`,
        }}
      />
      {/* Diagonal sheen */}
      <div
        className="pointer-events-none absolute -inset-x-24 top-1/2 z-0 h-px -translate-y-1/2 rotate-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
        style={{
          background: `linear-gradient(90deg, transparent, ${glareColor}, transparent)`,
          filter: "blur(6px)",
        }}
      />
      {/* Border glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
        style={{
          borderRadius: "inherit",
          boxShadow: `inset 0 0 0 1px ${borderColor}`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
