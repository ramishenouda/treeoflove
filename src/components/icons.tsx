type IconProps = { className?: string }

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
} as const

export function HeartIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor" />
    </svg>
  )
}

export function ArrowRightIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function SearchIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4-4" />
    </svg>
  )
}

export function CheckIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}

export function MailIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <rect height="13" rx="2.5" width="17" x="3.5" y="5.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

export function PhoneIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M6.5 4h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7L16 13l4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4z" />
    </svg>
  )
}

export function PinIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  )
}

export function LeafIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z" />
      <path d="M5 19 13 11" />
    </svg>
  )
}

export function MenuIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}
