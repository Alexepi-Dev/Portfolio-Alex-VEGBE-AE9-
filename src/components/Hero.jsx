import { motion } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'
import { FaLinkedin, FaFacebook } from 'react-icons/fa'
import { socials } from '../data/content'
import { asset, scrollToSection } from '../utils'

import Availability from './Availability'

const socialIcons = { linkedin: FaLinkedin, facebook: FaFacebook }

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const { t } = useSettings()
  const go = (e, id) => { e.preventDefault(); scrollToSection(id) }
  return (
    <section id="accueil" className="hero container">
      <motion.div className="hero-text" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}><Availability /></motion.div>
        <motion.span variants={item} className="kicker">{t.hero.kicker}</motion.span>
        <motion.h1 variants={item}>{t.hero.title}</motion.h1>
        <motion.p variants={item}>{t.hero.text}</motion.p>
        <motion.div variants={item} className="hero-actions">
          <a href="#projets" className="btn" onClick={(e) => go(e, 'projets')}>{t.hero.cta}</a>
          <a href="#contact" className="btn btn-ghost" onClick={(e) => go(e, 'contact')}>{t.hero.cta2}</a>
        </motion.div>
        <motion.div variants={item} className="hero-socials">
          {socials.map(({ id, label, href }) => {
            const Icon = socialIcons[id]
            return (
              <a key={id} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
                <Icon aria-hidden="true" />
              </a>
            )
          })}
        </motion.div>
      </motion.div>
      <motion.div
        className="hero-image"
        initial={{ opacity: 0, scale: 0.94, rotate: -1.5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={asset('images/hero.webp')} alt={t.hero.imageAlt} width="1200" height="655" fetchPriority="high" />
      </motion.div>
    </section>
  )
}
