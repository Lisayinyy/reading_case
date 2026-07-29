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
})

test('eases toward a new target without overshooting it', () => {
  const next = advanceLightMotion(
    { x: 600, documentX: 50, documentY: 50, tilt: 0 },
    { x: 1000, documentX: 90, documentY: 70, tilt: 6 },
    1 / 60,
  )

  assert.ok(next.x > 600 && next.x < 1000)
  assert.ok(next.documentX > 50 && next.documentX < 90)
  assert.ok(next.documentY > 50 && next.documentY < 70)
  assert.ok(next.tilt > 0 && next.tilt < 6)
})
