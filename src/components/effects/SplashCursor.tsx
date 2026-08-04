import { useEffect, useRef } from "react";

/**
 * Canvas cursor trail (react-bits SplashCursor style).
 * Emits short-lived glowing particles along the pointer path.
 */
export function SplashCursor({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let lastMove = 0;
    const pointer = { x: -9999, y: -9999 };
    const trail: { x: number; y: number; vx: number; vy: number; life: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      lastMove = performance.now();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (performance.now() - lastMove < 140 && trail.length < 160) {
        trail.push({
          x: pointer.x,
          y: pointer.y,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          life: 1,
        });
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i]!;
        p.vx *= 0.93;
        p.vy *= 0.93;
        p.vx += (Math.random() - 0.5) * 0.14;
        p.vy += (Math.random() - 0.5) * 0.14;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) {
          trail.splice(i, 1);
          continue;
        }
        const radius = 2.4 * p.life;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 4);
        glow.addColorStop(0, `rgba(148, 189, 255, ${0.6 * p.life})`);
        glow.addColorStop(1, "rgba(148, 189, 255, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = window.requestAnimationFrame(draw);
    };

    resize();
    raf = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
      aria-hidden
    />
  );
}
