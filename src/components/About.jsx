import { useSettings } from '../context/SettingsContext'
import { asset } from '../utils'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'
import Stats from './Stats'

export default function About() {
  const { t } = useSettings()
  return (
    <section id="apropos" className="about container">
      <Reveal className="about-image">
        <div className="circle-img">
          <img src={asset('images/alex.png')} alt={t.about.imageAlt} width="900" height="900" loading="lazy" />
        </div>
      </Reveal>
      <Reveal className="about-content" delay={0.1}>
        <SectionHeader left title={t.about.title} />
        <p>{t.about.text}</p>
        <Stats />
      </Reveal>
    </section>
  )
}
