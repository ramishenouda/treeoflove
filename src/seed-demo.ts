/**
 * tree-of-love-demo — realistic demonstration content using seedassets/.
 * Run: npm run seed:demo
 * Idempotent: re-runs update existing demo rows; media is keyed by filename.
 */
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import {
  DEMO_SEED,
  PRIVACY_DRAFT_WATERMARK,
  ensureSeedMedia,
  findBySlug,
  richText,
} from './seed/helpers'

type Counts = {
  media: number
  siteSettings: number
  home: number
  about: number
  team: number
  programs: number
  children: number
  news: number
  albums: number
  privacy: number
}

async function seedDemo(payload: Payload): Promise<Counts> {
  const counts: Counts = {
    media: 0,
    siteSettings: 0,
    home: 0,
    about: 0,
    team: 0,
    programs: 0,
    children: 0,
    news: 0,
    albums: 0,
    privacy: 0,
  }

  const media = {
    hero: await trackMedia(payload, counts, '6.jpg', 'Children gathered outdoors at a Tree of Love activity — homepage demonstration photo'),
    about: await trackMedia(payload, counts, '2.jpg', 'Group gathering for Tree of Love — About page demonstration photo'),
    programEducation: await trackMedia(payload, counts, '3.jpg', 'Children in a learning activity — education program demonstration photo'),
    programSupplies: await trackMedia(payload, counts, '4.jpg', 'Children with learning materials — school supplies program demonstration photo'),
    programCommunity: await trackMedia(payload, counts, '5.jpg', 'Community learning day — educational program demonstration photo'),
    community1: await trackMedia(payload, counts, '1.jpg', 'Community gathering — Tree of Love demonstration photo'),
    community7: await trackMedia(payload, counts, '7.jpg', 'Children and carers outdoors — Tree of Love demonstration photo'),
    child1: await trackMedia(payload, counts, 'child-1.jpg', 'Demonstration photograph for a Tree of Love sample child profile'),
    child2: await trackMedia(payload, counts, 'child-2.webp', 'Demonstration photograph for a Tree of Love sample child profile'),
    child3: await trackMedia(payload, counts, 'child-3.jpg', 'Demonstration photograph for a Tree of Love sample child profile'),
    child4: await trackMedia(payload, counts, 'child-4.jpg', 'Demonstration photograph for a Tree of Love sample child profile'),
    child5: await trackMedia(payload, counts, 'child5.webp', 'Demonstration photograph for a Tree of Love sample child profile'),
    child6: await trackMedia(payload, counts, 'child6.webp', 'Demonstration photograph for a Tree of Love sample child profile'),
    child7: await trackMedia(payload, counts, 'child7.jpg', 'Demonstration photograph for a Tree of Love sample child profile'),
    child8: await trackMedia(payload, counts, 'child8.jpg', 'Demonstration photograph for a Tree of Love sample child profile'),
  }

  await seedSiteSettings(payload, counts)
  const programIds = await seedPrograms(payload, counts, media)
  await seedChildren(payload, counts, media, programIds)
  await seedNews(payload, counts, media)
  await seedAlbums(payload, counts, media)
  await seedTeam(payload, counts)
  await seedHome(payload, counts, media)
  await seedAbout(payload, counts, media)
  await seedPrivacy(payload, counts)

  return counts
}

async function trackMedia(
  payload: Payload,
  counts: Counts,
  filename: string,
  alt: string,
): Promise<number> {
  const before = await payload.find({
    collection: 'media',
    overrideAccess: true,
    depth: 0,
    limit: 1,
    where: { filename: { equals: filename } },
  })
  const id = await ensureSeedMedia(payload, filename, alt)
  if (!before.docs[0]) counts.media += 1
  return id
}

async function seedSiteSettings(payload: Payload, counts: Counts) {
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true, depth: 0 })
  const data: Record<string, unknown> = {}

  if (!settings.siteName) data.siteName = 'Tree of Love'
  if (!settings.tagline) data.tagline = 'Care, learning, and a safe place to grow'
  if (!settings.footerEmail) data.footerEmail = 'hello@treeoflove.life'
  if (!settings.footerPhone) data.footerPhone = '+49 000 000000'
  if (!settings.footerLocation) data.footerLocation = 'European Union'
  if (!settings.notificationEmail) {
    data.notificationEmail = settings.footerEmail || 'hello@treeoflove.life'
  }
  if (!settings.minimumAmount) data.minimumAmount = 5
  if (!settings.suggestedAmounts?.length) {
    data.suggestedAmounts = [{ amount: 10 }, { amount: 25 }, { amount: 50 }, { amount: 100 }]
  }

  if (Object.keys(data).length) {
    await payload.updateGlobal({ slug: 'site-settings', data })
    counts.siteSettings = 1
  } else {
    counts.siteSettings = 0
  }
}

