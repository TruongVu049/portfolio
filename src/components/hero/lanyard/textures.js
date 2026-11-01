import * as THREE from 'three'
import { PROFILE } from '../../../data/profile'
import { seededRandom } from '../space/starfield'

/** Logical drawing size; the backing canvas is TEXTURE_SCALE times larger for crisp text. */
export const CARD_CANVAS = { width: 512, height: 720 }
export const STRAP_CANVAS = { width: 640, height: 128 }
const TEXTURE_SCALE = 2
const RADIUS = 34
const PAD = 44
const TAU = Math.PI * 2
const ACCENT = '#3b82f6'
const ACCENT_SOFT = '#93c5fd'
const SIGNATURE = '"Mrs Saint Delafield", cursive'
const SANS = '"Supreme", system-ui, sans-serif'
const MONO = 'ui-monospace, "SF Mono", Consolas, monospace'

/** Fonts the canvases need; awaited before the final redraw. */
export const CANVAS_FONTS = [`400 100px ${SIGNATURE}`, `700 40px ${SANS}`]

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function fillCircle(ctx, x, y, r, fill) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, TAU)
  ctx.fillStyle = fill
  ctx.fill()
}

function radialGlow(ctx, x, y, radius, color) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius)
  glow.addColorStop(0, color)
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  return glow
}

/**
 * Scatters stars, skipping `avoid` boxes ([x, y, w, h]) so no dot lands inside small
 * text, where it would read as stray punctuation.
 */
function paintStars(ctx, width, height, count, seed, avoid = []) {
  const rand = seededRandom(seed)
  const isHidden = (x, y) => avoid.some(([ax, ay, aw, ah]) => x >= ax && x <= ax + aw && y >= ay && y <= ay + ah)
  for (let i = 0; i < count; i += 1) {
    const x = rand() * width
    const y = rand() * height
    const alpha = 0.2 + rand() * 0.7
    const radius = 0.5 + rand() * 1.1
    if (isHidden(x, y)) continue
    ctx.globalAlpha = alpha
    fillCircle(ctx, x, y, radius, '#ffffff')
  }
  ctx.globalAlpha = 1
}

/** Four-point sparkle for the few bright stars. */
function paintFlare(ctx, x, y, size) {
  ctx.fillStyle = radialGlow(ctx, x, y, size * 1.6, 'rgba(191,219,254,0.7)')
  ctx.fillRect(x - size * 2, y - size * 2, size * 4, size * 4)
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x - size * 2, y)
  ctx.lineTo(x + size * 2, y)
  ctx.moveTo(x, y - size * 2)
  ctx.lineTo(x, y + size * 2)
  ctx.stroke()
  fillCircle(ctx, x, y, 1.6, '#ffffff')
}

/** Lit planet curve along the bottom of the card, echoing the hero horizon. */
function paintHorizon(ctx, width, height, rimY) {
  const radius = width * 1.5
  const cx = width / 2
  ctx.fillStyle = radialGlow(ctx, cx, rimY, width * 0.75, 'rgba(59,130,246,0.38)')
  ctx.fillRect(0, 0, width, height)

  ctx.beginPath()
  ctx.arc(cx, rimY + radius, radius, 0, TAU)
  const body = ctx.createLinearGradient(0, rimY, 0, height)
  body.addColorStop(0, '#0c1733')
  body.addColorStop(0.4, '#02030a')
  ctx.fillStyle = body
  ctx.fill()

  ctx.save()
  ctx.shadowColor = 'rgba(96,165,250,0.95)'
  ctx.shadowBlur = 16
  ctx.strokeStyle = 'rgba(191,219,254,0.85)'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.restore()
}

