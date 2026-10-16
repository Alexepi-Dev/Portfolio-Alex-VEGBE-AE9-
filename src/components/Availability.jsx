import { useSettings } from '../context/SettingsContext'
import { AVAILABLE } from '../data/content'

// Pastille de disponibilité (point animé)
export default function Availability() {
  const { t } = useSettings()
  return (
    <span className={`availability ${AVAILABLE ? 'on' : 'off'}`} role="status">
      <span className="dot" aria-hidden="true" />
      {AVAILABLE ? t.availability.label : t.availability.off}
    </span>
  )
}
