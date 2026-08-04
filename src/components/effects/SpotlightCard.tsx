import { useRef, type ComponentPropsWithoutRef, type MouseEvent, type ReactNode } from "react";

/**
 * Card with a radial spotlight that follows the cursor (react-bits
 * SpotlightCard style). Sets --mouse-x / --mouse-y CSS vars on move.
 */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(59, 130, 246, 0.14)",
  ...divProps
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "className">) {
  const divRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const node = divRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    node.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden ${className}`}
      {...divProps}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor}, transparent 45%)`,
        }}
        aria-hidden
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
