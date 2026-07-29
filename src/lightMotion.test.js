import assert from 'node:assert/strict'
import test from 'node:test'
import { advanceLightMotion, resolveLightTarget } from './lightMotion.js'

const viewport = { width: 1200, height: 800 }
const documentRect = { left: 300, top: 120, width: 600, height: 900 }

test('keeps the ceiling anchor fixed while pointer position changes the two swing axes', () => {
  const left = resolveLightTarget({ pointer: { x: 0, y: 0 }, viewport, documentRect })
  const right = resolveLightTarget({ pointer: { x: 1200, y: 800 }, viewport, documentRect })

  assert.equal(left.anchorX, 600)
  assert.equal(right.anchorX, 600)
  assert.ok(left.targetSwingZ < 0 && right.targetSwingZ > 0)
  assert.ok(left.targetSwingX > 0 && right.targetSwingX < 0)
  assert.equal(left.documentX, 4)
  assert.equal(right.documentX, 96)
})

test('builds pendulum velocity and moves the beam with the lamp rather than teleporting it', () => {
  const target = resolveLightTarget({ pointer: { x: 1200, y: 800 }, viewport, documentRect })
  const next = advanceLightMotion(
    { ...resolveLightTarget({ pointer: { x: 600, y: 400 }, viewport, documentRect }), swingX: 0, swingZ: 0, swingXVelocity: 0, swingZVelocity: 0 },
    target,
    1 / 60,
  )

  assert.ok(next.swingZ > 0 && next.swingZ < target.targetSwingZ)
  assert.ok(next.swingX < 0 && next.swingX > target.targetSwingX)
  assert.ok(next.swingZVelocity > 0)
  assert.ok(next.coneOffsetX > 0)
  assert.ok(next.coneOffsetY < 0)
})

test('starts safely from a target-only state on the first animation frame', () => {
  const target = resolveLightTarget({ pointer: { x: 960, y: 640 }, viewport, documentRect })
  const next = advanceLightMotion(target, target, 1 / 60)

  assert.ok(Number.isFinite(next.swingX))
  assert.ok(Number.isFinite(next.swingZ))
  assert.ok(Number.isFinite(next.coneOffsetX))
})
