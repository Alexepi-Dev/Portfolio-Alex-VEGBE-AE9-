import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'
import { fill } from '../i18n'
import { words } from '../data/words'
import { asset } from '../utils'
import {
  fetchLeaderboard,
  isLeaderboardConfigured,
  saveLeaderboardScore,
  subscribeToLeaderboard,
} from '../services/leaderboard'
import AppShell from '../components/AppShell'

const START_TIME = 30
const BONUS_TIME = 10
const STORAGE_KEY = 'anagramme_best'

const normalize = (s) => s.trim().normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()

function shuffle(word) {
  const a = word.split('')
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  const res = a.join('')
  return res === word && new Set(a).size > 1 ? shuffle(word) : res
}

function shuffleWords(list) {
  const shuffled = [...list]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const readBest = () => { try { return Number(localStorage.getItem(STORAGE_KEY)) || 0 } catch { return 0 } }

export default function AnagramGame() {
  const { t, lang } = useSettings()
  const g = t.apps.game
  const inputRef = useRef(null)
  const advanceTimer = useRef(null)
  const wordDeck = useRef({ lang: '', words: [], index: 0 })

  const [status, setStatus] = useState('playing')
  const [timeLeft, setTimeLeft] = useState(START_TIME)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(readBest)
  const [word, setWord] = useState('')
  const [tiles, setTiles] = useState('')
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [bonusKey, setBonusKey] = useState(0)
  const [flash, setFlash] = useState(false)
  const [isRecord, setIsRecord] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardStatus, setLeaderboardStatus] = useState('loading')
  const [playerName, setPlayerName] = useState('')
  const [scoreSubmitted, setScoreSubmitted] = useState(false)
  const [scoreSubmitting, setScoreSubmitting] = useState(false)
  const [scoreSubmitError, setScoreSubmitError] = useState(false)

  const newRound = useCallback((previous = '') => {
    clearTimeout(advanceTimer.current)
    let deck = wordDeck.current
    if (deck.lang !== lang || deck.index >= deck.words.length) {
      const nextWords = shuffleWords(words[lang])
      if (nextWords.length > 1 && nextWords[0] === previous) {
        ;[nextWords[0], nextWords[1]] = [nextWords[1], nextWords[0]]
      }
      deck = { lang, words: nextWords, index: 0 }
      wordDeck.current = deck
    }
    const next = deck.words[deck.index]
    deck.index += 1
    setWord(next); setTiles(shuffle(next)); setGuess(''); setFeedback(null)
    inputRef.current?.focus()
  }, [lang])

  const start = useCallback(() => {
    clearTimeout(advanceTimer.current)
    setStatus('playing'); setTimeLeft(START_TIME); setScore(0); setFeedback(null); setIsRecord(false)
    setPlayerName(''); setScoreSubmitted(false); setScoreSubmitError(false)
    newRound()
  }, [newRound])

  useEffect(() => { start() }, [start])
  useEffect(() => () => clearTimeout(advanceTimer.current), [])

  useEffect(() => {
    if (status !== 'playing') return undefined
    const id = setInterval(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [status])

  useEffect(() => {
    if (status === 'playing' && timeLeft <= 0) {
      setTimeLeft(0); setStatus('over')
      if (score > best) {
        setBest(score); setIsRecord(true)
        try { localStorage.setItem(STORAGE_KEY, String(score)) } catch { /* ignore */ }
      }
    }
  }, [timeLeft, status, score, best])

  useEffect(() => {
    if (!isLeaderboardConfigured) {
      setLeaderboardStatus('unavailable')
      return undefined
    }

    let active = true
    const refresh = async () => {
      try {
        const entries = await fetchLeaderboard(lang)
        if (active) {
          setLeaderboard(entries)
          setLeaderboardStatus('ready')
        }
      } catch (error) {
        console.error('Unable to load the shared leaderboard.', error)
        if (active) setLeaderboardStatus('error')
      }
    }

    setLeaderboardStatus('loading')
    refresh()
    const channel = subscribeToLeaderboard(lang, refresh)
    return () => {
      active = false
      if (channel) channel.unsubscribe()
    }
  }, [lang])

  const submitScore = async (e) => {
    e.preventDefault()
    if (scoreSubmitting || scoreSubmitted || !isLeaderboardConfigured) return

    const name = playerName.trim()
    if (!name) return

    setScoreSubmitting(true)
    setScoreSubmitError(false)
    try {
      await saveLeaderboardScore({ name, score, language: lang })
      setScoreSubmitted(true)
      try {
        setLeaderboard(await fetchLeaderboard(lang))
        setLeaderboardStatus('ready')
      } catch (error) {
        console.error('Score was saved, but the leaderboard could not be refreshed.', error)
        setLeaderboardStatus('error')
      }
    } catch (error) {
      console.error('Unable to submit the score to the shared leaderboard.', error)
      setScoreSubmitError(true)
    } finally {
      setScoreSubmitting(false)
    }
  }

  const check = (e) => {
    e?.preventDefault()
    if (status !== 'playing') return
    if (normalize(guess) === word) {
      const points = word.length
      setScore((s) => s + points); setTimeLeft((s) => s + BONUS_TIME); setBonusKey((k) => k + 1)
      setFeedback({ type: 'bravo', n: points })
      setFlash(true); setTimeout(() => setFlash(false), 250)
      newRound(word)
    } else {
      setFeedback({ type: 'wrong', w: word })
      clearTimeout(advanceTimer.current)
      advanceTimer.current = setTimeout(() => newRound(word), 1200)
    }
  }

  const skip = () => {
    if (status !== 'playing') return
    setFeedback({ type: 'was', w: word })
    setScore((s) => Math.max(0, s - 2))
    clearTimeout(advanceTimer.current)
    advanceTimer.current = setTimeout(() => newRound(word), 900)
  }

  let message = ''
  let tone = ''
  if (status === 'over') { message = isRecord ? g.record : fill(g.over, { n: score }); tone = isRecord ? 'accent' : 'neutral' }
  else if (feedback?.type === 'bravo') { message = fill(g.bravo, { n: feedback.n }); tone = 'success' }
  else if (feedback?.type === 'wrong') { message = fill(g.was, { w: feedback.w }); tone = 'danger' }
  else if (feedback?.type === 'was') { message = fill(g.was, { w: feedback.w }); tone = 'warn' }

  return (
    <AppShell
      title={<img className="anagram-logo" src={asset('images/lettres-mysteres-logo-v2.png')} alt={g.title} width="1254" height="1254" />}
      className="anagram-page"
    >
      <div className={`game anagram-game ${flash ? 'flash' : ''}`}>
        <div className="stats">
          <div className="stat-box">
            <div className="timer-stat">
              <span className="stat-label">{g.time}</span>
              <span className={`stat-value ${timeLeft <= 10 ? 'danger' : ''}`}>{timeLeft}<small>s</small></span>
            </div>
            <AnimatePresence>
              <motion.span key={bonusKey} className="time-bonus" initial={{ opacity: bonusKey ? 1 : 0, y: 0 }} animate={{ opacity: 0, y: -30 }} transition={{ duration: 1 }}>
                {bonusKey ? `+${BONUS_TIME}s` : ''}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="stat-box"><span className="stat-label">{g.score}</span><span className="stat-value success">{score}</span></div>
          <div className="stat-box"><span className="stat-label">{g.best}</span><span className="stat-value">{best}</span></div>
        </div>
        <div className="game-timer-track" role="progressbar" aria-label={g.time} aria-valuenow={timeLeft} aria-valuemin={0} aria-valuemax={START_TIME}>
          <span style={{ width: `${Math.min(100, (timeLeft / START_TIME) * 100)}%` }} />
        </div>

        {status === 'playing' ? (
          <form onSubmit={check}>
            <p className="app-hint">{g.hint}</p>
            <div className="tiles" aria-label={tiles} role="img">
              {tiles.split('').map((letter, i) => (
                <motion.div key={`${tiles}-${i}`} className="letter-tile" initial={{ opacity: 0, y: -14, rotate: -8 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: i * 0.04, type: 'spring', stiffness: 380, damping: 16 }}>
                  {letter}
                </motion.div>
              ))}
            </div>
            <label className="sr-only" htmlFor="anagram-answer">{g.placeholder}</label>
            <input id="anagram-answer" ref={inputRef} type="text" className="game-input" placeholder={g.placeholder} value={guess} onChange={(e) => setGuess(e.target.value)} autoComplete="off" autoCapitalize="characters" spellCheck="false" autoFocus />
            <div className="answer-composition" aria-hidden="true">
              <span className="composition-label">{g.composition}</span>
              <div className="composition-slots">
                {Array.from({ length: word.length }, (_, index) => (
                  <span className={guess[index] ? 'is-filled' : ''} key={index}>{guess[index]?.toUpperCase() || ''}</span>
                ))}
              </div>
            </div>
            <div className="controls">
              <button type="submit" className="app-btn app-btn-success">{g.check}</button>
              <button type="button" className="app-btn app-btn-muted" onClick={skip}>{g.skip}</button>
            </div>
          </form>
        ) : (
          <>
            {!scoreSubmitted ? (
              isLeaderboardConfigured ? (
                <form className="leaderboard-submit" onSubmit={submitScore}>
                  <label htmlFor="player-name">{g.nameLabel}</label>
                  <div className="inline-form">
                    <input
                      id="player-name"
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder={g.namePlaceholder}
                      maxLength={24}
                      autoComplete="nickname"
                      required
                      disabled={scoreSubmitting}
                    />
                    <button type="submit" className="app-btn app-btn-success" disabled={scoreSubmitting}>
                      {scoreSubmitting ? g.savingScore : g.submitScore}
                    </button>
                  </div>
                  {scoreSubmitError && <p className="leaderboard-error" role="alert">{g.submitError}</p>}
                </form>
              ) : (
                <p className="leaderboard-error" role="alert">{g.configureLeaderboard}</p>
              )
            ) : (
              <p className="leaderboard-success" role="status">{g.scoreSaved}</p>
            )}
            <button type="button" className="app-btn app-btn-primary full" onClick={start}>{g.restart}</button>
          </>
        )}

        <p className={`game-message ${tone}`} aria-live="polite">{message}</p>

        <section className="leaderboard" aria-labelledby="leaderboard-title">
          <h2 id="leaderboard-title">{g.leaderboard}</h2>
          {leaderboardStatus === 'loading' && <p className="leaderboard-note">{g.loadingLeaderboard}</p>}
          {leaderboardStatus === 'unavailable' && <p className="leaderboard-note">{g.configureLeaderboard}</p>}
          {leaderboardStatus === 'error' && <p className="leaderboard-error" role="alert">{g.leaderboardError}</p>}
          {leaderboardStatus === 'ready' && leaderboard.length === 0 && <p className="leaderboard-note">{g.emptyLeaderboard}</p>}
          {leaderboardStatus === 'ready' && leaderboard.length > 0 && (
            <ol className="leaderboard-list">
              {leaderboard.map((entry, index) => (
                <li key={entry.id}>
                  <span className="leaderboard-rank">{index + 1}</span>
                  <span className="leaderboard-name">{entry.player_name}</span>
                  <strong className="leaderboard-score">{entry.score}</strong>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </AppShell>
  )
}
