import assert from 'node:assert/strict'
import test from 'node:test'
import { advanceLightMotion, resolveLightTarget } from './lightMotion.js'

const viewport = { width: 1200, height: 800 }
const documentRect = { left: 300, top: 120, width: 600, height: 900 }

test('keeps the lamp mobile near viewport edges while the document spotlight stays in bounds', () => {
  const left = resolveLightTarget({ pointer: { x: 0, y: 0 }, viewport, documentRect })
  const right = resolveLightTarget({ pointer: { x: 1200, y: 1000 }, viewport, documentRect })

  assert.equal(left.x, 72)
  assert.equal(right.x, 1128)
  assert.equal(left.documentX, 4)
  assert.equal(right.documentX, 96)
  assert.equal(left.documentY, 6)
  assert.equal(right.documentY, 94)
  assert.ok(left.depth < 0 && right.depth > 0)
  assert.ok(left.elevation < 0 && right.elevation > 0)
  assert.ok(left.scale < 1 && right.scale > 1)
  assert.ok(left.bulbScale < right.bulbScale)
  assert.ok(left.rimHeight > right.rimHeight)
})

test('eases toward a new target without overshooting it', () => {
  const next = advanceLightMotion(
    { x: 600, documentX: 50, documentY: 50, tilt: 0, elevation: 0, depth: 0, scale: 1, pitch: 0, coneScale: 1, bulbScale: 0.9, rimHeight: 28, bulbOpacity: 0.8, bulbGlow: 0.75 },
    { x: 1000, documentX: 90, documentY: 70, tilt: 6, elevation: 18, depth: 58, scale: 1.06, pitch: -3, coneScale: 1.08, bulbScale: 1.12, rimHeight: 19, bulbOpacity: 1, bulbGlow: 1 },
    1 / 60,
  )

  assert.ok(next.x > 600 && next.x < 1000)
  assert.ok(next.documentX > 50 && next.documentX < 90)
  assert.ok(next.documentY > 50 && next.documentY < 70)
  assert.ok(next.tilt > 0 && next.tilt < 6)
  assert.ok(next.depth > 0 && next.depth < 58)
  assert.ok(next.scale > 1 && next.scale < 1.06)
  assert.ok(next.bulbScale > 0.9 && next.bulbScale < 1.12)
})
