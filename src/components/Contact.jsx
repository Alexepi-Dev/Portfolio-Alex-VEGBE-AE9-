import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'
import { FORMSPREE_URL } from '../data/content'
import Reveal from './Reveal'

const empty = { nom: '', email: '', message: '' }

export default function Contact() {
  const { t } = useSettings()
  const [values, setValues] = useState(empty)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(false), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending'); setError('')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (res.ok) { setValues(empty); setStatus('idle'); setToast(true) }
      else {
        let msg = t.contact.errorGeneric
        try { const json = await res.json(); if (json?.error) msg = json.error } catch { /* ignore */ }
        setError(msg); setStatus('error')
      }
    } catch { setError(t.contact.errorNetwork); setStatus('error') }
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <Reveal className="contact-header">
          <h2>{t.contact.title}</h2>
          <p>{t.contact.subtitle}</p>
        </Reveal>
        <Reveal as="form" onSubmit={onSubmit} delay={0.1}>
          <div className="form-group-row">
            <input type="text" name="nom" placeholder={t.contact.name} aria-label={t.contact.name} autoComplete="name" required value={values.nom} onChange={onChange} />
            <input type="email" name="email" placeholder={t.contact.email} aria-label={t.contact.email} autoComplete="email" required value={values.email} onChange={onChange} />
          </div>
          <textarea name="message" rows="5" placeholder={t.contact.message} aria-label={t.contact.message} required value={values.message} onChange={onChange} />
          {status === 'error' && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-full" disabled={status === 'sending'}>
            {status === 'sending' ? t.contact.sending : t.contact.send}
          </button>
        </Reveal>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div className="toast" role="status" initial={{ opacity: 0, y: 30, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 30, x: '-50%' }}>
            {t.contact.success}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
