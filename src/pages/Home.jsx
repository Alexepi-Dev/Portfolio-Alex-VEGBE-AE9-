import { lazy, Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import About from '../components/About'
import Services from '../components/Services'
import Projects from '../components/Projects'
import Skills from '../components/Skills'
import { ChallengeCatalog } from '../components/Challenge'
import Contact from '../components/Contact'
import { scrollToSection } from '../utils'

const EditorialSection = lazy(() => import('../components/EditorialSection'))

export default function Home() {
  const { state } = useLocation()
  const { t } = useSettings()

  useEffect(() => {
    if (!state?.scrollTo) return undefined
    const timer = setTimeout(() => scrollToSection(state.scrollTo), 350)
    return () => clearTimeout(timer)
  }, [state])

  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Projects />
      <Suspense fallback={
        <section id="actualites" className="editorial-section container" aria-live="polite">
          <p className="editorial-empty">{t.editorial.loading}</p>
        </section>
      }>
        <EditorialSection />
      </Suspense>
      <Skills />
      <ChallengeCatalog />
      <Contact />
    </main>
  )
}
