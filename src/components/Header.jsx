import { FaMoon, FaSun } from 'react-icons/fa'
import { useSettings } from '../context/SettingsContext'

export default function Header() {
  const { t, lang, theme, toggleLang, toggleTheme } = useSettings()

  return (
    <header className="site-controls">
        <div className="toolbar">
          <button className="tool-btn lang-btn" onClick={toggleLang} aria-label={t.ui.langLabel} title={t.ui.langLabel}>
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <button
            className="tool-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.ui.themeToLight : t.ui.themeToDark}
            title={theme === 'dark' ? t.ui.themeToLight : t.ui.themeToDark}
          >
            {theme === 'dark' ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
          </button>
        </div>
    </header>
  )
}
