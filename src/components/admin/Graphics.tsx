function TreeMark({ size, className }: { size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      height={size}
      viewBox="0 0 48 48"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" fill="#225a43" r="24" />
      <path
        d="M14 33c0-11 7-18 20-19 0 13-7 19-18 19z"
        fill="#86bc9e"
        stroke="#fbf7ef"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path d="M14 33 26 21" fill="none" stroke="#fbf7ef" strokeLinecap="round" strokeWidth="2" />
      <circle cx="33" cy="15" fill="#f5c243" r="3.5" />
    </svg>
  )
}

/** Shown on the login and sign-up screens. */
export function Logo() {
  return (
    <div className="tol-logo">
      <TreeMark size={56} />
      <div>
        <div className="tol-logo__name">Tree of Love</div>
        <div className="tol-logo__sub">Staff admin</div>
      </div>
    </div>
  )
}

/** Shown in the top bar and the browser tab area of the admin. */
export function Icon() {
  return <TreeMark className="tol-icon" />
}
