// Tiny 2D circle physics: gravity, wall bounds, circle-circle separation.
// Bodies are plain objects mutated in place inside the animation loop for speed;
// they never leave the physics module / the BubblePit component.

const GRAVITY = 1400 // px/s²
const RESTITUTION = 0.35
const AIR_DRAG = 0.995
const FLOOR_FRICTION = 0.9
const SOLVER_PASSES = 4
const CENTER_PULL = 0.9 // horizontal acceleration toward the middle, per px of offset

/** @returns {{x:number,y:number,vx:number,vy:number,r:number,dragging:boolean}} */
export function createBody(x, y, r) {
  return { x, y, vx: (Math.random() - 0.5) * 120, vy: 0, r, dragging: false }
}

function constrainToBounds(body, width, height) {
  if (body.x - body.r < 0) {
    body.x = body.r
    body.vx = Math.abs(body.vx) * RESTITUTION
  } else if (body.x + body.r > width) {
    body.x = width - body.r
    body.vx = -Math.abs(body.vx) * RESTITUTION
  }
  if (body.y + body.r > height) {
    body.y = height - body.r
    body.vy = -Math.abs(body.vy) * RESTITUTION
    body.vx *= FLOOR_FRICTION
  } else if (body.y - body.r < -height) {
    // allow bodies to start above the box while dropping in
    body.y = body.r - height
  }
}

function separate(a, b) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const minDist = a.r + b.r
  const distSq = dx * dx + dy * dy
  if (distSq >= minDist * minDist || distSq === 0) return
  const dist = Math.sqrt(distSq)
  const nx = dx / dist
  const ny = dy / dist
  const overlap = minDist - dist
  const aWeight = a.dragging ? 0 : b.dragging ? 1 : 0.5
  const bWeight = 1 - aWeight
  a.x -= nx * overlap * aWeight
  a.y -= ny * overlap * aWeight
  b.x += nx * overlap * bWeight
  b.y += ny * overlap * bWeight

  const relative = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
  if (relative > 0) return
  const impulse = (-(1 + RESTITUTION) * relative) / 2
  if (!a.dragging) {
    a.vx -= impulse * nx
    a.vy -= impulse * ny
  }
  if (!b.dragging) {
    b.vx += impulse * nx
    b.vy += impulse * ny
  }
}

/** Advance the simulation by dt seconds. */
export function step(bodies, dt, width, height) {
  for (const body of bodies) {
    if (body.dragging) continue
    body.vy += GRAVITY * dt
    body.vx += (width / 2 - body.x) * CENTER_PULL * dt
    body.vx *= AIR_DRAG
    body.vy *= AIR_DRAG
    body.x += body.vx * dt
    body.y += body.vy * dt
  }
  for (let pass = 0; pass < SOLVER_PASSES; pass += 1) {
    for (let i = 0; i < bodies.length; i += 1) {
      for (let j = i + 1; j < bodies.length; j += 1) separate(bodies[i], bodies[j])
    }
    for (const body of bodies) constrainToBounds(body, width, height)
  }
}

const REST_SPEED = 8 // px/s below which a body counts as resting

/** True when no body is being dragged and all are (nearly) still. */
export function isSettled(bodies) {
  return bodies.every((b) => !b.dragging && Math.abs(b.vx) < REST_SPEED && Math.abs(b.vy) < REST_SPEED * 4 && b.y > 0)
}

const SETTLE_DT = 1 / 60
const MAX_SETTLE_STEPS = 1200 // 20 simulated seconds

/**
 * Run the simulation offline until everything rests, so the pile can be shown
 * without the falling animation (reduced motion).
 * @returns {number} steps taken
 */
export function settle(bodies, width, height, maxSteps = MAX_SETTLE_STEPS) {
  let steps = 0
  while (steps < maxSteps && !isSettled(bodies)) {
    step(bodies, SETTLE_DT, width, height)
    steps += 1
  }
  return steps
}

/**
 * Push bodies away from a moving pointer ("poke").
 * @returns {boolean} whether any body was touched (so the loop should wake up)
 */
export function poke(bodies, x, y, vx, vy, radius = 70) {
  let touched = false
  for (const body of bodies) {
    if (body.dragging) continue
    const dx = body.x - x
    const dy = body.y - y
    const dist = Math.hypot(dx, dy)
    if (dist > body.r + radius) continue
    const falloff = 1 - dist / (body.r + radius)
    body.vx += vx * 0.25 * falloff
    body.vy += vy * 0.25 * falloff
    touched = true
  }
  return touched
}
