import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaBug, FaClock, FaTimesCircle, FaTrophy, FaRedo, FaEye, FaArrowRight } from 'react-icons/fa'
import { useSettings } from '../context/SettingsContext'
import { fill } from '../i18n'
import { challengeSets } from '../data/challenge'
import Reveal from './Reveal'

const bestKey = (challengeId) => challengeId === 'arduino' ? 'challenge_best' : `challenge_best_${challengeId}`
const challengeRoutes = { arduino: '/defis/arduino', web: '/defis/creation-web' }
const readBest = (challengeId) => {
  try { return Number(localStorage.getItem(bestKey(challengeId))) || 0 } catch { return 0 }
}

function createWebPreviewDocument(lang) {
  const isFrench = lang === 'fr'
  const copy = isFrench
    ? { home: 'Accueil', about: 'À propos', projects: 'Projets', intro: 'Création web, design et idées.', heading: 'Projets récents', description: 'Quelques exemples de mes réalisations.', button: 'Découvrir mes projets' }
    : { home: 'Home', about: 'About', projects: 'Projects', intro: 'Web creation, design and ideas.', heading: 'Recent projects', description: 'A few examples of my work.', button: 'Explore my projects' }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <title>Portfolio — ${copy.home}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; color: #172033; background: #f4f6fb; font: 16px Arial, sans-serif; }
    .container { width: 1000px; margin: auto; }
    header { display: flex; align-items: center; justify-content: space-between; padding: 22px 30px; color: white; background: #14213d; }
    header strong { font-size: 20px; }
    nav { display: flex; gap: 22px; }
    a { color: inherit; }
    .hero { padding: 48px 30px; color: white; background: linear-gradient(120deg, #2563eb, #06b6d4); }
    .hero h1 { margin: 0 0 10px; font-size: 32px; }
    main { padding: 28px 30px 36px; }
    main h2 { margin-top: 0; }
    .card { display: flex; gap: 18px; align-items: center; padding: 18px; border-radius: 14px; background: white; box-shadow: 0 5px 20px #14213d12; }
    .card img { width: 180px; height: 120px; object-fit: cover; border-radius: 10px; }
    .card h3 { margin: 0 0 8px; }
    .button { display: inline-block; margin-top: 12px; padding: 10px 14px; border-radius: 8px; color: white; background: #2563eb; text-decoration: none; }
    @media (max-width: 600px) { .container { width: 1000px; } }
  </style>
</head>
<body>
  <header class="container"><strong>Alex Studio</strong><nav><a href="#home">${copy.home}</a><a href="#about">${copy.about}</a><a href="#projects">${copy.projects}</a></nav></header>
  <section class="container hero" id="home"><h1>${copy.intro}</h1><p>${copy.description}</p></section>
  <main class="container" id="project"><h2>${copy.heading}</h2><article class="card"><img src="project.jpg"><div><h3>Portfolio créatif</h3><p>${copy.description}</p><a class="button" href="#projects">${copy.button}</a></div></article></main>
</body>
</html>`
}

export function ChallengeCatalog() {
  const { t } = useSettings()
  const c = t.challenge

  return (
    <section id="defi" className="container">
      <Reveal as="h2" className="section-title">{c.title}</Reveal>
      <Reveal as="p" className="section-lead" delay={0.05}>{c.subtitle}</Reveal>
      <div className="challenge-card-grid">
        {Object.keys(challengeSets).map((id, index) => (
          <motion.article
            key={id}
            className="challenge-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -6 }}
          >
            <h3>{c.challengeNames[id]}</h3>
            <p>{c[challengeSets[id].subtitleKey]}</p>
            <Link className="btn-link" to={challengeRoutes[id]}>
              {c.openChallenge} <FaArrowRight aria-hidden="true" />
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default function Challenge({ challengeId }) {
  const { t, lang } = useSettings()
  const c = t.challenge

  const [previewSize, setPreviewSize] = useState('desktop')
  const challenge = challengeSets[challengeId]
  const lines = challenge.lines
  const bugs = c[challenge.bugsKey]
  const [found, setFound] = useState([])        // indices de lignes trouvées (ordre de découverte)
  const [errors, setErrors] = useState(0)
  const [flash, setFlash] = useState(null)      // ligne fausse cliquée (retour visuel)
  const [started, setStarted] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [state, setState] = useState('playing') // playing | won | revealed
  const [score, setScore] = useState(0)
  const [record, setRecord] = useState(false)
  const [best, setBest] = useState(() => readBest(challengeId))
  const [msg, setMsg] = useState(null)          // { type, text }
  const flashTimer = useRef(null)

  useEffect(() => {
    if (!started || state !== 'playing') return undefined
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [started, state])

  useEffect(() => () => clearTimeout(flashTimer.current), [])

  const finish = (nextFound, nextErrors) => {
    const s = Math.max(0, nextFound.length * 200 - nextErrors * 50) + Math.max(0, 100 - elapsed)
    setScore(s)
    setState('won')
    if (s > best) {
      setBest(s)
      setRecord(true)
      try { localStorage.setItem(bestKey(challengeId), String(s)) } catch { /* ignore */ }
    }
  }

  const onPick = (i) => {
    if (state !== 'playing' || found.includes(i)) return
    if (!started) setStarted(true)
    const line = lines[i]
    if (line.bug) {
      const next = [...found, i]
      setFound(next)
      setMsg({ type: 'ok', text: bugs[line.bug], line: i + 1 })
      if (next.length === challenge.totalBugs) finish(next, errors)
    } else {
      setErrors((e) => e + 1)
      setFlash(i)
      setMsg({ type: 'bad', text: c.wrong })
      clearTimeout(flashTimer.current)
      flashTimer.current = setTimeout(() => setFlash(null), 700)
    }
  }

  const reveal = () => {
    setState('revealed')
    setMsg({ type: 'info', text: c.revealed })
  }

  const retry = () => {
    setFound([]); setErrors(0); setFlash(null); setStarted(false); setElapsed(0)
    setState('playing'); setScore(0); setRecord(false); setMsg(null)
  }

  const showAll = state === 'revealed'
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  return (
    <section className="container challenge-page">
      <Reveal className="challenge" delay={0.1}>
        <h3 className="challenge-title">{c[challenge.titleKey]}</h3>
        <p className="challenge-description">{c[challenge.subtitleKey]}</p>
        <div className="challenge-stats">
          <div className="stat"><FaBug aria-hidden="true" /><span>{c.found}</span><strong>{found.length}/{challenge.totalBugs}</strong></div>
          <div className="stat"><FaTimesCircle aria-hidden="true" /><span>{c.errors}</span><strong>{errors}</strong></div>
          <div className="stat"><FaClock aria-hidden="true" /><span>{c.time}</span><strong>{mm}:{ss}</strong></div>
          <div className="stat"><FaTrophy aria-hidden="true" /><span>{c.best}</span><strong>{best}</strong></div>
        </div>

        {challengeId === 'web' && (
          <div className="web-preview">
            <h4>{c.webPreview}</h4>
            <div className="preview-device-toggle" role="group" aria-label={c.previewSizeLabel}>
              {['desktop', 'mobile'].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`preview-size-button ${previewSize === size ? 'is-active' : ''}`}
                  aria-pressed={previewSize === size}
                  onClick={() => setPreviewSize(size)}
                >
                  {c.previewSizes[size]}
                </button>
              ))}
            </div>
            <div className={`preview-browser preview-browser-${previewSize}`}>
              <div className="preview-toolbar" aria-hidden="true">
                <span /><span /><span />
                <div className="preview-address">{c.previewAddress}</div>
              </div>
              <div className="preview-viewport">
                <iframe
                  className="preview-frame"
                  title={c.webPreview}
                  sandbox=""
                  srcDoc={createWebPreviewDocument(lang)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="code-window" role="group" aria-label={c[challenge.titleKey]}>
          <div className="code-bar" aria-hidden="true"><i /><i /><i /><span>{challenge.file}</span></div>
          <div className="code-body">
            {lines.map((line, i) => {
              const isFound = found.includes(i)
              const isMissed = showAll && line.bug && !isFound
              const cls = ['code-line', isFound && 'found', isMissed && 'missed', flash === i && 'wrong'].filter(Boolean).join(' ')
              return (
                <button
                  key={i}
                  type="button"
                  className={cls}
                  onClick={() => onPick(i)}
                  disabled={!line.code || state !== 'playing' || isFound}
                  aria-pressed={isFound}
                  aria-label={`${i + 1}: ${line.code || '—'}`}
                >
                  <span className="ln" aria-hidden="true">{i + 1}</span>
                  <code>{line.code || ' '}</code>
                </button>
              )
            })}
          </div>
        </div>

        <div className="challenge-feedback" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={state + (msg?.text || '') + found.length + errors}
              className={`feedback ${msg?.type || 'hint'}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {state === 'won'
                ? <>{c.done} <strong>{fill(c.finalScore, { n: score })}</strong> {record && <span className="record">{c.newRecord}</span>}</>
                : msg ? <>{msg.line ? <b>L{msg.line} · </b> : null}{msg.text}</> : c[challenge.hintKey]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="challenge-actions">
          {state === 'playing' && (
            <button type="button" className="btn btn-ghost" onClick={reveal}><FaEye aria-hidden="true" /> {c.reveal}</button>
          )}
          {state !== 'playing' && (
            <button type="button" className="btn" onClick={retry}><FaRedo aria-hidden="true" /> {c.retry}</button>
          )}
        </div>

        {showAll && (
          <ul className="bug-list">
            {lines.map((line, i) => line.bug && <li key={i}><b>L{i + 1}</b> {bugs[line.bug]}</li>)}
          </ul>
        )}
      </Reveal>
      <Link to="/" state={{ scrollTo: 'defi' }} className="btn-back">{c.backToChallenges}</Link>
    </section>
  )
}
