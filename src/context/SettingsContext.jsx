import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { dictionaries } from '../i18n'

const SettingsContext = createContext(null)

const read = (key) => { try { return localStorage.getItem(key) } catch { return null } }
const write = (key, value) => { try { localStorage.setItem(key, value) } catch { /* stockage indisponible */ } }

export function SettingsProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = read('lang')
    if (saved === 'fr' || saved === 'en') return saved
    return (navigator.language || 'fr').toLowerCase().startsWith('en') ? 'en' : 'fr'
  })
  const [theme, setTheme] = useState(() => (read('theme') === 'light' ? 'light' : 'dark'))

  useEffect(() => { document.documentElement.lang = lang; write('lang', lang) }, [lang])
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); write('theme', theme) }, [theme])

  const toggleLang = useCallback(() => setLang((l) => (l === 'fr' ? 'en' : 'fr')), [])
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  const value = useMemo(() => ({ lang, theme, t: dictionaries[lang], toggleLang, toggleTheme }), [lang, theme, toggleLang, toggleTheme])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettings = () => useContext(SettingsContext)