async function seedPrograms(
  payload: Payload,
  counts: Counts,
  media: Record<string, number>,
) {
  const programs = [
    {
      title: 'Education support',
      slug: 'education-support',
      summary: 'Quiet learning time, reading help, and encouragement after school.',
      story: [
        'Education support gives children a calm place to catch up on lessons, practise reading, and ask questions with a trusted adult nearby.',
        'Gifts help pay for learning materials, volunteer coordination, and the spaces where afternoon sessions happen.',
        'This is demonstration program copy for Tree of Love. Staff can edit every field in the admin.',
      ],
      cover: media.programEducation,
      sortOrder: 1,
    },
    {
      title: 'School supplies',
      slug: 'school-supplies',
      summary: 'Notebooks, pencils, and the everyday tools children need for class.',
      story: [
        'School supplies removes a small barrier that can keep a child from feeling ready in the classroom.',
        'Monthly and one-time gifts stock backpacks, stationery, and shared classroom kits for children in the programs.',
        'This is demonstration program copy for Tree of Love. Staff can edit every field in the admin.',
      ],
      cover: media.programSupplies,
      sortOrder: 2,
    },
    {
      title: 'Community support',
      slug: 'community-support',
      summary: 'Shared meals, neighbour gatherings, and practical help for families.',
      story: [
        'Community support keeps families connected through shared tables, open afternoons, and simple practical help.',
        'Gifts fund food, meeting spaces, and the people who welcome children and carers into a steady rhythm of care.',
        'This is demonstration program copy for Tree of Love. Staff can edit every field in the admin.',
      ],
      cover: media.programCommunity,
      sortOrder: 3,
    },
    {
      title: 'Child well-being',
      slug: 'child-wellbeing',
      summary: 'Safe play, attentive adults, and time to rest and grow.',
      story: [
        'Child well-being protects ordinary childhood moments: outdoor play, quiet rest, and someone watching with care.',
        'Gifts keep yards, games, and staff time available so children can spend afternoons somewhere safe and familiar.',
        'This is demonstration program copy for Tree of Love. Staff can edit every field in the admin.',
      ],
      cover: media.community7,
      sortOrder: 4,
    },
  ]

  const ids: Record<string, number> = {}
  for (const program of programs) {
    const data = {
      title: program.title,
      slug: program.slug,
      summary: program.summary,
      story: richText(...program.story),
      cover: program.cover,
      sortOrder: program.sortOrder,
      acceptDonations: true,
      _status: 'published' as const,
      meta: {
        title: `${program.title} | Tree of Love`,
        description: program.summary,
        image: program.cover,
      },
    }
    const existing = await findBySlug(payload, 'programs', program.slug)
    if (existing) {
      await payload.update({
        collection: 'programs',
        id: existing.id,
        draft: false,
        data,
      })
      ids[program.slug] = Number(existing.id)
    } else {
      const created = await payload.create({ collection: 'programs', draft: false, data })
      ids[program.slug] = Number(created.id)
    }
    counts.programs += 1
  }
  return ids
}

