import { useState } from 'react'
import { Send } from 'lucide-react'
import GlowCard from '../ui/GlowCard'

const ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LIMITS = { name: 100, email: 254, message: 5000 }

const INITIAL = { name: '', email: '', message: '' }

function validate(values) {
  const name = values.name.trim()
  const email = values.email.trim()
  const message = values.message.trim()
  if (!name || !email || !message) return 'Please fill in every field.'
  if (!EMAIL_PATTERN.test(email)) return 'Please enter a valid email address.'
  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return 'One of the fields is too long.'
  }
  return null
}

function Field({ id, label, textarea = false, ...rest }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <label htmlFor={id} className="block">
      <span className="sr-only">{label}</span>
      <Tag
        id={id}
        name={id}
        placeholder={label}
        rows={textarea ? 3 : undefined}
        maxLength={LIMITS[id]}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-accent/60 focus:bg-white/[0.05]"
        {...rest}
      />
    </label>
  )
}

export default function ContactForm() {
  const [values, setValues] = useState(INITIAL)
  const [status, setStatus] = useState({ kind: 'idle', message: '' })

  const update = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const error = validate(values)
    if (error) {
      setStatus({ kind: 'error', message: error })
      return
    }
    if (!ACCESS_KEY) {
      setStatus({ kind: 'error', message: 'Contact form is not configured yet (missing VITE_WEB3FORMS_KEY).' })
      return
    }

    setStatus({ kind: 'sending', message: '' })
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          subject: 'New message from your portfolio',
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || !result.success) throw new Error(result.message || 'Request failed')
      setValues(INITIAL)
      setStatus({ kind: 'success', message: "Thanks! Your message is on its way — I'll reply soon." })
    } catch {
      setStatus({ kind: 'error', message: 'Something went wrong. Please try again or email me directly.' })
    }
  }

  const sending = status.kind === 'sending'

  return (
    <GlowCard as="form" onSubmit={handleSubmit} noValidate className="space-y-3.5 p-6">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field id="name" label="Your name" autoComplete="name" value={values.name} onChange={update} />
        <Field id="email" label="Email address" type="email" autoComplete="email" value={values.email} onChange={update} />
      </div>
      <Field id="message" label="Tell me about your project..." textarea value={values.message} onChange={update} />
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-70"
        >
          {sending ? 'Sending…' : 'Send message'}
          <Send size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
        {status.message && (
          <p role="status" className={`text-sm ${status.kind === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
            {status.message}
          </p>
        )}
      </div>
    </GlowCard>
  )
}
