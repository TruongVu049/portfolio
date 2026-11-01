import { describe, expect, test } from 'vitest'
import { createBody, isSettled, poke, settle, step } from './bubblePhysics'

const WIDTH = 600
const HEIGHT = 400

const still = (x, y, r = 20) => ({ ...createBody(x, y, r), vx: 0, vy: 0 })

describe('step', () => {
  test('gravity pulls a free body down', () => {
    const body = still(300, 100)

    step([body], 1 / 60, WIDTH, HEIGHT)

    expect(body.vy).toBeGreaterThan(0)
    expect(body.y).toBeGreaterThan(100)
  })

  test('the floor and walls keep bodies inside the box', () => {
    const bodies = [still(300, HEIGHT + 50), still(-30, 200), still(WIDTH + 30, 200)]

    step(bodies, 1 / 60, WIDTH, HEIGHT)

    for (const b of bodies) {
      expect(b.y + b.r).toBeLessThanOrEqual(HEIGHT)
      expect(b.x - b.r).toBeGreaterThanOrEqual(0)
      expect(b.x + b.r).toBeLessThanOrEqual(WIDTH)
    }
  })

  test('overlapping bodies are pushed apart', () => {
    const a = still(300, 380)
    const b = still(305, 380)

    step([a, b], 1 / 60, WIDTH, HEIGHT)

    expect(Math.hypot(b.x - a.x, b.y - a.y)).toBeGreaterThan(5)
  })

  test('a dragged body is not moved by gravity', () => {
    const body = { ...still(300, 100), dragging: true }

    step([body], 1 / 60, WIDTH, HEIGHT)

    expect(body.y).toBe(100)
  })
})

describe('isSettled', () => {
  test('is false while a body is dragged or still falling', () => {
    expect(isSettled([{ ...still(300, 380), dragging: true }])).toBe(false)
    expect(isSettled([{ ...still(300, 200), vy: 500 }])).toBe(false)
    expect(isSettled([still(300, -10)])).toBe(false)
  })

  test('is true once every body rests inside the box', () => {
    expect(isSettled([still(300, 380), still(100, 380)])).toBe(true)
  })
})

describe('settle', () => {
  test('drops a pile of bodies to rest without overlap', () => {
    const bodies = Array.from({ length: 12 }, (_, i) => createBody(50 + i * 40, -20 - i * 20, 24))

    const steps = settle(bodies, WIDTH, HEIGHT)

    expect(steps).toBeGreaterThan(0)
    expect(isSettled(bodies)).toBe(true)
    for (let i = 0; i < bodies.length; i += 1) {
      for (let j = i + 1; j < bodies.length; j += 1) {
        const [a, b] = [bodies[i], bodies[j]]
        // The solver allows a sliver of overlap; anything visible would be a bug.
        expect(Math.hypot(b.x - a.x, b.y - a.y)).toBeGreaterThan(a.r + b.r - 2)
      }
    }
  })

  test('stops at the step limit even if bodies never rest', () => {
    const body = { ...still(300, 100), dragging: true }

    expect(settle([body], WIDTH, HEIGHT, 25)).toBe(25)
  })
})

describe('poke', () => {
  test('pushes nearby bodies and reports that something moved', () => {
    const near = still(300, 300)
    const far = still(50, 50)

    const touched = poke([near, far], 290, 300, 400, 0)

    expect(touched).toBe(true)
    expect(near.vx).toBeGreaterThan(0)
    expect(far.vx).toBe(0)
  })

  test('ignores dragged bodies and empty space', () => {
    const dragged = { ...still(300, 300), dragging: true }

    expect(poke([dragged], 300, 300, 400, 0)).toBe(false)
    expect(dragged.vx).toBe(0)
  })
})
