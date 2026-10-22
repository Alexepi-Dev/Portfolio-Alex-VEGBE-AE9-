import { useLocation, useNavigate } from 'react-router-dom'
import {
  FaBriefcase,
  FaEnvelope,
  FaHome,
  FaLightbulb,
  FaNewspaper,
  FaPuzzlePiece,
  FaTools,
  FaUser,
} from 'react-icons/fa'
import { useSettings } from '../context/SettingsContext'
import { scrollToSection } from '../utils'

const sectionIcons = [
  { id: 'accueil', label: (t) => t.nav.home, Icon: FaHome },
  { id: 'apropos', label: (t) => t.nav.about, Icon: FaUser },
  { id: 'services', label: (t) => t.nav.services, Icon: FaTools },
  { id: 'projets', label: (t) => t.nav.projects, Icon: FaBriefcase },
  { id: 'actualites', label: (t) => t.editorial.news, Icon: FaNewspaper },
  { id: 'competences', label: (t) => t.nav.skills, Icon: FaLightbulb },
  { id: 'defi', label: (t) => t.nav.challenge, Icon: FaPuzzlePiece },
  { id: 'contact', label: (t) => t.nav.contact, Icon: FaEnvelope },
]

export default function SectionNavigation() {
  const { t } = useSettings()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const goToSection = (event, id) => {
    event.preventDefault()
    if (pathname === '/') {
      scrollToSection(id)
      return
    }
    navigate('/', { state: { scrollTo: id } })
  }

  return (
    <nav className="section-navigation" aria-label={t.nav.label}>
      {sectionIcons.map(({ id, label, Icon }) => {
        const sectionLabel = label(t)
        return (
          <a
            key={id}
            href={`#${id}`}
            aria-label={sectionLabel}
            title={sectionLabel}
            onClick={(event) => goToSection(event, id)}
          >
            <Icon aria-hidden="true" />
          </a>
        )
      })}
    </nav>
  )
}
