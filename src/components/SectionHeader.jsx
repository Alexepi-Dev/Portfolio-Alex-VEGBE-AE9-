import Reveal from './Reveal'

// Étiquette « / SECTION » + titre, façon portfolio éditorial
export default function SectionHeader({ label, title, left = false }) {
  return (
    <Reveal className={`section-header ${left ? 'left' : ''}`}>
      {label && <span className="eyebrow">{label}</span>}
      <h2 className={`section-title ${left ? 'left' : ''}`}>{title}</h2>
    </Reveal>
  )
}
