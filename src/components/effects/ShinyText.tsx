/**
 * Text with a travelling shine highlight (react-bits ShinyText style).
 * Requires the `shiny-text` utility from styles.css.
 */
export function ShinyText({
  text,
  speed = 5,
  className = "",
  disabled = false,
}: {
  text: string;
  speed?: number;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <span
      className={`shiny-text inline-block ${disabled ? "" : "animate-shiny-text"} ${className}`}
      style={{ animationDuration: `${speed}s` }}
    >
      {text}
    </span>
  );
}
