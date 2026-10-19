type DecorProps = { className?: string }

export function TreeMark({ className = 'h-10 w-10' }: DecorProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 40 40">
      <circle className="fill-canopy-800" cx="20" cy="20" r="20" />
      <rect className="fill-sun-300" height="11" rx="1.4" width="2.8" x="18.6" y="20" />
      <g className="fill-sun-400">
        <circle cx="13.5" cy="18" r="5.5" />
        <circle cx="26.5" cy="18" r="5.5" />
        <circle cx="20" cy="13" r="6.5" />
        <circle cx="20" cy="19.5" r="5.5" />
      </g>
      <path
        className="fill-canopy-800"
        d="M20 20.6c-1.6-1.4-3.5-2.5-3.5-4.2a1.85 1.85 0 0 1 3.5-.85 1.85 1.85 0 0 1 3.5.85c0 1.7-1.9 2.8-3.5 4.2z"
      />
    </svg>
  )
}

export function Blob({ className = '' }: DecorProps) {
  return (
    <div aria-hidden="true" className={className}>
      <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 600 600">
        <path
          d="M421 82c58 35 109 96 118 165 9 70-24 147-79 200-55 52-132 80-205 71-73-8-142-53-176-117-34-65-33-149 4-213 37-63 110-106 182-121 57-12 98-20 156 15z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}

export function Wave({ className = '' }: DecorProps) {
  return (
    <svg aria-hidden="true" className={className} preserveAspectRatio="none" viewBox="0 0 1440 72">
      <path d="M0 40C160 12 320 0 480 10s320 46 480 50 320-26 480-46v58H0z" fill="currentColor" />
    </svg>
  )
}

export function Sprig({ className = '' }: DecorProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      viewBox="0 0 64 64"
    >
      <path d="M10 56C22 42 34 28 54 10" />
      <path d="M22 42c-7-1-11-6-11-13 7 0 11 5 11 13z" fill="currentColor" stroke="none" />
      <path d="M33 30c-1-7 3-12 10-14 1 7-3 12-10 14z" fill="currentColor" stroke="none" />
      <path d="M38 26c7-1 12 3 13 10-7 1-12-3-13-10z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function Squiggle({ className = '' }: DecorProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="4"
      viewBox="0 0 160 12"
    >
      <path d="M2 7c10-6 20-6 30 0s20 6 30 0 20-6 30 0 20 6 30 0 20-6 30 0" />
    </svg>
  )
}
