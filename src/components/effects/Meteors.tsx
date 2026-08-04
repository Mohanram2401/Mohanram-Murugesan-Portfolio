import { useMemo } from "react";

/**
 * Falling meteor streaks (react-bits Meteors style).
 * Renders a configurable number of streaks on a looping CSS animation.
 */
export function Meteors({ count = 14 }: { count?: number }) {
  const meteors = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: -12 - Math.random() * 90,
        delay: Math.random() * 9,
        duration: 3.5 + Math.random() * 4.5,
        size: 40 + Math.random() * 60,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {meteors.map((m) => (
        <span
          key={m.id}
          className="meteor absolute block h-px rounded-full bg-gradient-to-r from-transparent via-accent3/70 to-primary"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: `${m.size}px`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
