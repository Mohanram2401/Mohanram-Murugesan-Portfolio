import { useEffect, useRef } from "react";

/**
 * Cursor Grid (react-bits style): a background grid whose cells brighten as
 * the cursor approaches. Cell opacity is updated via refs for zero re-renders.
 */
export function CursorGrid({
  className = "",
  rows = 14,
  cols = 28,
  radius = 170,
  cellClass = "size-2 rounded-[2px] bg-primary/60",
}: {
  className?: string;
  rows?: number;
  cols?: number;
  /** Pixels over which the cell reaches full brightness. */
  radius?: number;
  cellClass?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cellsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0) return;
      const cellW = rect.width / cols;
      const cellH = rect.height / rows;
      for (let i = 0; i < cellsRef.current.length; i++) {
        const cell = cellsRef.current[i];
        if (!cell) continue;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = rect.left + col * cellW + cellW / 2;
        const cy = rect.top + row * cellH + cellH / 2;
        const d = Math.hypot(e.clientX - cx, e.clientY - cy);
        const v = Math.max(0, 1 - d / radius);
        cell.style.opacity = String(0.1 + v * 0.55);
        cell.style.transform = v > 0.4 ? "scale(1.6)" : "scale(1)";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [rows, cols, radius]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none grid ${className}`}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridAutoRows: "1fr" }}
      aria-hidden
    >
      {Array.from({ length: rows * cols }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            cellsRef.current[i] = el;
          }}
          className={cellClass}
          style={{ opacity: 0.1, transition: "opacity 0.25s ease-out, transform 0.25s ease-out" }}
        />
      ))}
    </div>
  );
}
