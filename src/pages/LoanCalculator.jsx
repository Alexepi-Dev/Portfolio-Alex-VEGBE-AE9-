import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'
import AppShell from '../components/AppShell'

export default function LoanCalculator() {
  const { t } = useSettings()
  const l = t.apps.loan
  const [form, setForm] = useState({ capital: '', rate: '', years: '' })
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const money = new Intl.NumberFormat(t.meta.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const onSubmit = (e) => {
    e.preventDefault()
    const capital = parseFloat(form.capital)
    const rate = parseFloat(form.rate)
    const years = parseFloat(form.years)

    const next = {}
    if (!Number.isFinite(capital) || capital <= 0) next.capital = l.errCapital
    if (!Number.isFinite(rate) || rate < 0) next.rate = l.errRate
    if (!Number.isFinite(years) || years <= 0) next.years = l.errYears
    setErrors(next)
    if (Object.keys(next).length) { setResult(null); return }

    // M = P · r(1+r)^n / ((1+r)^n − 1) ; r = taux mensuel, n = nombre de mois
    const r = rate / 100 / 12
    const n = Math.round(years * 12)
    const monthly = r === 0 ? capital / n : (capital * r * (1 + r) ** n) / ((1 + r) ** n - 1)
    const total = monthly * n
    setResult({ monthly, total, interest: total - capital })
  }

  const field = (name, label, placeholder, step) => (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type="number" inputMode="decimal" min="0" step={step} placeholder={placeholder} value={form[name]} onChange={onChange}
        aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-err` : undefined} />
      {errors[name] && <p className="field-error" id={`${name}-err`} role="alert">{errors[name]}</p>}
    </div>
  )

  return (
    <AppShell title={l.title}>
      <form onSubmit={onSubmit} noValidate>
        {field('capital', `${l.capital} (${l.currency})`, l.capitalPh, 'any')}
        {field('rate', l.rate, l.ratePh, '0.01')}
        {field('years', l.years, l.yearsPh, '1')}
        <button type="submit" className="app-btn app-btn-primary full">{l.calc}</button>
      </form>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div key={`${result.monthly}`} className="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
            <p className="result-main">{l.monthly} : <span>{money.format(result.monthly)}</span> {l.currency}</p>
            <dl className="result-details">
              <div><dt>{l.total}</dt><dd>{money.format(result.total)} {l.currency}</dd></div>
              <div><dt>{l.interest}</dt><dd>{money.format(result.interest)} {l.currency}</dd></div>
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  )
}
