import type { Metadata } from 'next'
import { getDictionary, type Locale } from '@/lib/i18n'
import { flattenTopics } from '@/lib/topics'
import { TOPIC_DATES } from '@/lib/dates'

const BASE_URL = 'https://learn.logge.top'

export function getTopicMetadata(topicId: string, locale: Locale): Metadata {
  const dict = getDictionary(locale)
  const otherLocale: Locale = locale === 'en' ? 'de' : 'en'
  const topic = flattenTopics().find((t) => t.id === topicId)
  
  if (!topic || !topic.path) {
    return {}
  }

  const title = dict.topicNames[topicId as keyof typeof dict.topicNames] || topic.name
  const description = dict.topicDescriptions[topicId as keyof typeof dict.topicDescriptions] || ''
  const url = `${BASE_URL}/${locale}${topic.path}`
  const otherUrl = `${BASE_URL}/${otherLocale}${topic.path}`

  return {
    title: `${title} | Learn AI`,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en${topic.path}`,
        de: `${BASE_URL}/de${topic.path}`,
      },
    },
    openGraph: {
      title: `${title} | Learn AI`,
      description,
      type: 'article',
      url,
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
      locale: locale === 'de' ? 'de_DE' : 'en_US',
      alternateLocale: locale === 'de' ? 'en_US' : 'de_DE',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Learn AI`,
      description,
      images: ['/og-image.png'],
    },
  }
}

export function getTopicJsonLd(topicId: string, locale: Locale) {
  const dict = getDictionary(locale)
  const topic = flattenTopics().find((t) => t.id === topicId)
  if (!topic || !topic.path) return null

  const title = dict.topicNames[topicId as keyof typeof dict.topicNames] || topic.name
  const description = dict.topicDescriptions[topicId as keyof typeof dict.topicDescriptions] || ''
  const url = `${BASE_URL}/${locale}${topic.path}`
  const datePublished = TOPIC_DATES[topicId] || '2026-01-24'

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    inLanguage: locale,
    datePublished,
    dateModified: datePublished,
    author: { '@type': 'Organization', name: 'Learn AI', url: BASE_URL },
    publisher: { '@type': 'Organization', name: 'Learn AI', url: BASE_URL },
    isPartOf: { '@type': 'WebSite', name: 'Learn AI', url: BASE_URL },
  }
}

export function getHomepageJsonLd(locale: Locale) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Learn AI',
      url: BASE_URL,
      description: 'Master artificial intelligence and large language model concepts through beautiful, interactive demonstrations.',
      inLanguage: [locale],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: 'Learn AI - Interactive Guide to Artificial Intelligence',
      url: `${BASE_URL}/${locale}`,
      description: 'Master artificial intelligence and large language model concepts through beautiful, interactive demonstrations.',
      provider: { '@type': 'Organization', name: 'Learn AI' },
      educationalLevel: 'Beginner to Expert',
      about: { '@type': 'Thing', name: 'Artificial Intelligence' },
      inLanguage: locale,
    },
  ]
}
