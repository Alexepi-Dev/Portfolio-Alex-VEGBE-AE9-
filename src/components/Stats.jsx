import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'
import { journey, physicalProjects, webProjects } from '../data/content'

function Counter({ to }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return undefined
    const controls = animate(0, to, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>{n}</span>
}

// Chiffres réels, calculés à partir des données du site
export default function Stats() {
  const { t } = useSettings()
  const items = [
    [physicalProjects.length, t.stats.physical],
    [webProjects.length, t.stats.web],
    [journey.filter((j) => j.type === 'badge').length, t.stats.badges],
  ]
  return (
    <dl className="stats-row">
      {items.map(([value, label]) => (
        <div key={label}>
          <dd><Counter to={value} /></dd>
          <dt>{label}</dt>
        </div>
      ))}
    </dl>
  )
}
