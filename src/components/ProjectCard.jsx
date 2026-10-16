import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCube, FaDraftingCompass, FaDesktop, FaCogs, FaLightbulb, FaMicrochip, FaPalette, FaReact, FaCss3Alt, FaJs, FaArrowRight } from 'react-icons/fa'
import { useSettings } from '../context/SettingsContext'
import { asset } from '../utils'

const techIcons = {
  cad: { Icon: FaCube, color: 'var(--secondary)' },
  cadDrafting: { Icon: FaDraftingCompass, color: 'var(--primary)' },
  product: { Icon: FaDesktop, color: 'var(--primary)' },
  cnc: { Icon: FaCogs, color: 'var(--text-light)' },
  lamp: { Icon: FaLightbulb, color: 'var(--secondary)' },
  electronics: { Icon: FaMicrochip, color: 'var(--secondary)' },
  design: { Icon: FaPalette, color: 'var(--primary)' },
}

export default function ProjectCard({ project, kind, index }) {
  const { t } = useSettings()
  const txt = t.projects.items[project.id]
  const physical = kind === 'physical'

  return (
    <motion.article
      className="project-card"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10 }}
    >
      <span className={`project-badge ${physical ? 'badge-realise' : 'badge-encours'}`}>
        {physical ? t.projects.status.done : t.projects.status.wip}
      </span>

      {project.image && (
        <div className="project-image-container">
          <img src={asset(project.image)} alt={txt.alt || txt.title} loading="lazy" />
        </div>
      )}

      <div className="project-info">
        <h3>{txt.title}</h3>
        {physical && (
          <p className="project-meta">
            <strong>{t.projects.process} :</strong> {txt.process} | <strong>{txt.materialLabel} :</strong> {txt.material}
            {txt.electronics && <> | <strong>{txt.electronicsLabel} :</strong> {txt.electronics}</>}
          </p>
        )}
        <p>{txt.desc}</p>

        <div className="project-icons">
          {physical
            ? project.tech.map((k) => {
                const { Icon, color } = techIcons[k]
                return <Icon key={k} title={t.projects.tech[k]} aria-label={t.projects.tech[k]} style={{ color }} />
              })
            : (
              <>
                <FaReact title="React" aria-label="React" style={{ color: 'var(--secondary)' }} />
                <FaCss3Alt title="CSS3" aria-label="CSS3" style={{ color: 'var(--primary)' }} />
                <FaJs title="JavaScript" aria-label="JavaScript" style={{ color: 'var(--text-light)' }} />
              </>
            )}
        </div>

        {!physical && (
          <Link to={project.route} className="btn-link">
            {txt.cta} <FaArrowRight aria-hidden="true" />
          </Link>
        )}
      </div>
    </motion.article>
  )
}
