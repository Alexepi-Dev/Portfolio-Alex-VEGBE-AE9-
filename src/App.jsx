import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import Home from './pages/Home'
import AnagramGame from './pages/AnagramGame'
import LoanCalculator from './pages/LoanCalculator'
import Arcade from './pages/Arcade'
import Challenge from './components/Challenge'

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25, ease: 'easeIn' } },
}

function Page({ children }) {
  return <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">{children}</motion.div>
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    if (!location.state?.scrollTo) window.scrollTo(0, 0)
  }, [location.pathname, location.state])

  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/lettres-mysteres" element={<Page><AnagramGame /></Page>} />
          <Route path="/calculateur-pret" element={<Page><LoanCalculator /></Page>} />
          <Route path="/arcade" element={<Page><Arcade /></Page>} />
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
