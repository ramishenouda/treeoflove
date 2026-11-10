'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { usePathname, useRouter } from 'next/navigation'

/** Shown to signed-in staff while preview is on. Reloads the page whenever the admin saves or autosaves. */
export function PreviewBar({ serverURL }: { serverURL: string }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <>
      <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />
      <div
        className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-3 rounded-full bg-canopy-950 px-4 py-2 text-sm text-white shadow-lift"
        role="status"
      >
        <span>Preview: you are seeing unpublished changes.</span>
        <a
          className="rounded-full bg-sun-400 px-3 py-1 font-semibold text-canopy-950 hover:bg-sun-300"
          href={`/api/preview/exit?path=${encodeURIComponent(pathname)}`}
        >
          Exit preview
        </a>
      </div>
    </>
  )
}
