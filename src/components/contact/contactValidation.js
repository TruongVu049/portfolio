const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const LIMITS = { name: 100, email: 254, message: 5000 }

const FIELDS = ['name', 'email', 'message']

/**
 * Trims the form values and checks them. `field` names the first invalid field so
 * the form can mark it and move focus there.
 *
 * @param {{ name: string, email: string, message: string }} values
 * @returns {{ error: string | null, field: string | null, data: { name: string, email: string, message: string } }}
 */
export function validateContact(values) {
  const data = {
    name: values.name.trim(),
    email: values.email.trim(),
    message: values.message.trim(),
  }
  const fail = (field, error) => ({ error, field, data })

  const blank = FIELDS.find((field) => !data[field])
  if (blank) return fail(blank, 'Please fill in every field.')
  if (!EMAIL_PATTERN.test(data.email)) return fail('email', 'Please enter a valid email address.')
  const tooLong = FIELDS.find((field) => data[field].length > LIMITS[field])
  if (tooLong) return fail(tooLong, 'One of the fields is too long.')
  return { error: null, field: null, data }
}
