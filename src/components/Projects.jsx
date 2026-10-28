import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'
import { physicalProjects, webProjects } from '../data/content'
import ProjectCard from './ProjectCard'
import SectionHeader from './SectionHeader'

const FILTERS = ['all', 'physical', 'web']

export default function Projects() {
  const { t, lang } = useSettings()
  const [filter, setFilter] = useState('all')

  const items = [
    ...physicalProjects.map((project) => ({ project, kind: 'physical' })),
    ...webProjects.map((project) => ({ project, kind: 'web' })),
  ]
    .sort((a, b) => t.projects.items[a.project.id].title.localeCompare(
      t.projects.items[b.project.id].title,
      lang === 'fr' ? 'fr' : 'en',
      { sensitivity: 'base' },
    ))
    .filter((item) => filter === 'all' || item.kind === filter)

  return (
    <section id="projets" className="projects container">
      <SectionHeader title={t.projects.title} />

      <div className="filter-bar" role="group" aria-label={t.projects.filtersLabel}>
        {FILTERS.map((key) => (
          <button
            key={key}
            type="button"
            className={`filter-chip ${filter === key ? 'is-active' : ''}`}
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {t.projects.filters[key]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          className="projects-grid"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {items.map(({ project, kind }, index) => (
            <ProjectCard key={project.id} project={project} kind={kind} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