/** Deep-space card body: nebula glow, faint grid, stars, horizon, rounded corners and border. */
function paintCardBase(ctx, { width, height }, { seed, rimY, avoid }) {
  ctx.clearRect(0, 0, width, height)
  roundedRect(ctx, 0, 0, width, height, RADIUS)
  ctx.save()
  ctx.clip()

  const base = ctx.createLinearGradient(0, 0, width, height)
  base.addColorStop(0, '#0a1024')
  base.addColorStop(1, '#03040a')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = radialGlow(ctx, width * 0.88, height * 0.08, width * 0.85, 'rgba(59,130,246,0.42)')
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = radialGlow(ctx, width * 0.05, height * 0.5, width * 0.6, 'rgba(99,102,241,0.16)')
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = 'rgba(255,255,255,0.03)'
  ctx.lineWidth = 1
  for (let x = 48; x < width; x += 48) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 48; y < height; y += 48) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  paintStars(ctx, width, rimY, 90, seed, avoid)
  paintFlare(ctx, width * 0.82, height * 0.27, 5)
  paintFlare(ctx, width * 0.88, height * 0.57, 3.5)
  paintHorizon(ctx, width, height, rimY)
  ctx.restore()

  roundedRect(ctx, 1.5, 1.5, width - 3, height - 3, RADIUS - 1)
  ctx.strokeStyle = 'rgba(147,197,253,0.4)'
  ctx.lineWidth = 3
  ctx.stroke()

  // punched slot for the clip
  roundedRect(ctx, width / 2 - 44, 26, 88, 16, 8)
  ctx.fillStyle = '#000'
  ctx.fill()
}

/** Largest font size (<= maxSize) at which every line fits within maxWidth. */
function fitFontSize(ctx, lines, maxWidth, maxSize, fontFor) {
  ctx.font = fontFor(maxSize)
  const widest = Math.max(...lines.map((line) => ctx.measureText(line).width))
  return widest <= maxWidth ? maxSize : Math.floor((maxSize * maxWidth) / widest)
}

/** Point on a rotated ellipse, for placing things on an orbit. */
function onOrbit(cx, cy, rx, ry, tilt, t) {
  const x = rx * Math.cos(t)
  const y = ry * Math.sin(t)
  return [cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]
}

/** Round mission patch: initials inside a disc with an orbit and a satellite on it. */
function paintMissionPatch(ctx, cx, cy, r) {
  const tilt = -0.35
  const disc = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 0, cx, cy, r)
  disc.addColorStop(0, '#1e3a8a')
  disc.addColorStop(1, '#0a1124')
  fillCircle(ctx, cx, cy, r, disc)
  ctx.strokeStyle = 'rgba(147,197,253,0.75)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.beginPath()
  ctx.ellipse(cx, cy, r * 1.4, r * 0.42, tilt, 0, TAU)
  ctx.strokeStyle = 'rgba(147,197,253,0.6)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  const [sx, sy] = onOrbit(cx, cy, r * 1.4, r * 0.42, tilt, -0.5)
  fillCircle(ctx, sx, sy, 3.5, '#e0ecff')

  ctx.font = `italic 700 24px ${SANS}`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(PROFILE.initials, cx, cy + 1)
  ctx.textAlign = 'left'
}

/** Same pill as the hero's status line: soft glass chip with a live dot. */
function paintStatusChip(ctx, x, y) {
  const label = PROFILE.available ? 'OPEN TO WORK' : 'CURRENTLY BUSY'
  const dot = PROFILE.available ? '52,211,153' : '251,191,36'
  ctx.font = `600 15px ${MONO}`
  ctx.letterSpacing = '3px'
  const width = ctx.measureText(label).width + 58
  roundedRect(ctx, x, y, width, 40, 20)
  ctx.fillStyle = 'rgba(255,255,255,0.05)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  fillCircle(ctx, x + 22, y + 20, 9, `rgba(${dot},0.25)`)
  fillCircle(ctx, x + 22, y + 20, 4.5, `rgb(${dot})`)
  ctx.fillStyle = '#d4d4d8'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, x + 40, y + 21)
  ctx.letterSpacing = '0px'
}

