import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaArrowUp } from 'react-icons/fa'
import { useSettings } from '../context/SettingsContext'

export default function BackToTop() {
  const { t } = useSettings()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          id="back-to-top"
          title={t.ui.backToTop}
          aria-label={t.ui.backToTop}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          whileHover={{ y: -4 }}
        >
          <FaArrowUp aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
