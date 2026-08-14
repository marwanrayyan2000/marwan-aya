type Props = {
  className?: string;
  /** Draw the surrounding arch/seal ring */
  seal?: boolean;
  title?: string;
};

/** Minimal gold monogram: M & A inside an Arabic-arch seal. */
export function Monogram({ className, seal = true, title = "M & A" }: Props) {
  return (
    <svg
      viewBox="0 0 120 140"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mg-foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--gold-deep)" />
          <stop offset="45%" stopColor="var(--gold-light)" />
          <stop offset="70%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--gold-deep)" />
        </linearGradient>
      </defs>

      {seal && (
        <>
          {/* Arabic arch outline */}
          <path
            d="M14 132 V60 C14 27 34 8 60 8 C86 8 106 27 106 60 V132"
            stroke="url(#mg-foil)"
            strokeWidth="1.1"
          />
          <path
            d="M21 132 V61 C21 32 38 15 60 15 C82 15 99 32 99 61 V132"
            stroke="url(#mg-foil)"
            strokeWidth="0.5"
            opacity="0.55"
          />
          <path d="M14 132 H106" stroke="url(#mg-foil)" strokeWidth="1.1" />
        </>
      )}

      {/* M */}
      <path
        d="M28 88 V52 L40 72 L52 52 V88"
        stroke="url(#mg-foil)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* ampersand rendered as a fine gold stem */}
      <path
        d="M57 87 C57 80 64 78 64 72 C64 68.4 60.6 66.6 58.6 69 C55.8 72.4 60 78 65.6 83.4"
        stroke="url(#mg-foil)"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* A */}
      <path
        d="M68 88 L79 52 L90 88 M72 78 H86"
        stroke="url(#mg-foil)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="60" cy="102" r="1.6" fill="url(#mg-foil)" />
    </svg>
  );
}
