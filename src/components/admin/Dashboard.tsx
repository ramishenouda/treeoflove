import type { Payload, ServerProps, Where } from 'payload'

type Attention = { label: string; count: number; href: string }

const euros = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' })
const shortDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })

/** Builds a list link with a filter, e.g. ?where[status][equals]=new, which the admin list view understands. */
function listHref(
  admin: string,
  collection: string,
  where?: Record<string, Record<string, unknown>>,
) {
  const params = new URLSearchParams()
  for (const [field, condition] of Object.entries(where ?? {})) {
    for (const [operator, value] of Object.entries(condition)) {
      params.set(`where[${field}][${operator}]`, String(value))
    }
  }
  const query = params.toString()
  return `${admin}/collections/${collection}${query ? `?${query}` : ''}`
}

async function count(
  payload: Payload,
  collection: 'children' | 'news' | 'programs' | 'media',
  where: Where,
) {
  const result = await payload.count({ collection, where, overrideAccess: true })
  return result.totalDocs
}

export async function Dashboard({ payload, user }: ServerProps) {
  if (!user) return null
  const admin = payload.config.routes.admin
  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)

  const draftWhere = { _status: { equals: 'draft' } }
  const consentWhere = { photoConsent: { not_equals: true } }

  const [newMessages, monthDonations, recentDonations, attentionCounts] = await Promise.all([
    payload.find({
      collection: 'messages',
      where: { status: { equals: 'new' } },
      sort: '-createdAt',
      limit: 5,
      depth: 0,
      overrideAccess: true,
      select: { name: true, message: true, createdAt: true },
    }),
    payload.find({
      collection: 'donations',
      where: { paidAt: { greater_than_equal: monthStart.toISOString() } },
      pagination: false,
      depth: 0,
      overrideAccess: true,
      select: { amount: true },
    }),
    payload.find({
      collection: 'donations',
      sort: '-paidAt',
      limit: 5,
      depth: 0,
      overrideAccess: true,
      select: { amount: true, targetName: true, frequency: true, paidAt: true },
    }),
    Promise.all([
      count(payload, 'children', consentWhere),
      count(payload, 'children', draftWhere),
      count(payload, 'programs', draftWhere),
      count(payload, 'news', draftWhere),
    ]),
  ])

  const [noConsent, childDrafts, programDrafts, newsDrafts] = attentionCounts
  const attention: Attention[] = [
    {
      label: 'Children without photo consent (cannot be published)',
      count: noConsent,
      href: listHref(admin, 'children', consentWhere),
    },
    {
      label: 'Child profiles not published yet',
      count: childDrafts,
      href: listHref(admin, 'children', draftWhere),
    },
    {
      label: 'Programs not published yet',
      count: programDrafts,
      href: listHref(admin, 'programs', draftWhere),
    },
    {
      label: 'News articles not published yet',
      count: newsDrafts,
      href: listHref(admin, 'news', draftWhere),
    },
  ].filter((item) => item.count > 0)

  const monthTotal = monthDonations.docs.reduce((sum, doc) => sum + (doc.amount || 0), 0)
  const name = ('name' in user && user.name) || user.email

  const actions = [
    { label: 'Write news', href: `${admin}/collections/news/create` },
    { label: 'Add a child', href: `${admin}/collections/children/create` },
    { label: 'Upload photos', href: `${admin}/collections/media` },
    { label: 'New gallery album', href: `${admin}/collections/albums/create` },
    { label: 'Edit home page', href: `${admin}/globals/home` },
  ]

  return (
    <section className="tol-dash" aria-label="Overview">
      <header className="tol-dash__head">
        <h1>Hello, {name}</h1>
        <p>Here is what needs you today. Everything else is in the menu on the left.</p>
      </header>

      <nav className="tol-dash__actions" aria-label="Quick actions">
        {actions.map((action) => (
          <a className="tol-dash__action" href={action.href} key={action.href}>
            {action.label}
          </a>
        ))}
      </nav>

      <div className="tol-dash__grid">
        <article className="tol-card">
          <div className="tol-card__top">
            <h2>Messages</h2>
            <a href={listHref(admin, 'messages', { status: { equals: 'new' } })}>
              {newMessages.totalDocs} new
            </a>
          </div>
          {newMessages.docs.length ? (
            <ul className="tol-list">
              {newMessages.docs.map((doc) => (
                <li key={doc.id}>
                  <a href={`${admin}/collections/messages/${doc.id}`}>
                    <strong>{doc.name}</strong>
                    <span>{doc.message?.slice(0, 90)}</span>
                  </a>
                  <time dateTime={doc.createdAt}>{shortDate.format(new Date(doc.createdAt))}</time>
                </li>
              ))}
            </ul>
          ) : (
            <p className="tol-empty">No new messages. Nice work.</p>
          )}
        </article>

        <article className="tol-card">
          <div className="tol-card__top">
            <h2>Donations</h2>
            <a href={listHref(admin, 'donations')}>See all</a>
          </div>
          <p className="tol-stat">
            <strong>{euros.format(monthTotal)}</strong>
            <span>
              this month · {monthDonations.docs.length}{' '}
              {monthDonations.docs.length === 1 ? 'gift' : 'gifts'}
            </span>
          </p>
          {recentDonations.docs.length ? (
            <ul className="tol-list">
              {recentDonations.docs.map((doc) => (
                <li key={doc.id}>
                  <a href={`${admin}/collections/donations/${doc.id}`}>
                    <strong>{euros.format(doc.amount || 0)}</strong>
                    <span>
                      {doc.targetName}
                      {doc.frequency === 'monthly' ? ' · monthly' : ''}
                    </span>
                  </a>
                  {doc.paidAt ? (
                    <time dateTime={doc.paidAt}>{shortDate.format(new Date(doc.paidAt))}</time>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="tol-empty">No donations yet.</p>
          )}
        </article>

        <article className="tol-card">
          <div className="tol-card__top">
            <h2>Needs attention</h2>
          </div>
          {attention.length ? (
            <ul className="tol-list">
              {attention.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>
                    <span>{item.label}</span>
                  </a>
                  <span className="tol-badge">{item.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="tol-empty">Nothing waiting. Everything is published and has consent.</p>
          )}
        </article>
      </div>
    </section>
  )
}
