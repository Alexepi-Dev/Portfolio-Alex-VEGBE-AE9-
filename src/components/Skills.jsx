import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useSettings } from '../context/SettingsContext'
import { skillGroups } from '../data/content'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

export default function Skills() {
  const { t } = useSettings()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

  return (
    <section id="competences" className="container" ref={sectionRef}>
      <SectionHeader title={t.skills.title} />
      <div className="skills-wrapper">
        {skillGroups.map((group, g) => (
          <Reveal key={group.key} className="skill-category" delay={g * 0.1}>
            <h3>{t.skills[group.key]}</h3>
            {group.items.map(([id, level], i) => (
              <div className="skill-item" key={id}>
                <div className="skill-info"><span>{t.skills.items[id]}</span></div>
                <div className="progress-bar" role="progressbar" aria-valuenow={level} aria-valuemin={0} aria-valuemax={100} aria-label={t.skills.items[id]}>
                  <motion.div
                    className="progress"
                    initial={{ width: 0 }}
                    animate={{ width: isInView ? `${level}%` : 0 }}
                    transition={{
                      duration: 1.1,
                      delay: 0.15 + (skillGroups.slice(0, g).reduce((count, current) => count + current.items.length, 0) + i) * 0.09,
                      ease: [0.1, 0.8, 0.3, 1],
                    }}
                  />
                </div>
              </div>
            ))}
          </Reveal>
        ))}
      </div>
    </section>
  )
}
