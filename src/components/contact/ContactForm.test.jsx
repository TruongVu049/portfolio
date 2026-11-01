import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PROFILE } from '../../data/profile'

// ACCESS_KEY is read when the module loads, so each test imports a fresh copy.
async function renderForm({ key = 'test-key' } = {}) {
  vi.resetModules()
  vi.stubEnv('VITE_WEB3FORMS_KEY', key)
  const { default: ContactForm } = await import('./ContactForm')
  const user = userEvent.setup()
  const { container } = render(<ContactForm />)
  return { user, container }
}

async function fillIn(user, { name = 'Ada', email = 'ada@example.com', message = 'Hello' } = {}) {
  if (name) await user.type(screen.getByLabelText('Your name'), name)
  if (email) await user.type(screen.getByLabelText('Email address'), email)
  if (message) await user.type(screen.getByLabelText('Tell me about your project...'), message)
}

const submit = (user) => user.click(screen.getByRole('button', { name: /send message/i }))
const status = () => screen.getByRole('status')

function mockFetch(response) {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('ContactForm', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  test('shows a validation error and sends nothing when fields are missing', async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({ success: true }) })
    const { user } = await renderForm()

    await fillIn(user, { message: '' })
    await submit(user)

    expect(status()).toHaveTextContent('Please fill in every field.')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('marks the invalid field, links it to the error and moves focus there', async () => {
    mockFetch({ ok: true, json: async () => ({ success: true }) })
    const { user } = await renderForm()

    await fillIn(user, { email: 'not-an-email' })
    await submit(user)

    const email = screen.getByLabelText('Email address')
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveAccessibleDescription('Please enter a valid email address.')
    expect(email).toHaveFocus()

    await user.type(email, '@example.com')
    expect(email).not.toHaveAttribute('aria-invalid')
  })

  test('announces sending, keeps the button focusable and ignores a second submit', async () => {
    let resolve
    const fetchMock = vi.fn(() => new Promise((r) => (resolve = r)))
    vi.stubGlobal('fetch', fetchMock)
    const { user } = await renderForm()

    await fillIn(user)
    await submit(user)
    const button = screen.getByRole('button', { name: /sending/i })

    expect(status()).toHaveTextContent('Sending your message…')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).not.toBeDisabled()
    await user.click(button)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    resolve({ ok: true, json: async () => ({ success: true }) })
    expect(await screen.findByText(/your message is on its way/i)).toBeInTheDocument()
  })

  test('sends the trimmed message, clears the form and confirms success', async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({ success: true }) })
    const { user } = await renderForm()

    await fillIn(user, { name: '  Ada  ' })
    await submit(user)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body).toMatchObject({ access_key: 'test-key', name: 'Ada', email: 'ada@example.com', message: 'Hello' })
    expect(await screen.findByText(/your message is on its way/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Your name')).toHaveValue('')
  })

  test('keeps the message and offers the email address when the service fails', async () => {
    mockFetch({ ok: false, status: 500, json: async () => ({ success: false, message: 'boom' }) })
    const { user } = await renderForm()

    await fillIn(user)
    await submit(user)

    expect(await screen.findByText(/something went wrong/i)).toHaveTextContent(PROFILE.email)
    expect(screen.getByLabelText('Your name')).toHaveValue('Ada')
    expect(screen.getByLabelText('Email address')).toHaveValue('ada@example.com')
    expect(screen.getByLabelText('Tell me about your project...')).toHaveValue('Hello')
  })

  test('treats a network error like a failed request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const { user } = await renderForm()

    await fillIn(user)
    await submit(user)

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
  })

  test('pretends to succeed without sending when the honeypot is ticked', async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({ success: true }) })
    const { user, container } = await renderForm()

    await fillIn(user)
    await user.click(container.querySelector('input[name="botcheck"]'))
    await submit(user)

    expect(fetchMock).not.toHaveBeenCalled()
    expect(status()).toHaveTextContent(/your message is on its way/i)
  })

  test('points to email without exposing configuration when no key is set', async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({ success: true }) })
    const { user } = await renderForm({ key: '' })

    await fillIn(user)
    await submit(user)

    expect(fetchMock).not.toHaveBeenCalled()
    expect(status()).toHaveTextContent(`The form is unavailable right now. Please email me directly at ${PROFILE.email}.`)
    expect(status()).not.toHaveTextContent('VITE_')
  })
})
