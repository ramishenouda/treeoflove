import type { Field, Tab, UIField } from 'payload'

/** Records the staff member who saved last. Stored on every version, so the history shows who changed what. */
export const updatedByField: Field = {
  name: 'updatedBy',
  label: 'Last changed by',
  type: 'relationship',
  relationTo: 'users',
  admin: {
    position: 'sidebar',
    readOnly: true,
  },
  hooks: {
    beforeChange: [({ req, value }) => req.user?.id ?? value],
  },
}

function labelFor(field: Field): string | null {
  if (!('name' in field)) return null
  if ('label' in field && typeof field.label === 'string') return field.label
  const words = field.name.replace(/([A-Z])/g, ' $1').toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function localizedLabels(fields: Field[], parentLocalized = false): string[] {
  const labels: string[] = []
  for (const field of fields) {
    const localized = parentLocalized || ('localized' in field && field.localized === true)
    if (field.type === 'tabs') {
      for (const tab of field.tabs) labels.push(...localizedLabels(tab.fields))
      continue
    }
    if (localized && 'name' in field) {
      const label = labelFor(field)
      if (label) labels.push(label)
      continue
    }
    if ('fields' in field && Array.isArray(field.fields)) {
      labels.push(...localizedLabels(field.fields, localized))
    }
  }
  return labels
}

/** A banner that tells editors which language they are editing and which fields are translated. */
export function localeNotice(fields: Field[]): UIField {
  return {
    name: 'localeNotice',
    type: 'ui',
    admin: {
      components: {
        Field: {
          path: '/components/admin/LocaleNotice#LocaleNotice',
          clientProps: { translated: localizedLabels(fields) },
        },
      },
    },
  }
}

/** One content tab with the language banner on top. The SEO plugin adds its own tab next to it. */
export function contentTab(
  label: string,
  fields: Field[],
  options: { notice?: boolean } = {},
): Tab {
  const notice = options.notice ?? true
  return {
    label,
    fields: notice ? [localeNotice(fields), ...fields] : fields,
  }
}

/** Drafts save themselves while staff type, so live preview follows along. Publishing stays a deliberate click. */
export const draftVersions = {
  drafts: {
    autosave: { interval: 1500 },
  },
  maxPerDoc: 50,
}

/** Prepends the language banner to a flat field list. */
export function withLocaleNotice(fields: Field[]): Field[] {
  return [localeNotice(fields), ...fields]
}
