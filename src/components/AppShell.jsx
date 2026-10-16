import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'

export default function AppShell({ title, children, wide = false, className = '' }) {
  const { t } = useSettings()
  return (
    <main className={`app-page ${className}`.trim()}>
      <div className={`app-card ${wide ? 'app-card-wide' : ''}`}>
        <h1 className="app-title">{title}</h1>
        {children}
      </div>
      <Link to="/" state={{ scrollTo: 'projets' }} className="btn-back">{t.apps.back}</Link>
    </main>
  )
}