/** Glowing script signature, the same treatment as the hero name. */
function paintSignatureName(ctx, width) {
  const font = (size) => `400 ${size}px ${SIGNATURE}`
  const lines = [PROFILE.firstName, PROFILE.lastName]
  const size = fitFontSize(ctx, lines, width - PAD * 2 - 40, 102, font)
  const firstBaseline = 318
  const fill = ctx.createLinearGradient(PAD, 240, width - PAD, 430)
  fill.addColorStop(0, '#ffffff')
  fill.addColorStop(0.55, '#e0ecff')
  fill.addColorStop(1, ACCENT_SOFT)

  ctx.save()
  ctx.font = font(size)
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = fill
  ctx.shadowColor = 'rgba(59,130,246,0.65)'
  ctx.shadowBlur = 22
  ctx.fillText(lines[0], PAD, firstBaseline)
  // The second line is pushed right so the first line's descender swash clears it.
  ctx.fillText(lines[1], PAD + 96, firstBaseline + Math.round(size * 0.86))
  ctx.restore()
}

function paintSpecRow(ctx, y, label, value, width) {
  const valueX = PAD + 84
  ctx.font = `600 13px ${MONO}`
  ctx.letterSpacing = '2px'
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.fillText(label, PAD, y)
  ctx.font = `500 ${fitFontSize(ctx, [value], width - PAD - valueX, 14, (s) => `500 ${s}px ${MONO}`)}px ${MONO}`
  ctx.fillStyle = 'rgba(224,236,255,0.85)'
  ctx.fillText(value, valueX, y)
  ctx.letterSpacing = '0px'
}

export function drawCardFront(ctx) {
  const { width } = CARD_CANVAS
  paintCardBase(ctx, CARD_CANVAS, {
    seed: 11,
    rimY: 608,
    // header labels, status chip, role + spec rows
    avoid: [[300, 80, 180, 56], [PAD - 6, 166, 260, 52], [PAD - 6, 450, 440, 110]],
  })

  // header: mission patch + pass label
  paintMissionPatch(ctx, PAD + 30, 108, 30)
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.letterSpacing = '3px'
  ctx.font = `600 16px ${MONO}`
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fillText('CREW PASS', width - PAD, 96)
  ctx.font = `500 13px ${MONO}`
  ctx.fillStyle = 'rgba(147,197,253,0.75)'
  ctx.fillText('MISSION · 2026', width - PAD, 122)
  ctx.letterSpacing = '0px'
  ctx.textAlign = 'left'

  paintStatusChip(ctx, PAD, 172)
  paintSignatureName(ctx, width)

  // role
  ctx.fillStyle = ACCENT
  ctx.fillRect(PAD, 466, 36, 3)
  ctx.font = `600 19px ${MONO}`
  ctx.letterSpacing = '2px'
  ctx.fillStyle = ACCENT_SOFT
  ctx.textBaseline = 'middle'
  ctx.fillText(PROFILE.role.toUpperCase(), PAD + 50, 468)
  ctx.letterSpacing = '0px'

  paintSpecRow(ctx, 516, 'BASE', PROFILE.location.toUpperCase(), width)
  paintSpecRow(ctx, 546, 'STACK', PROFILE.focus.toUpperCase(), width)

  // footer, on the planet's dark side
  ctx.font = `500 14px ${MONO}`
  ctx.letterSpacing = '2px'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText(`ID ${PROFILE.initials}-001`, PAD, 680)
  ctx.textAlign = 'right'
  ctx.fillText('CLEARANCE: ALL ORBITS', width - PAD, 680)
  ctx.textAlign = 'left'
  ctx.letterSpacing = '0px'
}

