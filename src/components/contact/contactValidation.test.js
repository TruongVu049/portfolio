import { describe, expect, test } from 'vitest'
import { LIMITS, validateContact } from './contactValidation'

const valid = { name: 'Ada', email: 'ada@example.com', message: 'Hello there' }

describe('validateContact', () => {
  test('accepts a complete message and trims every field', () => {
    const result = validateContact({ name: '  Ada ', email: ' ada@example.com ', message: '\nHello there  ' })

    expect(result.error).toBeNull()
    expect(result.field).toBeNull()
    expect(result.data).toEqual(valid)
  })

  test.each(['name', 'email', 'message'])('rejects a blank %s and names that field', (field) => {
    const result = validateContact({ ...valid, [field]: '   ' })

    expect(result.error).toBe('Please fill in every field.')
    expect(result.field).toBe(field)
  })

  test('names the first blank field when several are empty', () => {
    expect(validateContact({ name: '', email: '', message: 'Hi' }).field).toBe('name')
  })

  test.each(['ada', 'ada@', 'ada@example', 'a da@example.com'])('rejects the malformed email "%s"', (email) => {
    const result = validateContact({ ...valid, email })

    expect(result.error).toBe('Please enter a valid email address.')
    expect(result.field).toBe('email')
  })

  test.each(Object.entries(LIMITS))('rejects a %s longer than %i characters', (field, max) => {
    const tooLong = field === 'email' ? `${'a'.repeat(max)}@example.com` : 'a'.repeat(max + 1)
    const result = validateContact({ ...valid, [field]: tooLong })

    expect(result.error).toBe('One of the fields is too long.')
    expect(result.field).toBe(field)
  })

  test('accepts values exactly at the limit', () => {
    const result = validateContact({ ...valid, name: 'a'.repeat(LIMITS.name), message: 'm'.repeat(LIMITS.message) })

    expect(result.error).toBeNull()
  })
})
