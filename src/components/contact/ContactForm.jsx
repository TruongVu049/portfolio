import { useState } from 'react'
import { Send } from 'lucide-react'
import GlowCard from '../ui/GlowCard'
import { PROFILE } from '../../data/profile'
import { LIMITS, validateContact } from './contactValidation'

const ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

const INITIAL = { name: '', email: '', message: '' }
const FALLBACK = `email me directly at ${PROFILE.email}.`
const STATUS_ID = 'contact-status'

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
        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-base text-white outline-none placeholder:text-zinc-500 focus:border-accent/60 focus:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-accent/40 aria-invalid:border-rose-300/70 sm:text-sm"
        {...rest}
      />
    </label>
  )
}

/**
 * Hidden from people but visible to naive bots that tick every box; when it is
 * checked the request is skipped entirely.
 */
function Honeypot({ checked, onChange }) {
  return (
    <input
      type="checkbox"
      name="botcheck"
      checked={checked}
      onChange={onChange}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="hidden"
    />
  )
}

async function send(data) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      ...data,
      subject: 'New message from your portfolio',
    }),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.success) throw new Error(result.message || `Request failed (${response.status})`)
}

export default function ContactForm() {
  const [values, setValues] = useState(INITIAL)
  const [botcheck, setBotcheck] = useState(false)
  const [status, setStatus] = useState({ kind: 'idle', message: '' })
  const [invalidField, setInvalidField] = useState(null)

  const update = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (name === invalidField) setInvalidField(null)
  }
  const succeed = () => {
    setValues(INITIAL)
    setStatus({ kind: 'success', message: "Thanks! Your message is on its way — I'll reply soon." })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status.kind === 'sending') return
    const { error, field, data } = validateContact(values)
    setInvalidField(field)
    if (error) {
      setStatus({ kind: 'error', message: error })
      // The field is described by the status message, so focusing it reads out what is wrong.
      e.currentTarget.elements.namedItem(field)?.focus()
      return
    }
    // A bot ticked the hidden box: pretend it worked so it learns nothing.
    if (botcheck) {
      succeed()
      return
    }
    if (!ACCESS_KEY) {
      setStatus({ kind: 'error', message: `The form is unavailable right now. Please ${FALLBACK}` })
      return
    }

    setStatus({ kind: 'sending', message: 'Sending your message…' })
    try {
      await send(data)
      succeed()
    } catch {
      setStatus({ kind: 'error', message: `Something went wrong. Please try again, or ${FALLBACK}` })
    }
  }

  const sending = status.kind === 'sending'
  const fieldProps = (id) => ({
    id,
    value: values[id],
    onChange: update,
    'aria-invalid': invalidField === id || undefined,
    'aria-describedby': invalidField === id ? STATUS_ID : undefined,
  })

  return (
    <GlowCard as="form" onSubmit={handleSubmit} noValidate aria-busy={sending} className="space-y-3.5 p-6">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field label="Your name" autoComplete="name" {...fieldProps('name')} />
        <Field label="Email address" type="email" autoComplete="email" {...fieldProps('email')} />
      </div>
      <Field label="Tell me about your project..." textarea {...fieldProps('message')} />
      <Honeypot checked={botcheck} onChange={(e) => setBotcheck(e.target.checked)} />
      <div className="flex flex-wrap items-center gap-4 pt-2">
        {/* aria-disabled rather than disabled: a disabled button would drop keyboard focus mid-send. */}
        <button
          type="submit"
          aria-disabled={sending}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-zinc-200 aria-disabled:cursor-wait aria-disabled:opacity-70"
        >
          {sending ? 'Sending…' : 'Send message'}
          <Send size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
        <p
          id={STATUS_ID}
          role="status"
          aria-live="polite"
          className={`text-sm ${status.kind === 'error' ? 'text-rose-300' : status.kind === 'sending' ? 'text-zinc-400' : 'text-emerald-300'}`}
        >
          {status.message}
        </p>
      </div>
    </GlowCard>
  )
}
