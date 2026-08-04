/**
 * Subtle glowing horizontal divider between sections.
 * A thin gradient line with a soft glow halo.
 */
export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center py-2 ${className}`}>
      <div
        className="h-px w-full max-w-md"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--primary), var(--accent2), transparent)",
          opacity: 0.2,
        }}
      />
      <div
        className="absolute h-4 w-48 blur-xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--primary), var(--accent2), transparent)",
          opacity: 0.12,
        }}
      />
    </div>
  );
}
