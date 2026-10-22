import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { editorialContent } from '../services/editorialContent'
import SectionHeader from './SectionHeader'

function formatDate(date, lang) {
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(date))
}

export default function EditorialSection() {
  const { t, lang } = useSettings()
  const entries = editorialContent.actualites.slice(0, 3)

  return (
    <section id="actualites" className="editorial-section container">
      <SectionHeader title={t.editorial.news} />
      {entries.length ? (
        <div className="editorial-grid">
          {entries.map((entry) => (
            <article className="editorial-card" key={entry.slug}>
              {entry.cover && (
                <Link to={`/actualites/${entry.slug}`} className="editorial-card-image">
                  <img src={entry.cover} alt="" loading="lazy" />
                </Link>
              )}
              <div className="editorial-card-content">
                <time dateTime={entry.date}>{formatDate(entry.date, lang)}</time>
                <h3><Link to={`/actualites/${entry.slug}`}>{entry.title}</Link></h3>
                <p>{entry.description}</p>
                <Link className="editorial-read-more" to={`/actualites/${entry.slug}`}>
                  {t.editorial.readMore}
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="editorial-empty">{t.editorial.homeEmpty}</p>
      )}
      <div className="editorial-actions">
        <Link className="btn-link" to="/actualites">{t.editorial.moreNews}</Link>
        <Link className="btn-link btn-ghost" to="/articles">{t.editorial.moreArticles}</Link>
      </div>
    </section>
  )
}
