import type { ReactNode } from "react";

/**
 * Scroll Stack (react-bits style): cards that stack on top of each other as
 * the user scrolls through a tall container. Each card sticks to the top
 * and piles up via a subtle offset.
 */
export function ScrollStack({
  items,
  className = "",
  cardGap = 12,
}: {
  items: ReactNode[];
  className?: string;
  /** Vertical offset between stacked cards (px). */
  cardGap?: number;
}) {
  return (
    <div className={className}>
      {items.map((node, i) => (
        <div
          key={i}
          className="sticky"
          style={{
            top: `calc(2rem + ${i * cardGap}px)`,
            zIndex: i + 1,
          }}
        >
          {node}
        </div>
      ))}
    </div>
  );
}
