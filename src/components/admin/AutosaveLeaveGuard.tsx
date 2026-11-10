'use client'

import { LeaveWithoutSaving, useDocumentDrawerContext } from '@payloadcms/ui'

/**
 * Payload turns off its "Leave without saving?" dialog on forms that autosave. Autosave waits
 * about 1.5 seconds after the last keystroke, so anything typed just before leaving was lost
 * without a warning. This puts Payload's own dialog back. It only appears while changes are
 * not saved yet, and it covers every link (including the Dashboard button) and closing the tab.
 */
export function AutosaveLeaveGuard() {
  const { drawerSlug } = useDocumentDrawerContext()
  // A document opened in a pop-up drawer sits inside another form, which already has a guard.
  if (drawerSlug) return null
  return <LeaveWithoutSaving />
}
