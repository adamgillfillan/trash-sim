import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function ClubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        stroke="none"
        d="M12 14.5c-1.6 0-3-1.3-3-3 0-.5.1-.9.3-1.3-1 .8-2.5.7-3.4-.2a3.02 3.02 0 0 1 .2-4.2c1-1 2.6-1.1 3.7-.2-.1-.4-.2-.7-.2-1.1 0-1.7 1.4-3 3-3s3 1.3 3 3c0 .4-.1.8-.2 1.1 1.1-.9 2.7-.8 3.7.2a3.02 3.02 0 0 1 .2 4.2c-.9.9-2.4 1-3.4.2.2.4.3.8.3 1.3 0 1.7-1.4 3-3 3h-.2l.7 3.5h-4.5l.7-3.5h-.2z"
      />
    </svg>
  );
}

export function DiamondIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M12 3 19.5 12 12 21 4.5 12 12 3z" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 20.5s-6.5-4.4-8.7-8.2c-1.7-2.9-.7-6.6 2.2-7.9 1.8-.8 4-.4 5.3 1.2C11.2 3.4 13.4 3 15.2 3.8c2.9 1.3 3.9 5 2.2 7.9-2.2 3.8-8.7 8.8-8.7 8.8z"
      />
    </svg>
  );
}

export function SpadeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 3c-4.1 2.9-7 6.1-7 9.2 0 1.8 1.6 3.3 3.5 3.3.6 0 1.1-.1 1.6-.3-.3 1.3-.9 3.2-1.7 4.3h4.2c-.8-1.1-1.4-3-1.7-4.3.5.2 1 .3 1.6.3 1.9 0 3.5-1.5 3.5-3.3 0-3.1-2.9-6.3-7-9.2z"
      />
      <path d="M10.5 20h3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

export function ChipIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8" fill="currentColor" fillOpacity="0.08" />
      <circle cx="12" cy="12" r="5" />
      <path d="M12 4v2" strokeLinecap="round" />
      <path d="M12 18v2" strokeLinecap="round" />
      <path d="M4 12h2" strokeLinecap="round" />
      <path d="M18 12h2" strokeLinecap="round" />
      <path d="m6.6 6.6 1.4 1.4" strokeLinecap="round" />
      <path d="m15.9 15.9 1.4 1.4" strokeLinecap="round" />
      <path d="m6.6 17.4 1.4-1.4" strokeLinecap="round" />
      <path d="m15.9 8.1 1.4-1.4" strokeLinecap="round" />
    </svg>
  );
}

export function CardFanIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="10" y="26" width="24" height="34" rx="4" ry="4" fill="currentColor" fillOpacity="0.08" />
      <rect x="20" y="20" width="24" height="34" rx="4" ry="4" transform="rotate(8 32 37)" fill="currentColor" fillOpacity="0.12" />
      <rect x="30" y="14" width="24" height="34" rx="4" ry="4" transform="rotate(16 42 31)" fill="currentColor" fillOpacity="0.16" />
    </svg>
  );
}

