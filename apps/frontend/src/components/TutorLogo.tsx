/**
 * Tutor logo used in the sidebar and mobile header.
 */

interface TutorLogoProps {
  size?: number;
  className?: string;
}

function TutorLogo({ size = 28, className }: TutorLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      aria-label="Tutor logo"
      role="img"
    >
      <defs>
        <linearGradient id="tutor-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a3a5c" />
          <stop offset="100%" stopColor="#58a6ff" />
        </linearGradient>
        <linearGradient id="tutor-accent" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#79b8ff" />
          <stop offset="100%" stopColor="#58a6ff" />
        </linearGradient>
      </defs>

      <rect width="512" height="512" rx="96" fill="url(#tutor-bg)" />
      <path d="M112 142 H400" fill="none" stroke="white" strokeWidth="38" strokeLinecap="round" />
      <path d="M256 150 V384" fill="none" stroke="white" strokeWidth="38" strokeLinecap="round" />
      <path
        d="M150 280 C190 240, 226 240, 256 280 C286 320, 324 320, 364 280"
        fill="none"
        stroke="url(#tutor-accent)"
        strokeWidth="26"
        strokeLinecap="round"
      />
      <circle cx="364" cy="280" r="11" fill="url(#tutor-accent)" />
    </svg>
  );
}

export default TutorLogo;
