import type { ReactNode } from 'react'

import { Blob } from '@/components/decor'
import { Container } from '@/components/ui'

export function StatusPanel({
  icon,
  title,
  body,
  children,
}: {
  icon: ReactNode
  title: string
  body: string
  children?: ReactNode
}) {
  return (
    <main className="hero-wash">
      <Container className="max-w-2xl py-16 sm:py-24">
        <div className="relative overflow-hidden rounded-4xl bg-white px-6 py-12 text-center shadow-lift ring-1 ring-canopy-900/5 sm:px-12">
          <Blob className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 text-sun-100" />
          <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-canopy-800 text-sun-300">
            {icon}
          </span>
          <h1 className="relative mt-6 font-display text-4xl font-semibold tracking-tight text-canopy-950 sm:text-5xl">
            {title}
          </h1>
          <p className="relative mx-auto mt-4 max-w-md text-lg text-ink/70">{body}</p>
          {children ? <div className="relative mt-8 flex flex-wrap justify-center gap-3">{children}</div> : null}
        </div>
      </Container>
    </main>
  )
}
