'use client'

import { useActionState, useRef, useState, useTransition } from 'react'

import { searchTargets, startCheckout } from '@/lib/actions/donate'
import { HeartIcon, SearchIcon } from '@/components/icons'
import { buttonClass, choiceClass } from '@/components/ui'
import type { Dictionary, Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'

type Choice = { id: number; name: string; kind: 'program' | 'child' }

type InitialTarget = {
  kind: 'general' | 'program' | 'child'
  id?: number
  name: string
}

const legendClass = 'text-sm font-semibold text-canopy-950'

export function DonateForm({
  amounts,
  minimumAmount,
  stripeReady,
  initialTarget,
  dictionary,
  locale,
}: {
  amounts: number[]
  minimumAmount: number
  stripeReady: boolean
  initialTarget: InitialTarget
  dictionary: Dictionary
  locale: Locale
}) {
  const d = dictionary.donate
  const [state, formAction, pending] = useActionState(startCheckout, null)
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once')
  const [amountChoice, setAmountChoice] = useState(String(amounts[0] ?? minimumAmount))
  const [targetKind, setTargetKind] = useState(initialTarget.kind)
  const [selected, setSelected] = useState<Choice | null>(
    initialTarget.kind === 'general' || !initialTarget.id
      ? null
      : { id: initialTarget.id, name: initialTarget.name, kind: initialTarget.kind },
  )
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Choice[]>([])
  const [searched, setSearched] = useState(false)
  const [searching, startSearch] = useTransition()
  const timer = useRef<number | null>(null)

  function chooseKind(kind: InitialTarget['kind']) {
    setTargetKind(kind)
    setSelected(null)
    setQuery('')
    setResults([])
    setSearched(false)
  }

  function onQueryChange(value: string) {
    setQuery(value)
    if (timer.current) window.clearTimeout(timer.current)
    const term = value.trim()
    if (term.length < 2) {
      setResults([])
      setSearched(false)
      return
    }
    timer.current = window.setTimeout(() => {
      startSearch(async () => {
        const next = await searchTargets(targetKind, term, locale)
        setResults(next)
        setSearched(true)
      })
    }, 250)
  }

  return (
    <form action={formAction} className="space-y-8">
      <input name="locale" type="hidden" value={locale} />
      <fieldset>
        <legend className={legendClass}>{d.frequency}</legend>
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-3xl bg-canopy-50 p-1.5">
          {(
            [
              ['once', d.once],
              ['monthly', d.monthly],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus-within:ring-4 focus-within:ring-canopy-600/20 ${
                frequency === value ? 'bg-white text-canopy-950 shadow-soft' : 'text-canopy-800 hover:text-canopy-950'
              }`}
            >
              <input
                checked={frequency === value}
                className="sr-only"
                name="frequency"
                onChange={() => setFrequency(value)}
                type="radio"
                value={value}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={legendClass}>{d.amount}</legend>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {amounts.map((amount) => (
            <label key={amount} className={choiceClass(amountChoice === String(amount))}>
              <input
                checked={amountChoice === String(amount)}
                className="sr-only"
                name="amount"
                onChange={() => setAmountChoice(String(amount))}
                type="radio"
                value={amount}
              />
              €{amount}
            </label>
          ))}
          <label className={choiceClass(amountChoice === 'custom')}>
            <input
              checked={amountChoice === 'custom'}
              className="sr-only"
              name="amount"
              onChange={() => setAmountChoice('custom')}
              type="radio"
              value="custom"
            />
            {d.other}
          </label>
        </div>
        {amountChoice === 'custom' ? (
          <label className="mt-4 block text-sm font-semibold text-canopy-950">
            {d.customAmount}
            <span className="mt-1.5 flex max-w-xs items-center rounded-2xl border border-canopy-900/15 bg-white shadow-sm focus-within:border-canopy-600 focus-within:ring-4 focus-within:ring-canopy-600/15">
              <span aria-hidden="true" className="pl-4 text-ink/50">
                €
              </span>
              <input
                className="w-full bg-transparent px-2 py-3 font-normal text-ink focus:outline-none"
                inputMode="decimal"
                min={minimumAmount}
                name="customAmount"
                placeholder={`${minimumAmount}`}
                required
                step="0.01"
                type="number"
              />
            </span>
          </label>
        ) : null}
        <p className="mt-2 text-sm text-ink/55">{t(d.minimum, { amount: minimumAmount })}</p>
      </fieldset>

      <fieldset>
        <legend className={legendClass}>{d.where}</legend>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(
            [
              ['general', d.generalFund],
              ['program', d.aProgram],
              ['child', d.aChild],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className={choiceClass(targetKind === value)}>
              <input
                checked={targetKind === value}
                className="sr-only"
                name="targetKindChoice"
                onChange={() => chooseKind(value)}
                type="radio"
                value={value}
              />
              {label}
            </label>
          ))}
        </div>
        <input name="targetKind" type="hidden" value={targetKind} />
        <input name="targetId" type="hidden" value={selected?.id ?? ''} />
        {targetKind === 'general' ? (
          <p className="mt-4 rounded-2xl bg-canopy-50 px-4 py-3 text-sm text-canopy-900">{d.giftGeneral}</p>
        ) : selected ? (
          <p className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-sun-100 px-4 py-3 text-sm text-canopy-950">
            <span className="inline-flex items-center gap-2 font-semibold">
              <HeartIcon className="h-4 w-4 text-clay-500" />
              {selected.name}
            </span>
            <button
              className="font-semibold text-canopy-700 underline-offset-4 hover:underline"
              onClick={() => setSelected(null)}
              type="button"
            >
              {d.change}
            </button>
          </p>
        ) : (
          <div className="mt-4">
            <label className="block text-sm font-semibold text-canopy-950" htmlFor="donate-search">
              {targetKind === 'program' ? d.searchPrograms : d.searchChildren}
            </label>
            <span className="mt-1.5 flex items-center rounded-2xl border border-canopy-900/15 bg-white shadow-sm focus-within:border-canopy-600 focus-within:ring-4 focus-within:ring-canopy-600/15">
              <SearchIcon className="ml-4 h-5 w-5 shrink-0 text-ink/40" />
              <input
                className="w-full bg-transparent px-3 py-3 text-ink placeholder:text-ink/40 focus:outline-none"
                id="donate-search"
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder={targetKind === 'program' ? d.programName : d.firstName}
                type="search"
                value={query}
              />
            </span>
            {searching ? <p className="mt-3 text-sm text-ink/55">…</p> : null}
            {results.length ? (
              <ul className="mt-3 overflow-hidden rounded-2xl bg-white ring-1 ring-canopy-900/10">
                {results.map((choice) => (
                  <li key={`${choice.kind}-${choice.id}`} className="border-b border-canopy-900/5 last:border-b-0">
                    <button
                      className="w-full px-4 py-3 text-left text-sm font-medium text-canopy-950 hover:bg-canopy-50"
                      onClick={() => setSelected(choice)}
                      type="button"
                    >
                      {choice.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {searched && !searching && results.length === 0 ? (
              <p className="mt-3 text-sm text-ink/55">{d.noResults}</p>
            ) : null}
          </div>
        )}
      </fieldset>

      {state?.error ? (
        <p className="rounded-2xl bg-clay-100 px-4 py-3 text-sm text-clay-700" role="alert">
          {state.error}
        </p>
      ) : null}
      {!stripeReady ? (
        <p className="rounded-2xl bg-canopy-50 px-4 py-3 text-sm text-canopy-900">{d.stripeClosed}</p>
      ) : null}
      <button className={buttonClass('donate', 'lg', 'w-full')} disabled={pending || !stripeReady} type="submit">
        <HeartIcon className="h-4 w-4" />
        {pending ? d.openingStripe : d.continuePayment}
      </button>
      <p className="text-center text-sm text-ink/55">{d.stripeNote}</p>
    </form>
  )
}
