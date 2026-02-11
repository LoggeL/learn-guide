import type { MetadataRoute } from 'next'
import { flattenTopics } from '@/lib/topics'
import { TOPIC_DATES } from '@/lib/dates'

const BASE_URL = 'https://learn.logge.top'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'de']
  const topics = flattenTopics()
  const entries: MetadataRoute.Sitemap = []

  // Homepage for each locale
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date('2026-02-10'),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${BASE_URL}/en`,
          de: `${BASE_URL}/de`,
        },
      },
    })
  }

  // Topic pages
  for (const topic of topics) {
    if (!topic.path) continue
    const lastMod = TOPIC_DATES[topic.id]
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${topic.path}`,
        lastModified: lastMod ? new Date(lastMod) : new Date('2026-01-24'),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${topic.path}`,
            de: `${BASE_URL}/de${topic.path}`,
          },
        },
      })
    }
  }

  return entries
}
