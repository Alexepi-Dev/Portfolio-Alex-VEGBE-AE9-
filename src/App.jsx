import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import Header from './components/Header'
import SectionNavigation from './components/SectionNavigation'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import Home from './pages/Home'
import AnagramGame from './pages/AnagramGame'
import LoanCalculator from './pages/LoanCalculator'
import Challenge from './components/Challenge'
import { useSettings } from './context/SettingsContext'
import { addGoogleVerification, setPageSeo, setPersonStructuredData } from './services/seo'

const EditorialPage = lazy(() => import('./pages/EditorialPage'))

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25, ease: 'easeIn' } },
}

function Page({ children }) {
  return <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">{children}</motion.div>
}

function EditorialLoading() {
  const { t } = useSettings()
  return (
    <main className="editorial-page container" aria-live="polite">
      <p className="editorial-empty">{t.editorial.loading}</p>
    </main>
  )
}

export default function App() {
  const location = useLocation()
  const { lang } = useSettings()

  useEffect(() => {
    setPersonStructuredData()
    addGoogleVerification(import.meta.env.VITE_GOOGLE_SITE_VERIFICATION)
    if (location.pathname === '/') {
      setPageSeo({
        title: lang === 'fr'
          ? 'VEGBE Koffi Alex — Concepteur technique & Développeur'
          : 'VEGBE Koffi Alex — Technical Designer & Developer',
        description: lang === 'fr'
          ? "Portfolio de VEGBE Koffi Alex, concepteur technique spécialisé en modélisation 3D, CNC, Arduino, droit du numérique et développement web."
          : "Portfolio of VEGBE Koffi Alex, technical designer specialising in 3D modelling, CNC, Arduino, digital law and web development.",
      })
    }
  }, [lang, location.pathname])

  useEffect(() => {
    if (!location.state?.scrollTo) window.scrollTo(0, 0)
  }, [location.pathname, location.state])

  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <SectionNavigation />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/actualites" element={<Page><Suspense fallback={<EditorialLoading />}><EditorialPage type="actualites" /></Suspense></Page>} />
          <Route path="/actualites/:slug" element={<Page><Suspense fallback={<EditorialLoading />}><EditorialPage type="actualites" /></Suspense></Page>} />
          <Route path="/articles" element={<Page><Suspense fallback={<EditorialLoading />}><EditorialPage type="articles" /></Suspense></Page>} />
          <Route path="/articles/:slug" element={<Page><Suspense fallback={<EditorialLoading />}><EditorialPage type="articles" /></Suspense></Page>} />
          <Route path="/lettres-mysteres" element={<Page><AnagramGame /></Page>} />
          <Route path="/calculateur-pret" element={<Page><LoanCalculator /></Page>} />
          <Route path="/defis/arduino" element={<Page><Challenge challengeId="arduino" /></Page>} />
          <Route path="/defis/creation-web" element={<Page><Challenge challengeId="web" /></Page>} />
          <Route path="*" element={<Page><Home /></Page>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <BackToTop />
    </MotionConfig>
  )
}