/** Ringed planet like the one in the hero scene: back ring half, planet, front ring half. */
function paintRingedPlanet(ctx, cx, cy, r) {
  const tilt = -0.35
  const rx = r * 1.85
  const ry = r * 0.4
  const ring = (start, end, color) => {
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, tilt, start, end)
    ctx.strokeStyle = color
    ctx.lineWidth = 7
    ctx.stroke()
  }

  ctx.fillStyle = radialGlow(ctx, cx, cy, r * 1.9, 'rgba(99,102,241,0.4)')
  ctx.fillRect(cx - r * 2, cy - r * 2, r * 4, r * 4)
  ring(Math.PI, TAU, 'rgba(199,210,254,0.35)')

  const body = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.45, r * 0.05, cx, cy, r * 1.05)
  body.addColorStop(0, '#c7d2fe')
  body.addColorStop(0.3, '#6366f1')
  body.addColorStop(0.72, '#1e1b4b')
  body.addColorStop(1, '#030312')
  fillCircle(ctx, cx, cy, r, body)

  // cloud bands, clipped to the disc
  ctx.save()
  ctx.clip()
  ctx.translate(cx, cy)
  ctx.rotate(tilt)
  ctx.strokeStyle = 'rgba(199,210,254,0.14)'
  for (const [y, lineWidth] of [[-r * 0.3, 12], [r * 0.25, 8]]) {
    ctx.beginPath()
    ctx.moveTo(-r, y)
    ctx.quadraticCurveTo(0, y - r * 0.18, r, y)
    ctx.lineWidth = lineWidth
    ctx.stroke()
  }
  ctx.restore()

  ring(0, Math.PI, 'rgba(224,231,255,0.85)')
  const [mx, my] = onOrbit(cx, cy, rx * 0.78, ry * 0.78, tilt, 2.3)
  const moon = ctx.createRadialGradient(mx - 3, my - 3, 0, mx, my, 10)
  moon.addColorStop(0, '#f1f5f9')
  moon.addColorStop(1, '#475569')
  fillCircle(ctx, mx, my, 9, moon)
}

export function drawCardBack(ctx) {
  const { width, height } = CARD_CANVAS
  paintCardBase(ctx, CARD_CANVAS, { seed: 23, rimY: 600, avoid: [[90, 450, 332, 70]] })
  paintRingedPlanet(ctx, width / 2, height / 2 - 70, 92)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.letterSpacing = '4px'
  ctx.font = `600 18px ${MONO}`
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillText('BUILD · SHIP · REPEAT', width / 2, height / 2 + 110)
  ctx.font = `500 13px ${MONO}`
  ctx.fillStyle = 'rgba(147,197,253,0.7)'
  ctx.fillText(`${PROFILE.initials} · ${PROFILE.locationShort.toUpperCase()}`, width / 2, height / 2 + 144)
  ctx.letterSpacing = '0px'
  ctx.textAlign = 'left'
}

/** Night-sky strap with lit edges and the name repeated along it (tiled along the band). */
export function drawStrap(ctx, width, height) {
  const strap = ctx.createLinearGradient(0, 0, 0, height)
  strap.addColorStop(0, '#0b1430')
  strap.addColorStop(0.5, '#172a66')
  strap.addColorStop(1, '#0b1430')
  ctx.fillStyle = strap
  ctx.fillRect(0, 0, width, height)
  paintStars(ctx, width, height, 40, 5)
  ctx.fillStyle = 'rgba(147,197,253,0.6)'
  ctx.fillRect(0, 6, width, 2)
  ctx.fillRect(0, height - 8, width, 2)

  // One name per tile; the band repeats the tile along its length.
  const label = `${PROFILE.firstName} ${PROFILE.lastName}`.toUpperCase()
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  let size = 72
  do {
    ctx.font = `700 ${size}px ${SANS}`
    size -= 2
  } while (ctx.measureText(`${label}  ✦`).width > width - 24 && size > 24)
  ctx.save()
  ctx.fillStyle = '#e0ecff'
  ctx.shadowColor = 'rgba(59,130,246,0.9)'
  ctx.shadowBlur = 12
  ctx.fillText(`${label}  ✦`, width / 2, height / 2 + 3)
  ctx.restore()
  ctx.textAlign = 'left'
}

/**
 * Canvas-backed texture that can be redrawn later (e.g. once web fonts load).
 * `draw` works in logical width/height; the backing store is upscaled by TEXTURE_SCALE.
 * @param {(ctx: CanvasRenderingContext2D, w: number, h: number) => void} draw
 */
export function createCanvasTexture(draw, width, height, { repeat = false } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = width * TEXTURE_SCALE
  canvas.height = height * TEXTURE_SCALE
  const ctx = canvas.getContext('2d')
  const paint = () => {
    ctx.setTransform(TEXTURE_SCALE, 0, 0, TEXTURE_SCALE, 0, 0)
    draw(ctx, width, height)
  }
  paint()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  // three.js clamps this to the GPU's maximum.
  texture.anisotropy = 16
  if (repeat) {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
  }
  const redraw = () => {
    paint()
    texture.needsUpdate = true
  }
  return { texture, redraw }
}
