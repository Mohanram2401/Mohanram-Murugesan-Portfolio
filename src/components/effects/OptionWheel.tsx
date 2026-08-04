import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

/**
 * Option Wheel (react-bits style): a radial menu of options arranged around a
 * central hub. Clicking an option rotates the wheel to highlight it.
 */
export function OptionWheel<T extends string | number>({
  options,
  active,
  onChange,
  className = "",
  size = 220,
  itemSize = 52,
}: {
  options: { label: string; value: T; icon?: React.ReactNode }[];
  active: T;
  onChange: (value: T) => void;
  className?: string;
  size?: number;
  itemSize?: number;
}) {
  const n = options.length;
  const angleStep = 360 / n;
  const activeIdx = options.findIndex((o) => o.value === active);
  const rot = useMotionValue(0);
  const sRot = useSpring(rot, { stiffness: 120, damping: 18, mass: 0.5 });

  useEffect(() => {
    rot.set(-(activeIdx === -1 ? 0 : activeIdx) * angleStep);
  }, [activeIdx, angleStep, rot]);

  const radius = (size - itemSize) / 2;

  return (
    <div className={`relative select-none ${className}`} style={{ width: size, height: size }}>
      {/* Outer ring */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/40"
        style={{ width: size - 8, height: size - 8 }}
      />

      {/* Rotating options track */}
      <motion.div className="absolute inset-0" style={{ rotate: sRot }}>
        {options.map((opt) => {
          const idx = options.indexOf(opt);
          const angle = idx * angleStep;
          return (
            <div
              key={String(opt.value)}
              className="absolute left-1/2 top-1/2"
              style={{
                width: itemSize,
                height: itemSize,
                transform: `translate(-50%,-50%) rotate(${angle}deg) translateY(-${radius}px)`,
              }}
            >
              {/* Counter-rotate content so it stays upright */}
              <div
                className="orbit-counter"
                style={{ animationDuration: "0s", animationPlayState: "paused" }}
              >
                <button
                  onClick={() => onChange(opt.value)}
                  className={`group flex size-full flex-col items-center justify-center gap-0.5 rounded-xl border text-[10px] font-medium transition-all ${
                    opt.value === active
                      ? "border-primary/60 bg-primary/15 text-primary shadow-[0_0_18px_-4px_var(--primary)]"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {opt.icon}
                  <span className="truncate px-1 leading-tight">{opt.label}</span>
                </button>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Center hub */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="grid size-14 place-items-center rounded-full bg-gradient-brand font-display text-[11px] font-bold text-background shadow-[0_0_28px_-6px_var(--primary)]">
          {activeIdx !== null ? options[activeIdx]?.label.slice(0, 6) : "..."}
        </div>
      </div>
    </div>
  );
}
