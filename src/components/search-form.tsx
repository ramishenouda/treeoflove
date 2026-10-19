import { SearchIcon } from '@/components/icons'
import { buttonClass } from '@/components/ui'

export function SearchForm({
  action,
  id,
  label,
  placeholder,
  submitLabel = 'Search',
  defaultValue,
  hidden,
}: {
  action: string
  id: string
  label: string
  placeholder: string
  submitLabel?: string
  defaultValue?: string
  hidden?: Record<string, string | undefined>
}) {
  return (
    <form
      action={action}
      className="flex w-full max-w-xl items-center gap-2 rounded-full bg-white p-1.5 shadow-soft ring-1 ring-canopy-900/10 focus-within:ring-2 focus-within:ring-canopy-600/40"
      method="get"
      role="search"
    >
      {Object.entries(hidden ?? {}).map(([name, value]) =>
        value ? <input key={name} name={name} type="hidden" value={value} /> : null,
      )}
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <SearchIcon className="ml-3 h-5 w-5 shrink-0 text-ink/40" />
      <input
        className="min-w-0 flex-1 bg-transparent px-1 py-2 text-ink placeholder:text-ink/45 focus:outline-none"
        defaultValue={defaultValue}
        id={id}
        name="q"
        placeholder={placeholder}
        type="search"
      />
      <button className={buttonClass('primary', 'md')} type="submit">
        {submitLabel}
      </button>
    </form>
  )
}