async function seedChildren(
  payload: Payload,
  counts: Counts,
  media: Record<string, number>,
  programIds: Record<string, number>,
) {
  const children = [
    {
      firstName: 'Maya',
      slug: 'demo-maya',
      age: 8,
      program: programIds['education-support'],
      photo: media.child1,
      shortStory:
        'Sample profile: enjoys reading time in the education support program. This story describes program participation, not a personal biography of the person in the photo.',
      sortOrder: 1,
    },
    {
      firstName: 'Leo',
      slug: 'demo-leo',
      age: 10,
      program: programIds['school-supplies'],
      photo: media.child2,
      shortStory:
        'Sample profile: benefits from school supplies that make classroom days easier. This story describes program participation, not a personal biography of the person in the photo.',
      sortOrder: 2,
    },
    {
      firstName: 'Nora',
      slug: 'demo-nora',
      age: 7,
      program: programIds['community-support'],
      photo: media.child3,
      shortStory:
        'Sample profile: joins community gatherings and shared meals. This story describes program participation, not a personal biography of the person in the photo.',
      sortOrder: 3,
    },
    {
      firstName: 'Sam',
      slug: 'demo-sam',
      age: 9,
      program: programIds['child-wellbeing'],
      photo: media.child4,
      shortStory:
        'Sample profile: spends afternoons in safe play with attentive adults nearby. This story describes program participation, not a personal biography of the person in the photo.',
      sortOrder: 4,
    },
    {
      firstName: 'Ira',
      slug: 'demo-ira',
      age: 11,
      program: programIds['education-support'],
      photo: media.child5,
      shortStory:
        'Sample profile: practises homework with a helper after school. This story describes program participation, not a personal biography of the person in the photo.',
      sortOrder: 5,
    },
    {
      firstName: 'Ben',
      slug: 'demo-ben',
      age: 6,
      program: programIds['child-wellbeing'],
      photo: media.child6,
      shortStory:
        'Sample profile: enjoys outdoor games in a watched play space. This story describes program participation, not a personal biography of the person in the photo.',
      sortOrder: 6,
    },
    {
      firstName: 'Lina',
      slug: 'demo-lina',
      age: 8,
      program: programIds['school-supplies'],
      photo: media.child7,
      shortStory:
        'Sample profile: receives notebooks and tools for learning days. This story describes program participation, not a personal biography of the person in the photo.',
      sortOrder: 7,
    },
    {
      firstName: 'Omar',
      slug: 'demo-omar',
      age: 12,
      program: programIds['community-support'],
      photo: media.child8,
      shortStory:
        'Sample profile: helps set tables at community meals. This story describes program participation, not a personal biography of the person in the photo.',
      sortOrder: 8,
    },
  ]

  for (const child of children) {
    const data = {
      firstName: child.firstName,
      slug: child.slug,
      photo: child.photo,
      shortStory: child.shortStory,
      age: child.age,
      program: child.program,
      sortOrder: child.sortOrder,
      photoConsent: true,
      acceptDonations: true,
      privateNotes: `${DEMO_SEED}: Demonstration sample profile. Not an identity claim about the person in the photograph. Staff should replace with real consented profiles before launch.`,
      _status: 'published' as const,
      meta: {
        title: `${child.firstName} | Tree of Love`,
        description: `Sample child profile for Tree of Love demonstration content.`,
        image: child.photo,
      },
    }
    const existing = await findBySlug(payload, 'children', child.slug)
    if (existing) {
      await payload.update({
        collection: 'children',
        id: existing.id,
        draft: false,
        data,
      })
    } else {
      await payload.create({ collection: 'children', draft: false, data })
    }
    counts.children += 1
  }
}

async function seedNews(
  payload: Payload,
  counts: Counts,
  media: Record<string, number>,
) {
  const articles = [
    {
      title: 'Learning days begin again',
      slug: 'demo-learning-days',
      publishedOn: '2026-09-05',
      summary: 'Afternoon education support sessions are open for the new season.',
      body: [
        'Tree of Love has opened the afternoon learning rooms for another season. Children arrive after school for reading, homework help, and a quiet place to ask questions.',
        'This article is demonstration content. Staff can replace it with a real update from the programs.',
      ],
      cover: media.programEducation,
    },
    {
      title: 'School bags ready for the week',
      slug: 'demo-school-bags',
      publishedOn: '2026-09-18',
      summary: 'School supplies kits are packed and ready for children who need them.',
      body: [
        'Volunteers packed notebooks, pencils, and shared classroom kits this week. The school supplies program makes sure children can start Monday with the tools they need.',
        'This article is demonstration content. Staff can replace it with a real update from the programs.',
      ],
      cover: media.programSupplies,
    },
    {
      title: 'A shared table in the community',
      slug: 'demo-shared-table',
      publishedOn: '2026-10-01',
      summary: 'Neighbours gathered for a community meal and an open afternoon.',
      body: [
        'Families and carers sat together for a simple meal and an afternoon of conversation. Community support is about belonging as much as practical help.',
        'This article is demonstration content. Staff can replace it with a real update from the programs.',
      ],
      cover: media.community1,
    },
    {
      title: 'Safe play under the trees',
      slug: 'demo-safe-play',
      publishedOn: '2026-10-12',
      summary: 'Child well-being afternoons keep outdoor play watched and welcoming.',
      body: [
        'The yard is open again for games, rest, and time outdoors with staff nearby. Child well-being protects ordinary childhood moments.',
        'This article is demonstration content. Staff can replace it with a real update from the programs.',
      ],
      cover: media.community7,
    },
  ]

  for (const article of articles) {
    const data = {
      title: article.title,
      slug: article.slug,
      publishedOn: article.publishedOn,
      summary: article.summary,
      body: richText(...article.body),
      cover: article.cover,
      _status: 'published' as const,
      meta: {
        title: `${article.title} | Tree of Love`,
        description: article.summary,
        image: article.cover,
      },
    }
    const existing = await findBySlug(payload, 'news', article.slug)
    if (existing) {
      await payload.update({
        collection: 'news',
        id: existing.id,
        draft: false,
        data,
      })
    } else {
      await payload.create({ collection: 'news', draft: false, data })
    }
    counts.news += 1
  }
}

