import { motion } from 'framer-motion'
import { FaBalanceScale, FaCube, FaCogs, FaCode, FaFileContract, FaMicrochip, FaShieldAlt } from 'react-icons/fa'
import { useSettings } from '../context/SettingsContext'
import { services } from '../data/content'
import SectionHeader from './SectionHeader'

const icons = {
  cad: FaCube,
  cnc: FaCogs,
  arduino: FaMicrochip,
  web: FaCode,
  businessLaw: FaBalanceScale,
  digitalLaw: FaShieldAlt,
  legalDesign: FaFileContract,
}

export default function Services() {
  const { t } = useSettings()
  return (
    <section id="services" className="container">
      <SectionHeader title={t.services.title} />
      <div className="services-grid">
        {services.map((key, i) => {
          const Icon = icons[key]
          const txt = t.services.items[key]
          return (
            <motion.article
              key={key}
              className="service-card"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
            >
              <span className="service-num" aria-hidden="true">0{i + 1}</span>
              <span className="service-icon"><Icon aria-hidden="true" /></span>
              <h3>{txt.title}</h3>
              <p>{txt.desc}</p>
              {txt.details && (
                <ul className="service-details">
                  {txt.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
              )}
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
