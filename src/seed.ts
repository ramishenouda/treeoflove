import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'

function richText(...paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text,
            version: 1,
          },
        ],
      })),
    },
  }
}

async function colorCard(rgb: { r: number; g: number; b: number }) {
  return sharp({
    create: { width: 1200, height: 800, channels: 3, background: rgb },
  })
    .png()
    .toBuffer()
}

async function upload(payload: Payload, name: string, alt: string, rgb: { r: number; g: number; b: number }) {
  const data = await colorCard(rgb)
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data,
      mimetype: 'image/png',
      name,
      size: data.length,
    },
  })
  return media.id
}

async function findBySlug(payload: Payload, collection: 'programs' | 'children' | 'news' | 'albums', slug: string) {
  const result = await payload.find({
    collection,
    overrideAccess: true,
    depth: 0,
    limit: 1,
    draft: true,
    where: { slug: { equals: slug } },
  })
  return result.docs[0]
}

async function seed(payload: Payload) {
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true, depth: 0 })
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: settings.siteName || 'Tree of Love',
      tagline: settings.tagline || 'Care, learning, and a safe place to grow',
      footerEmail: settings.footerEmail || 'hello@treeoflove.example',
      footerLocation: settings.footerLocation || 'European Union',
      notificationEmail: settings.notificationEmail || settings.footerEmail || 'hello@treeoflove.example',
      minimumAmount: settings.minimumAmount || 5,
    },
  })

  const mealsCover = await ensureProgram(payload, {
    title: 'School meals',
    slug: 'school-meals',
    summary: 'A warm meal in the middle of the day for children in the program.',
    story: 'Families choose this program when a regular meal would make the day easier. Gifts pay for food and the people who serve it.',
    sortOrder: 1,
    color: { r: 22, g: 101, b: 52 },
  })
  await ensureProgram(payload, {
    title: 'After-school learning',
    slug: 'after-school-learning',
    summary: 'Quiet time, books, and a helper for homework.',
    story: 'Children stay for a calm hour after lessons. Volunteers sit with them, read, and help with the work they bring from class.',
    sortOrder: 2,
    color: { r: 120, g: 80, b: 40 },
  })
  const playId = await ensureProgram(payload, {
    title: 'Safe places to play',
    slug: 'safe-places-to-play',
    summary: 'Outdoor time with someone watching, in a place set aside for play.',
    story: 'The program keeps a yard and a set of games ready. Children spend the afternoon outside with staff nearby.',
    sortOrder: 3,
    color: { r: 30, g: 90, b: 110 },
  })

  await ensureChild(payload, {
    firstName: 'Amina',
    slug: 'amina',
    age: 8,
    program: mealsCover,
    shortStory: 'Amina likes drawing and shares the midday meal with her friends.',
    legalName: 'Amina Berger',
    color: { r: 180, g: 90, b: 70 },
    sortOrder: 1,
  })
  await ensureChild(payload, {
    firstName: 'Leila',
    slug: 'leila',
    age: 11,
    program: await programId(payload, 'after-school-learning'),
    shortStory: 'Leila reads every afternoon and helps younger children find a book.',
    legalName: 'Leila Novak',
    color: { r: 90, g: 70, b: 140 },
    sortOrder: 2,
  })
  await ensureChild(payload, {
    firstName: 'Noah',
    slug: 'noah',
    age: 6,
    program: playId,
    shortStory: 'Noah spends his afternoons outside and looks after the football.',
    legalName: 'Noah Keller',
    color: { r: 40, g: 110, b: 130 },
    sortOrder: 3,
  })
  await ensureChild(payload, {
    firstName: 'Sofia',
    slug: 'sofia',
    age: 9,
    program: mealsCover,
    shortStory: 'Sofia helps set the tables and tells stories while everyone eats.',
    legalName: 'Sofia Marin',
    color: { r: 150, g: 110, b: 40 },
    sortOrder: 4,
  })

  await ensureNews(payload, {
    title: 'The garden tables are open again',
    slug: 'garden-tables-are-open',
    publishedOn: '2026-09-12',
    summary: 'Midday meals have started for the new season, with room for more children.',
    body: 'Staff set the tables under the trees this week. Children in the school meals program are eating together again, and there is room for a few more.',
  })
  await ensureNews(payload, {
    title: 'Volunteers wanted for reading hour',
    slug: 'volunteers-for-reading-hour',
    publishedOn: '2026-10-02',
    summary: 'The after-school program is looking for adults who can sit and read.',
    body: 'One afternoon a week is enough. You sit with a child, read a page, and listen. Write through the contact form if you want to join.',
  })

  await ensureAlbum(payload)

  const team = [
    ['Mara Kovacs', 'Director', 'Mara started Tree of Love and keeps the programs connected.', 1],
    ['Jonas Weber', 'Programs', 'Jonas visits each program and writes the updates you see in the news.', 2],
    ['Elena Rossi', 'Partnerships', 'Elena talks with the schools and donors who keep the work going.', 3],
  ] as const
  for (const [name, role, bio, sortOrder] of team) {
    const existing = await payload.find({
      collection: 'team',
      overrideAccess: true,
      depth: 0,
      limit: 1,
      where: { name: { equals: name } },
    })
    if (existing.docs[0]) continue
    await payload.create({
      collection: 'team',
      data: { name, role, bio, sortOrder, published: true },
    })
  }

  const home = await payload.findGlobal({ slug: 'home', overrideAccess: true, depth: 0, draft: true })
  if (!home.heading || home.heading === 'Test' || home.heading === 'A safe place to grow') {
    await payload.updateGlobal({
      slug: 'home',
      draft: false,
      data: {
        heading: 'A safe place to grow',
        intro: 'Tree of Love runs meals, learning time, and places to play. You can give once or every month, to the whole work or to one program or child.',
        _status: 'published',
        meta: {
          title: 'A safe place to grow | Tree of Love',
          description:
            'Tree of Love runs meals, learning time, and places to play. Give once or every month to the whole work, a program, or a child.',
        },
        sections: [
          {
            heading: 'How a gift is used',
            body: richText(
              'A one-time gift fills this month’s budget. A monthly gift lets staff plan the next season.',
              'You choose the general fund, a program, or a child. Stripe emails the receipt.',
            ),
          },
        ],
      },
    })
  }

  const about = await payload.findGlobal({ slug: 'about', overrideAccess: true, depth: 0, draft: true })
  if (!about.heading || about.heading === 'About Tree of Love') {
    await payload.updateGlobal({
      slug: 'about',
      draft: false,
      data: {
        heading: 'About Tree of Love',
        _status: 'published',
        meta: {
          title: 'About | Tree of Love',
          description: 'The mission and story of Tree of Love, and the people who run it.',
        },
        mission: richText(
          'Tree of Love makes ordinary days safer for children: a meal, an hour of reading, and a place to play with someone nearby.',
        ),
        story: richText(
          'The organization began with one shared table. Neighbors brought food, then books, then an afternoon yard.',
          'The people and the programs on this site are sample text, ready for the team to replace with their own.',
        ),
      },
    })
  }

  const privacy = await payload.findGlobal({ slug: 'privacy', overrideAccess: true, depth: 0, draft: true })
  const privacyText = JSON.stringify(privacy.body ?? '')
  if (!privacyText.includes('contact form') || privacy.meta?.title !== 'Privacy policy | Tree of Love') {
    await payload.updateGlobal({
      slug: 'privacy',
      draft: false,
      data: {
        title: 'Privacy policy',
        _status: 'published',
        meta: {
          title: 'Privacy policy | Tree of Love',
          description: 'How Tree of Love handles contact messages, donations, and child profiles.',
        },
        body: richText(
          'Tree of Love is the sample name of this organization. This page explains what the website stores. Staff can replace it with the organization’s own policy.',
          'The contact form asks for your name, email address, and message. Sending it requires a tick to say you agree to this policy. The message is saved in the staff admin and emailed to the organization. The notification address is not shown on the website.',
          'Donations are paid through Stripe in euros, once or every month. Stripe processes the card or SEPA payment and emails the receipt. Tree of Love stores the amount, whether the gift repeats, the general fund, program, or child it was for, the date, and the Stripe reference. Card numbers and bank account numbers stay with Stripe.',
          'A published child profile shows a first name, a photo, a short story, and sometimes an age. A legal name and private notes are stored for staff and are not part of the public website. A profile is published only after photo consent is recorded.',
          'This version of the site does not use analytics cookies.',
          'To ask about your message or a gift, use the contact form.',
        ),
      },
    })
  }
}

