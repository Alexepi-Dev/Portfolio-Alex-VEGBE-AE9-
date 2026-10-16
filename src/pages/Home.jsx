import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import About from '../components/About'
import Services from '../components/Services'
import Projects from '../components/Projects'
import Skills from '../components/Skills'
import { ChallengeCatalog } from '../components/Challenge'
import Contact from '../components/Contact'
import { scrollToSection } from '../utils'

export default function Home() {
  const { state } = useLocation()

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
      <Skills />
      <ChallengeCatalog />
      <Contact />
    </main>
  )
}
