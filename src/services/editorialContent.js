import { parse as parseYaml } from 'yaml'

const contentFiles = {
  actualites: import.meta.glob('../content/actualites/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
  articles: import.meta.glob('../content/articles/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
}

function asText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function reportInvalidField(path, field) {
  console.error(`Invalid "${field}" value in editorial content at ${path}.`)
}

function parseEntry(path, source) {
  try {
    const normalizedSource = source.replace(/^\uFEFF/, '')
    const frontMatterMatch = normalizedSource.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
    if (!frontMatterMatch) {
      throw new Error('YAML front matter is missing.')
    }

    const attributes = parseYaml(frontMatterMatch[1]) || {}
    const body = normalizedSource.slice(frontMatterMatch[0].length)
    const title = asText(attributes.title)
    const description = asText(attributes.description)
    const dateValue = attributes.date
    const date = dateValue instanceof Date ? dateValue.toISOString() : asText(dateValue)

    if (!title || !description || !date || Number.isNaN(Date.parse(date))) {
      throw new Error('Required title, description, or valid date is missing.')
    }

    const fileName = path.split('/').pop() || ''
    const categoryValue = attributes.category
    const coverValue = attributes.cover
    const rawTags = attributes.tags
    const category = asText(categoryValue)
    const cover = asText(coverValue)
    const validCover = cover.startsWith('/') || /^https:\/\//i.test(cover)
    const tags = Array.isArray(rawTags)
      ? rawTags.map((tag) => {
        if (typeof tag !== 'string') {
          reportInvalidField(path, 'tags')
          return ''
        }
        return tag.trim()
      }).filter(Boolean)
      : []

    if (categoryValue != null && typeof categoryValue !== 'string') {
      reportInvalidField(path, 'category')
    }
    if (coverValue != null && typeof coverValue !== 'string') {
      reportInvalidField(path, 'cover')
    } else if (cover && !validCover) {
      reportInvalidField(path, 'cover')
    }
    if (rawTags != null && !Array.isArray(rawTags)) {
      reportInvalidField(path, 'tags')
    }

    return {
      slug: fileName.replace(/\.md$/i, ''),
      title,
      description,
      date,
      category,
      cover: validCover ? cover : '',
      tags,
      body: typeof body === 'string' ? body.trim() : '',
    }
  } catch (error) {
    console.error(`Unable to load editorial content from ${path}.`, error)
    return null
  }
}

function loadEntries(type) {
  return Object.entries(contentFiles[type])
    .map(([path, source]) => parseEntry(path, source))
    .filter(Boolean)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

export const editorialContent = {
  actualites: loadEntries('actualites'),
  articles: loadEntries('articles'),
}

export function findRelatedEntries(type, currentEntry) {
  return editorialContent[type]
    .filter((entry) => entry.slug !== currentEntry.slug)
    .sort((a, b) => {
      const aMatches = currentEntry.category && a.category === currentEntry.category
      const bMatches = currentEntry.category && b.category === currentEntry.category
      return Number(bMatches) - Number(aMatches) || Date.parse(b.date) - Date.parse(a.date)
    })
    .slice(0, 3)
}
