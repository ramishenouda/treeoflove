'use client'

import { Link, useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'

/**
 * "Back to dashboard" in the admin top bar. It is a normal link, so Payload's
 * "Leave without saving?" dialog appears first when the open form has unsaved changes
 * (see AutosaveLeaveGuard for forms that save automatically).
 */
export function DashboardButton() {
  const {
    config: {
      routes: { admin },
    },
  } = useConfig()
  const pathname = usePathname()
  const href = admin || '/'

  if (pathname === href || pathname === `${href}/`) return null

  return (
    <Link className="tol-dashboard-button" href={href} prefetch={false}>
      <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      <span>Dashboard</span>
    </Link>
  )
}
