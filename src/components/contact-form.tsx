'use client'

import { useActionState } from 'react'

import { sendMessage } from '@/lib/actions/contact'
import { CheckIcon } from '@/components/icons'
import { buttonClass, fieldClass } from '@/components/ui'
import type { Dictionary, Locale } from '@/lib/i18n'
import { localizedPath } from '@/lib/i18n'

const labelClass = 'block text-sm font-semibold text-canopy-950'

export function ContactForm({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const [state, formAction, pending] = useActionState(sendMessage, null)
  const labels = dictionary.contactForm

  if (state?.ok) {
    return (
      <div className="mt-6 flex items-start gap-4 rounded-3xl bg-canopy-50 px-6 py-8" role="status">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-canopy-800 text-paper">
          <CheckIcon className="h-5 w-5" />
        </span>
        <p className="text-lg text-canopy-950">{labels.success}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="mt-6 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          {labels.name}
          <input autoComplete="name" className={fieldClass} maxLength={80} name="name" required type="text" />
        </label>
        <label className={labelClass}>
          {labels.email}
          <input autoComplete="email" className={fieldClass} maxLength={200} name="email" required type="email" />
        </label>
      </div>
      <label className={labelClass}>
        {labels.message}
        <textarea className={fieldClass} maxLength={4000} name="message" required rows={6} />
      </label>
      <label className="flex items-start gap-3 text-sm text-ink/75">
        <input className="mt-0.5 h-5 w-5 shrink-0 accent-canopy-700" name="consent" required type="checkbox" />
        <span>
          {labels.consent}{' '}
          <a
            className="font-semibold text-canopy-700 underline-offset-4 hover:underline"
            href={localizedPath(locale, '/privacy')}
          >
            ({dictionary.nav.privacy})
          </a>
        </span>
      </label>
      <input aria-hidden="true" autoComplete="off" className="hidden" name="website" tabIndex={-1} type="text" />
      {state && !state.ok ? (
        <p className="rounded-2xl bg-clay-100 px-4 py-3 text-sm text-clay-700" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className={buttonClass('primary', 'lg')} disabled={pending} type="submit">
        {pending ? labels.sending : labels.send}
      </button>
    </form>
  )
}
