import type { ReactNode } from 'react'

export type ButtonVariant = 'donate' | 'primary' | 'outline' | 'onDark'
export type ButtonSize = 'sm' | 'md' | 'lg'

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const buttonVariants: Record<ButtonVariant, string> = {
  donate:
    'bg-sun-400 text-canopy-950 shadow-[0_10px_24px_-12px_rgb(233_169_31/0.9)] hover:bg-sun-300 focus-visible:outline-sun-500',
  primary: 'bg-canopy-800 text-paper hover:bg-canopy-700 focus-visible:outline-canopy-800',
  outline:
    'bg-white/70 text-canopy-900 ring-1 ring-canopy-900/15 hover:bg-white hover:ring-canopy-900/30 focus-visible:outline-canopy-800',
  onDark: 'text-paper ring-1 ring-paper/30 hover:bg-paper/10 focus-visible:outline-paper',
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
}

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className = '') {
  return [buttonBase, buttonVariants[variant], buttonSizes[size], className].filter(Boolean).join(' ')
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}: {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}) {
  return (
    <a className={buttonClass(variant, size, className)} href={href}>
      {children}
    </a>
  )
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-canopy-600 ${className}`}
    >
      <span aria-hidden="true" className="h-px w-6 bg-current" />
      {children}
    </p>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  id,
}: {
  eyebrow?: string
  title: string
  description?: string | null
  action?: ReactNode
  id?: string
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2
          className="mt-3 font-display text-3xl font-semibold tracking-tight text-canopy-950 sm:text-4xl"
          id={id}
        >
          {title}
        </h2>
        {description ? <p className="mt-3 text-lg text-ink/70">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-canopy-700 hover:text-canopy-950"
      href={href}
    >
      {children}
    </a>
  )
}

export const fieldClass =
  'mt-1.5 w-full rounded-2xl border border-canopy-900/15 bg-white px-4 py-3 text-ink shadow-sm placeholder:text-ink/40 focus:border-canopy-600 focus:outline-none focus:ring-4 focus:ring-canopy-600/15'

export function choiceClass(active: boolean) {
  return `flex cursor-pointer items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus-within:ring-4 focus-within:ring-canopy-600/20 ${
    active
      ? 'bg-canopy-800 text-paper shadow-soft'
      : 'bg-white text-canopy-900 ring-1 ring-canopy-900/15 hover:ring-canopy-900/35'
  }`
}

export function chipClass(active: boolean) {
  return `inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
    active ? 'bg-canopy-800 text-paper' : 'bg-white text-canopy-900 ring-1 ring-canopy-900/15 hover:ring-canopy-900/35'
  }`
}