async function seedAlbums(
  payload: Payload,
  counts: Counts,
  media: Record<string, number>,
) {
  const albums = [
    {
      title: 'Learning days',
      slug: 'learning-days',
      sortOrder: 1,
      photos: [
        { image: media.programEducation, caption: 'An afternoon education session.' },
        { image: media.programSupplies, caption: 'Learning materials ready for the week.' },
        { image: media.programCommunity, caption: 'Children together during a learning day.' },
      ],
    },
    {
      title: 'Community moments',
      slug: 'community-moments',
      sortOrder: 2,
      photos: [
        { image: media.community1, caption: 'A community gathering.' },
        { image: media.community7, caption: 'Outdoor time with carers nearby.' },
        { image: media.hero, caption: 'Children gathered at a Tree of Love activity.' },
      ],
    },
  ]

  for (const album of albums) {
    const data = {
      title: album.title,
      slug: album.slug,
      sortOrder: album.sortOrder,
      published: true,
      photos: album.photos,
    }
    const existing = await findBySlug(payload, 'albums', album.slug)
    if (existing) {
      await payload.update({
        collection: 'albums',
        id: existing.id,
        data,
      })
    } else {
      await payload.create({ collection: 'albums', data })
    }
    counts.albums += 1
  }
}

async function seedTeam(payload: Payload, counts: Counts) {
  const team = [
    {
      name: 'Mara Kovacs',
      role: 'Director',
      bio: 'Mara keeps Tree of Love’s programs connected and makes sure every afternoon has the people and places children need. Demonstration team profile.',
      sortOrder: 1,
    },
    {
      name: 'Jonas Weber',
      role: 'Programs lead',
      bio: 'Jonas visits learning, supplies, community, and well-being sessions and writes the updates visitors see in the news. Demonstration team profile.',
      sortOrder: 2,
    },
    {
      name: 'Elena Rossi',
      role: 'Partnerships',
      bio: 'Elena works with schools, neighbours, and donors who keep the work going month by month. Demonstration team profile.',
      sortOrder: 3,
    },
  ]

  for (const member of team) {
    const existing = await payload.find({
      collection: 'team',
      overrideAccess: true,
      depth: 0,
      limit: 1,
      where: { name: { equals: member.name } },
    })
    const data = {
      name: member.name,
      role: member.role,
      bio: member.bio,
      sortOrder: member.sortOrder,
      published: true,
    }
    if (existing.docs[0]) {
      await payload.update({
        collection: 'team',
        id: existing.docs[0].id,
        data,
      })
    } else {
      await payload.create({ collection: 'team', data })
    }
    counts.team += 1
  }
}

async function seedHome(
  payload: Payload,
  counts: Counts,
  media: Record<string, number>,
) {
  await payload.updateGlobal({
    slug: 'home',
    draft: false,
    data: {
      heading: 'A safe place to grow',
      intro:
        'Tree of Love runs education support, school supplies, community gatherings, and safe play. Give once or every month — to the whole work, a program, or a child.',
      _status: 'published',
      meta: {
        title: 'A safe place to grow | Tree of Love',
        description:
          'Tree of Love runs education support, school supplies, community gatherings, and safe play. Give once or every month.',
        image: media.hero,
      },
      sections: [
        {
          heading: 'Care that shows up every week',
          body: richText(
            'Children need meals of attention as much as meals of food: a helper for homework, a notebook for Monday, a yard with someone watching.',
            'Your gift keeps those ordinary weeks possible. Choose the general fund, a program, or a child profile.',
          ),
          image: media.hero,
        },
        {
          heading: 'Programs that fit real days',
          body: richText(
            'Education support, school supplies, community support, and child well-being work together so families can count on a steady rhythm.',
            'Open any program to read the story and meet the children linked to it.',
          ),
          image: media.programEducation,
        },
        {
          heading: 'A community that gathers',
          body: richText(
            'Shared tables and open afternoons keep neighbours connected. Gallery albums show the places and moments that make Tree of Love feel like home.',
          ),
          image: media.community1,
        },
      ],
    },
  })
  counts.home = 1
}

