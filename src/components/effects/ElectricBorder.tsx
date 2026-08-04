import { useRef, type ReactNode } from "react";

/**
 * Electric Border (react-bits style): a card wrapper that lights up its
 * border with a radial gradient glow tracking the cursor along the edges.
 * Uses CSS mask to reveal only the 2 px border ring.
 */
export function ElectricBorder({
  children,
  className = "",
  borderColor,
  ringWidth = 2,
}: {
  children: ReactNode;
  className?: string;
  borderColor?: string;
  ringWidth?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    node.style.setProperty("--eb-x", `${cx}px`);
    node.style.setProperty("--eb-y", `${cy}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMove} className={`relative ${className}`}>
      {/* Glowing border overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 hover:opacity-100 group-hover:opacity-100"
        aria-hidden
        style={{
          padding: `${ringWidth}px`,
          borderRadius: "inherit",
          background: `radial-gradient(340px circle at var(--eb-x, 50%) var(--eb-y, 50%), ${borderColor ?? "var(--primary)"}, transparent 60%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          animation: "electric-flicker 3s ease-in-out infinite",
        }}
      />
      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