async function programId(payload: Payload, slug: string) {
  const existing = await findBySlug(payload, 'programs', slug)
  if (!existing) throw new Error(`Missing program ${slug}`)
  return existing.id
}

async function ensureProgram(
  payload: Payload,
  input: {
    title: string
    slug: string
    summary: string
    story: string
    sortOrder: number
    color: { r: number; g: number; b: number }
  },
) {
  const existing = await findBySlug(payload, 'programs', input.slug)
  if (existing) return existing.id
  const cover = await upload(payload, `${input.slug}.png`, `Colored placeholder for ${input.title}`, input.color)
  const created = await payload.create({
    collection: 'programs',
    draft: false,
    data: {
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      story: richText(input.story),
      cover,
      sortOrder: input.sortOrder,
      acceptDonations: true,
      _status: 'published',
    },
  })
  return created.id
}

async function ensureChild(
  payload: Payload,
  input: {
    firstName: string
    slug: string
    age: number
    program: number
    shortStory: string
    legalName: string
    color: { r: number; g: number; b: number }
    sortOrder: number
  },
) {
  const existingResult = await payload.find({
    collection: 'children',
    overrideAccess: true,
    depth: 0,
    limit: 1,
    draft: true,
    where: { slug: { equals: input.slug } },
  })
  const existing = existingResult.docs[0]
  if (existing?.shortStory) return
  const photo = await upload(payload, `${input.slug}.png`, `Colored placeholder for ${input.firstName}`, input.color)
  const data = {
    firstName: input.firstName,
    slug: input.slug,
    photo,
    shortStory: input.shortStory,
    age: input.age,
    program: input.program,
    sortOrder: input.sortOrder,
    photoConsent: true,
    acceptDonations: true,
    legalName: input.legalName,
    privateNotes: 'Sample note for staff. This note stays in the admin.',
    _status: 'published' as const,
  }
  if (existing) {
    await payload.update({
      collection: 'children',
      id: existing.id,
      draft: false,
      data,
    })
    return
  }
  await payload.create({ collection: 'children', draft: false, data })
}

