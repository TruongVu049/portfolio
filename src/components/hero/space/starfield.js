/**
 * Seeded PRNG (mulberry32): the sky is identical on every render, so stars never jump.
 * @param {number} seed
 * @returns {() => number} values in [0, 1)
 */
export function seededRandom(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const round = (n) => Math.round(n * 100) / 100
// The horizon covers the lower part of the hero, so no stars are placed there.
const SKY_HEIGHT_PCT = 78
const BRIGHT_STAR_CHANCE = 0.1

/**
 * @param {number} count
 * @param {number} [seed]
 * @returns {{ id: number, x: number, y: number, size: number, opacity: number, duration: number, delay: number, bright: boolean }[]}
 */
export function createStars(count, seed = 7) {
  const rand = seededRandom(seed)
  return Array.from({ length: count }, (_, id) => {
    const bright = rand() < BRIGHT_STAR_CHANCE
    return {
      id,
      x: round(rand() * 100),
      y: round(rand() * SKY_HEIGHT_PCT),
      size: bright ? 2.5 : round(1 + rand() * 0.8),
      opacity: round(bright ? 0.9 : 0.25 + rand() * 0.5),
      duration: round(3 + rand() * 5),
      // Negative delays start each star mid-cycle, so they do not all twinkle in sync.
      delay: round(-rand() * 8),
      bright,
    }
  })
}
