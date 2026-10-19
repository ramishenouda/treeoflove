import type { ReactNode } from 'react'

import { Blob } from '@/components/decor'
import { Container, Eyebrow } from '@/components/ui'

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string | null
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden">
      <Blob className="pointer-events-none absolute -right-40 -top-48 h-[30rem] w-[30rem] text-sun-100 sm:-right-24" />
      <Blob className="pointer-events-none absolute -left-48 top-32 h-72 w-72 rotate-45 text-canopy-50" />
      <Container className="relative pb-10 pt-12 sm:pb-14 sm:pt-16 lg:pt-20">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-canopy-950 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? <p className="mt-5 max-w-2xl text-lg text-ink/70">{description}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </section>
  )
}
