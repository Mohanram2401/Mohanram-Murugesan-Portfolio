import { useEffect, useRef } from "react";

interface Strand {
  x: number;
  speed: number;
  amplitude: number;
  wavelength: number;
  thickness: number;
  phase: number;
}

/**
 * Strands (react-bits style): canvas background of flowing ribbon lines that
 * sway in a sine-wave pattern, creating an organic animated background.
 */
export function Strands({ className = "", count = 28 }: { className?: string; count?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;

    const strands: Strand[] = Array.from({ length: count }, (_, i) => ({
      x: (i / count) * 1.1,
      speed: 0.25 + Math.random() * 0.5,
      amplitude: 18 + Math.random() * 42,
      wavelength: 0.003 + Math.random() * 0.004,
      thickness: 0.4 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      for (const s of strands) {
        ctx.beginPath();
        ctx.lineWidth = s.thickness;
        const alpha = 0.06 + s.thickness * 0.04;
        ctx.strokeStyle = `rgba(148, 189, 255, ${alpha})`;

        for (let y = 0; y <= h; y += 4) {
          const x = s.x * w + Math.sin(y * s.wavelength + t * s.speed + s.phase) * s.amplitude;
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
      aria-hidden
    />
  );
}
