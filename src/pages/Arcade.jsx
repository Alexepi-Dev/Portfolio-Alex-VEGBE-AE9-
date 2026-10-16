import { Link } from 'react-router-dom'
import AlexArcade from '../components/AlexArcade'
import { useSettings } from '../context/SettingsContext'
import './ArcadePage.css'

export default function Arcade() {
  const { t } = useSettings()
  return (
    <main className="app-page arcade-page">
      <AlexArcade />
      <Link to="/" state={{ scrollTo: 'projets' }} className="btn-back">{t.apps.back}</Link>
    </main>
  )
}
