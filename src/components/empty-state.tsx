import { LeafIcon } from '@/components/icons'

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-3xl border border-dashed border-canopy-900/20 bg-white/70 px-6 py-10 sm:flex-row sm:items-center sm:px-8">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-canopy-50 text-canopy-600">
        <LeafIcon className="h-6 w-6" />
      </span>
      <div>
        <h2 className="font-display text-xl font-semibold text-canopy-950">{title}</h2>
        <p className="mt-1 max-w-xl text-ink/70">{body}</p>
      </div>
    </div>
  )
}
