import { useSettings } from '../context/SettingsContext'

// Bandeau défilant des outils et savoir-faire (la 2e copie est masquée aux lecteurs d'écran)
export default function Marquee() {
  const { t } = useSettings()
  const row = (hidden) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {t.marquee.map((w) => <li key={w}>{w}</li>)}
    </ul>
  )
  return (
    <div className="marquee" aria-label={t.marqueeLabel}>
      <div className="marquee-track">{row(false)}{row(true)}</div>
    </div>
  )
}