async function ensureNews(
  payload: Payload,
  input: { title: string; slug: string; publishedOn: string; summary: string; body: string },
) {
  if (await findBySlug(payload, 'news', input.slug)) return
  await payload.create({
    collection: 'news',
    draft: false,
    data: {
      title: input.title,
      slug: input.slug,
      publishedOn: input.publishedOn,
      summary: input.summary,
      body: richText(input.body),
      _status: 'published',
    },
  })
}

async function ensureAlbum(payload: Payload) {
  if (await findBySlug(payload, 'albums', 'garden-afternoon')) return
  const yard = await upload(payload, 'garden-yard.png', 'Green placeholder for the garden yard', { r: 70, g: 120, b: 70 })
  const table = await upload(payload, 'garden-table.png', 'Warm placeholder for the meal table', { r: 160, g: 110, b: 60 })
  await payload.create({
    collection: 'albums',
    data: {
      title: 'A garden afternoon',
      slug: 'garden-afternoon',
      sortOrder: 1,
      published: true,
      photos: [
        { image: yard, caption: 'The yard used for afternoon play.' },
        { image: table, caption: 'Tables set for the midday meal.' },
      ],
    },
  })
}

const payload = await getPayload({ config })
try {
  await seed(payload)
  payload.logger.info('Sample Tree of Love content is ready.')
} finally {
  await payload.destroy()
}
