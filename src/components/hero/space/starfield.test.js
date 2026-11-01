import { describe, expect, it } from 'vitest'
import { createStars } from './starfield'

describe('createStars', () => {
  it('returns the requested number of stars', () => {
    expect(createStars(40)).toHaveLength(40)
  })

  it('is deterministic for the same seed', () => {
    expect(createStars(20, 3)).toEqual(createStars(20, 3))
  })

  it('produces a different sky for a different seed', () => {
    expect(createStars(20, 3)).not.toEqual(createStars(20, 4))
  })

  it('keeps every star inside the visible sky above the horizon', () => {
    for (const star of createStars(200)) {
      expect(star.x).toBeGreaterThanOrEqual(0)
      expect(star.x).toBeLessThanOrEqual(100)
      expect(star.y).toBeGreaterThanOrEqual(0)
      expect(star.y).toBeLessThanOrEqual(78)
      expect(star.opacity).toBeGreaterThan(0)
      expect(star.opacity).toBeLessThanOrEqual(1)
      expect(star.delay).toBeLessThanOrEqual(0)
    }
  })
})
