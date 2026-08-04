/**
 * Soft ambient glow orb (react-bits Orb style).
 * Renders a heavily blurred, low-opacity color field that floats via CSS.
 * Matches the original hero glow look (large blur + ~15-20% opacity).
 */
export function Orb({
  className = "",
  size = 640,
  color = "var(--primary)",
  opacity = 0.16,
  blur = 140,
}: {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
  blur?: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full animate-orb ${className}`}
      style={{ width: size, height: size, background: color, opacity, filter: `blur(${blur}px)` }}
      aria-hidden
    />
  );
}
