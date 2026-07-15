import type { CSSProperties } from "react";

/**
 * Staggered per-letter roll-up hover effect.
 * Renders the text twice (visible row + accent-colored clone); on hover the
 * letters roll out upward while the clone rolls in from below, one letter at
 * a time. Hover triggers on the element itself, or on a `.roll-trigger`
 * ancestor (e.g. a whole list row).
 */
const TextRoll = ({ text, className }: { text: string; className?: string }) => {
  const letters = [...text];

  const row = (ariaHidden: boolean) => (
    <span className="text-roll-row" aria-hidden={ariaHidden || undefined}>
      {letters.map((ch, i) => (
        <span
          key={i}
          className="text-roll-letter"
          style={{ "--i": i } as CSSProperties}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );

  return (
    <span className={`text-roll ${className ?? ""}`} aria-label={text}>
      {row(false)}
      <span className="text-roll-clone" aria-hidden="true">
        {row(true)}
      </span>
    </span>
  );
};

export default TextRoll;
