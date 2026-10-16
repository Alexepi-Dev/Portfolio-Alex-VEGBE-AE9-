import { FaLinkedin, FaFacebook } from 'react-icons/fa'
import { useSettings } from '../context/SettingsContext'
import { socials } from '../data/content'

const icons = { linkedin: FaLinkedin, facebook: FaFacebook }

export default function Footer() {
  const { t } = useSettings()
  return (
    <footer>
      <div className="container footer-content">
        <p className="footer-rights">{t.footer.rights}</p>
        <div className="footer-socials">
          {socials.map(({ id, label, href }) => {
            const Icon = icons[id]
            return (
              <a key={id} href={href} target="_blank" rel="noopener noreferrer" title={label} aria-label={label}>
                <Icon aria-hidden="true" />
              </a>
            )
          })}
        </div>
        <p className="footer-signature">{t.footer.signature}</p>
      </div>
    </footer>
  )
}
