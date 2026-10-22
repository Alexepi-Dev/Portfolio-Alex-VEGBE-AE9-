import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { useSettings } from '../context/SettingsContext'
import { editorialContent, findRelatedEntries } from '../services/editorialContent'

function formatDate(date, lang) {
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(date))
}

function EntryCard({ entry, type, lang, labels }) {
  return (
    <article className="editorial-card">
      {entry.cover && (
        <Link to={`/${type}/${entry.slug}`} className="editorial-card-image">
          <img src={entry.cover} alt="" loading="lazy" />
        </Link>
      )}
      <div className="editorial-card-content">
        <time dateTime={entry.date}>{formatDate(entry.date, lang)}</time>
        {entry.category && <span className="editorial-category">{entry.category}</span>}
        <h2><Link to={`/${type}/${entry.slug}`}>{entry.title}</Link></h2>
        <p>{entry.description}</p>
        <Link className="editorial-read-more" to={`/${type}/${entry.slug}`}>
          {labels.readMore}
        </Link>
      </div>
    </article>
  )
}

export default function EditorialPage({ type }) {
  const { t, lang } = useSettings()
  const { slug } = useParams()
  const labels = t.editorial
  const entries = editorialContent[type]
  const entry = slug ? entries.find((item) => item.slug === slug) : null
  const collectionLabel = type === 'actualites' ? labels.news : labels.articles
  const sanitizedBody = useMemo(
    () => DOMPurify.sanitize(marked.parse(entry?.body ?? '', { async: false })),
    [entry?.body],
  )

  useEffect(() => {
    const previousTitle = document.title
    const descriptionMeta = document.querySelector('meta[name="description"]')
    const previousDescription = descriptionMeta?.content
    const pageTitle = entry ? entry.title : collectionLabel
    const pageDescription = entry
      ? entry.description
      : type === 'actualites' ? labels.newsDescription : labels.articlesDescription

    document.title = `${pageTitle} | VEGBE Koffi Alex`
    if (descriptionMeta) descriptionMeta.content = pageDescription

    return () => {
      document.title = previousTitle
      if (descriptionMeta && previousDescription !== undefined) {
        descriptionMeta.content = previousDescription
      }
    }
  }, [collectionLabel, entry, labels.articlesDescription, labels.newsDescription, type])

  if (slug && !entry) {
    return (
      <main className="editorial-page container">
        <h1>{labels.notFound}</h1>
        <Link className="editorial-back" to={`/${type}`}>{labels.backToList}</Link>
      </main>
    )
  }

  if (!slug) {
    return (
      <main className="editorial-page container">
        <header className="editorial-page-header">
          <h1>{collectionLabel}</h1>
          <p className="section-lead">
            {type === 'actualites' ? labels.newsDescription : labels.articlesDescription}
          </p>
        </header>
        {entries.length ? (
          <div className="editorial-grid">
            {entries.map((item) => (
              <EntryCard
                key={item.slug}
                entry={item}
                type={type}
                lang={lang}
                labels={labels}
              />
            ))}
          </div>
        ) : (
          <p className="editorial-empty">
            {type === 'actualites' ? labels.emptyNews : labels.emptyArticles}
          </p>
        )}
      </main>
    )
  }

  const relatedEntries = findRelatedEntries(type, entry)

  return (
    <main className="editorial-page editorial-detail container">
      <Link className="editorial-back" to={`/${type}`}>{labels.backToList}</Link>
      <article>
        <header className="editorial-detail-header">
          <h1>{entry.title}</h1>
          <p className="editorial-meta">
            <span>{labels.publishedOn} </span>
            <time dateTime={entry.date}>{formatDate(entry.date, lang)}</time>
            {entry.category && <span className="editorial-category">{entry.category}</span>}
          </p>
          <p className="editorial-description">{entry.description}</p>
          {entry.tags.length > 0 && (
            <ul className="editorial-tags" aria-label={labels.tags}>
              {entry.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          )}
          {entry.cover && (
            <img className="editorial-cover" src={entry.cover} alt={entry.title} />
          )}
        </header>
        <div className="editorial-body" dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
      </article>
      {relatedEntries.length > 0 && (
        <aside className="editorial-related">
          <h2>{labels.related}</h2>
          <div className="editorial-grid">
            {relatedEntries.map((item) => (
              <EntryCard
                key={item.slug}
                entry={item}
                type={type}
                lang={lang}
                labels={labels}
              />
            ))}
          </div>
        </aside>
      )}
    </main>
  )
}
