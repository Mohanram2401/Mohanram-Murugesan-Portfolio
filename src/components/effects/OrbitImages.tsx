import type { ReactNode } from "react";

/**
 * Orbit Images (react-bits style): images arranged in a circular orbit around
 * a center element, rotating steadily via CSS. Items counter-rotate to stay
 * upright.
 */
export function OrbitImages({
  images,
  center,
  radius = 186,
  size = 48,
  duration = 32,
  className = "",
  paused = false,
}: {
  images: { src: string; alt?: string }[];
  center: ReactNode;
  radius?: number;
  size?: number;
  duration?: number;
  className?: string;
  paused?: boolean;
}) {
  const n = images.length;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: radius * 2 + size, height: radius * 2 + size }}
    >
      {/* Orbital track ring */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/30"
        style={{ width: radius * 2, height: radius * 2 }}
        aria-hidden
      />

      {/* Rotating orbit */}
      <div
        className="absolute inset-0 animate-orbit"
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {images.map((img, i) => {
          const angle = (i / n) * 360;
          return (
            <div
              key={`${img.src}-${i}`}
              className="absolute left-1/2 top-1/2"
              style={{
                width: size,
                height: size,
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px)`,
              }}
            >
              <img
                src={img.src}
                alt={img.alt ?? ""}
                loading="lazy"
                className="orbit-counter rounded-xl border border-border/60 object-cover shadow-lg"
                style={{
                  width: size,
                  height: size,
                  animationDuration: `${duration}s`,
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Center */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        {center}
      </div>
    </div>
  );
}
