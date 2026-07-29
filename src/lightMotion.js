export function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

function advanceSpring(position, velocity, target, deltaSeconds) {
  const stiffness = 54
  const damping = 12
  const acceleration = (target - position) * stiffness - velocity * damping
  const nextVelocity = velocity + acceleration * deltaSeconds

  return {
    position: position + nextVelocity * deltaSeconds,
    velocity: nextVelocity,
  }
}

export function resolveLightTarget({ pointer, viewport, documentRect }) {
  const viewportWidth = Math.max(1, viewport.width)
  const viewportHeight = Math.max(1, viewport.height)
  const documentWidth = Math.max(1, documentRect.width)
  const documentHeight = Math.max(1, documentRect.height)
  const horizontal = clamp((pointer.x / viewportWidth - 0.5) * 2, -1, 1)
  const vertical = clamp((pointer.y / viewportHeight - 0.5) * 2, -1, 1)
  const hoverStrength = clamp(Math.hypot(horizontal, vertical) / Math.SQRT2, 0, 1)

  return {
    anchorX: viewportWidth / 2,
    targetSwingX: vertical * -8,
    targetSwingZ: horizontal * 15,
    documentX: clamp(((pointer.x - documentRect.left) / documentWidth) * 100, 4, 96),
    documentY: clamp(((pointer.y - documentRect.top) / documentHeight) * 100, 6, 94),
    coneScale: 1 - hoverStrength * 0.12,
  }
}

export function advanceLightMotion(current, target, deltaSeconds) {
  const safeDelta = clamp(deltaSeconds, 0, 0.064)
  const swingX = advanceSpring(current.swingX ?? 0, current.swingXVelocity ?? 0, target.targetSwingX, safeDelta)
  const swingZ = advanceSpring(current.swingZ ?? 0, current.swingZVelocity ?? 0, target.targetSwingZ, safeDelta)
  const follow = 1 - Math.exp(-18 * safeDelta)
  const swingMagnitude = Math.hypot(swingX.position, swingZ.position) * (Math.PI / 180)
  const hangLength = 160

  return {
    anchorX: target.anchorX,
    swingX: swingX.position,
    swingXVelocity: swingX.velocity,
    swingZ: swingZ.position,
    swingZVelocity: swingZ.velocity,
    documentX: (current.documentX ?? target.documentX) + (target.documentX - (current.documentX ?? target.documentX)) * follow,
    documentY: (current.documentY ?? target.documentY) + (target.documentY - (current.documentY ?? target.documentY)) * follow,
    coneScale: (current.coneScale ?? target.coneScale) + (target.coneScale - (current.coneScale ?? target.coneScale)) * follow,
    coneOffsetX: Math.sin(swingZ.position * (Math.PI / 180)) * hangLength,
    coneOffsetY: -(1 - Math.cos(swingMagnitude)) * hangLength,
  }
}