async function seedAbout(
  payload: Payload,
  counts: Counts,
  media: Record<string, number>,
) {
  await payload.updateGlobal({
    slug: 'about',
    draft: false,
    data: {
      heading: 'About Tree of Love',
      image: media.about,
      _status: 'published',
      meta: {
        title: 'About | Tree of Love',
        description: 'The mission, values, and people behind Tree of Love.',
        image: media.about,
      },
      mission: richText(
        'Tree of Love makes ordinary days safer and kinder for children: learning help, school supplies, community belonging, and watched play.',
        'We exist so families can count on a place that shows up every week — not only in an emergency.',
      ),
      story: richText(
        'Tree of Love began with neighbours sharing a table, then books, then an afternoon yard. The programs on this site grew from that same idea: care that fits into real days.',
        'The people, photos, and stories here include demonstration content staff can replace with living updates from the organization.',
      ),
      sections: [
        {
          heading: 'Our values',
          body: richText(
            'Dignity for every child, honesty with donors, and protection of privacy in every published profile.',
            'We publish first names and short program stories only after photo consent is recorded.',
          ),
        },
        {
          heading: 'Educational support',
          body: richText(
            'After-school learning and school supplies remove barriers that can make a classroom day harder than it needs to be.',
            'Volunteers and staff sit with children, stock kits, and keep the rooms ready.',
          ),
        },
        {
          heading: 'Community involvement',
          body: richText(
            'Shared meals and open afternoons invite neighbours into the work. Partnerships with schools and local carers keep support close to where children live.',
          ),
        },
        {
          heading: 'Our vision',
          body: richText(
            'A community where every child has a safe place to learn, play, and be known — and where giving is simple, transparent, and monthly if that helps.',
          ),
        },
      ],
    },
  })
  counts.about = 1
}

async function seedPrivacy(payload: Payload, counts: Counts) {
  const privacy = await payload.findGlobal({ slug: 'privacy', overrideAccess: true, depth: 0, draft: true })
  const bodyText = JSON.stringify(privacy.body ?? '')
  const hasBody = Boolean(privacy.body)
  const isOurDraft = bodyText.includes(PRIVACY_DRAFT_WATERMARK)
  const looksApproved = hasBody && !isOurDraft

  if (looksApproved) {
    counts.privacy = 0
    return
  }

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
        `${PRIVACY_DRAFT_WATERMARK} This sample privacy policy is demonstration content only. Replace it with a lawyer-reviewed policy before launch.`,
        'Tree of Love operates this website. This page explains what the site stores. Staff can replace every paragraph in the admin.',
        'The contact form asks for your name, email address, and message. Sending it requires a tick to say you agree to this policy. The message is saved in the staff admin and emailed to the organization. The notification address is not shown on the public website.',
        'Donations are paid through Stripe in euros, once or every month. Stripe processes the card or SEPA payment and emails the receipt. Tree of Love stores the amount, whether the gift repeats, the general fund, program, or child it was for, the date, and the Stripe reference. Card numbers and bank account numbers stay with Stripe.',
        'A published child profile shows a first name, a photo, a short story, and sometimes an age. Private notes are stored for staff and are not part of the public website. A profile is published only after photo consent is recorded.',
        'This version of the site does not use analytics cookies.',
        'To ask about your message or a gift, use the contact form.',
      ),
    },
  })
  counts.privacy = 1
}

const payload = await getPayload({ config })
try {
  payload.logger.info(`Starting ${DEMO_SEED}…`)
  const counts = await seedDemo(payload)
  payload.logger.info(
    [
      `${DEMO_SEED} complete:`,
      `  media uploaded (new): ${counts.media}`,
      `  site settings updated: ${counts.siteSettings}`,
      `  home: ${counts.home}`,
      `  about: ${counts.about}`,
      `  team: ${counts.team}`,
      `  programs: ${counts.programs}`,
      `  children: ${counts.children}`,
      `  news: ${counts.news}`,
      `  albums: ${counts.albums}`,
      `  privacy written: ${counts.privacy}`,
    ].join('\n'),
  )
} finally {
  await payload.destroy()
}
