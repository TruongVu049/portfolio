import * as THREE from 'three'
import { PROFILE } from '../../../data/profile'

export const CARD_CANVAS = { width: 512, height: 720 }
const RADIUS = 34
const ACCENT = '#3b82f6'
const ACCENT_SOFT = '#93c5fd'
const SERIF = '"DM Serif Display", Georgia, serif'
const SANS = '"Supreme", system-ui, sans-serif'
const MONO = 'ui-monospace, "SF Mono", Consolas, monospace'

/** Fonts the canvases need; awaited before the final redraw. */
export const CANVAS_FONTS = [`400 120px ${SERIF}`, `700 40px ${SANS}`, `500 20px ${SANS}`]

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** Dark card body with a blue glow, rounded corners (transparent outside) and a hairline border. */
function paintCardBase(ctx, { width, height }) {
  ctx.clearRect(0, 0, width, height)
  roundedRect(ctx, 0, 0, width, height, RADIUS)
  ctx.save()
  ctx.clip()

  const base = ctx.createLinearGradient(0, 0, width, height)
  base.addColorStop(0, '#0d1424')
  base.addColorStop(1, '#050608')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, width, height)

  const glow = ctx.createRadialGradient(width * 0.85, height * 0.12, 0, width * 0.85, height * 0.12, width * 0.9)
  glow.addColorStop(0, 'rgba(59,130,246,0.55)')
  glow.addColorStop(0.45, 'rgba(29,78,216,0.18)')
  glow.addColorStop(1, 'rgba(29,78,216,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, width, height)

  // faint grid texture
  ctx.strokeStyle = 'rgba(255,255,255,0.035)'
  ctx.lineWidth = 1
  for (let x = 32; x < width; x += 32) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 32; y < height; y += 32) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  ctx.restore()

  roundedRect(ctx, 1.5, 1.5, width - 3, height - 3, RADIUS - 1)
  ctx.strokeStyle = 'rgba(147,197,253,0.35)'
  ctx.lineWidth = 3
  ctx.stroke()

  // punched slot for the clip
  roundedRect(ctx, width / 2 - 44, 26, 88, 16, 8)
  ctx.fillStyle = '#000'
  ctx.fill()
}

function paintBarcode(ctx, x, y, w, h, seed) {
  let value = seed
  let cursor = x
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  while (cursor < x + w) {
    value = (value * 9301 + 49297) % 233280
    const bar = 2 + (value % 5)
    ctx.fillRect(cursor, y, bar, h)
    cursor += bar + 2 + (value % 4)
  }
}

export function drawCardFront(ctx) {
  const { width, height } = CARD_CANVAS
  paintCardBase(ctx, CARD_CANVAS)
  const pad = 44

  // header: logo mark + pass label
  ctx.fillStyle = ACCENT_SOFT
  ctx.font = `700 40px ${SANS}`
  ctx.textBaseline = 'top'
  ctx.fillText('</>', pad, 82)
  ctx.font = `600 16px ${MONO}`
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.textAlign = 'right'
  ctx.fillText('DEV PASS · 2026', width - pad, 94)
  ctx.textAlign = 'left'

  // availability chip
  roundedRect(ctx, pad, 170, 196, 40, 20)
  ctx.fillStyle = 'rgba(16,185,129,0.12)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(52,211,153,0.45)'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(pad + 22, 190, 6, 0, Math.PI * 2)
  ctx.fillStyle = '#34d399'
  ctx.fill()
  ctx.font = `600 16px ${MONO}`
  ctx.fillStyle = '#a7f3d0'
  ctx.textBaseline = 'middle'
  ctx.fillText(PROFILE.available ? 'AVAILABLE' : 'BUSY', pad + 40, 191)

  // name
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#ffffff'
  ctx.font = `400 104px ${SERIF}`
  ctx.fillText(PROFILE.firstName, pad, 360)
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.fillText(PROFILE.lastName, pad, 460)

  // role
  ctx.fillStyle = ACCENT
  ctx.fillRect(pad, 502, 36, 3)
  ctx.font = `600 20px ${MONO}`
  ctx.fillStyle = ACCENT_SOFT
  ctx.fillText(PROFILE.role.toUpperCase(), pad + 50, 511)

  // footer: barcode + id
  paintBarcode(ctx, pad, 584, width - pad * 2, 52, 7)
  ctx.font = `500 15px ${MONO}`
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.fillText(`ID ${PROFILE.initials}-001`, pad, 672)
  ctx.textAlign = 'right'
  ctx.fillText('ACCESS: ALL AREAS', width - pad, 672)
  ctx.textAlign = 'left'
}

export function drawCardBack(ctx) {
  const { width, height } = CARD_CANVAS
  paintCardBase(ctx, CARD_CANVAS)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(147,197,253,0.9)'
  ctx.font = `700 150px ${SANS}`
  ctx.fillText('</>', width / 2, height / 2 - 30)
  ctx.font = `600 18px ${MONO}`
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('BUILD · SHIP · REPEAT', width / 2, height / 2 + 90)
  ctx.textAlign = 'left'
}

/** Blue strap with the name repeated along it (tiled along the band). */
export function drawStrap(ctx, width, height) {
  const strap = ctx.createLinearGradient(0, 0, 0, height)
  strap.addColorStop(0, '#1e40af')
  strap.addColorStop(0.5, '#2563eb')
  strap.addColorStop(1, '#1e40af')
  ctx.fillStyle = strap
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.fillRect(0, 6, width, 2)
  ctx.fillRect(0, height - 8, width, 2)
  // One name per tile; the band repeats the tile along its length.
  const label = `${PROFILE.firstName} ${PROFILE.lastName}`.toUpperCase()
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  let size = 72
  do {
    ctx.font = `700 ${size}px ${SANS}`
    size -= 2
  } while (ctx.measureText(`${label}  ✦`).width > width - 24 && size > 24)
  ctx.fillText(`${label}  ✦`, width / 2, height / 2 + 3)
  ctx.textAlign = 'left'
}

/**
 * Canvas-backed texture that can be redrawn later (e.g. once web fonts load).
 * @param {(ctx: CanvasRenderingContext2D, w: number, h: number) => void} draw
 */
export function createCanvasTexture(draw, width, height, { repeat = false } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  draw(ctx, width, height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  if (repeat) {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
  }
  const redraw = () => {
    draw(ctx, width, height)
    texture.needsUpdate = true
  }
  return { texture, redraw }
}
