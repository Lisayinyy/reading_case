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
    documentLeft: documentRect.left,
    documentTop: documentRect.top,
    documentWidth,
    documentHeight,
    coneScale: 1 - hoverStrength * 0.12,
  }
}

export function advanceLightMotion(current, target, deltaSeconds) {
  const safeDelta = clamp(deltaSeconds, 0, 0.064)
  const swingX = advanceSpring(current.swingX ?? 0, current.swingXVelocity ?? 0, target.targetSwingX, safeDelta)
  const swingZ = advanceSpring(current.swingZ ?? 0, current.swingZVelocity ?? 0, target.targetSwingZ, safeDelta)
  const swingMagnitude = Math.hypot(swingX.position, swingZ.position) * (Math.PI / 180)
  const hangLength = 160
  const swingZRadians = swingZ.position * (Math.PI / 180)
  const swingXRadians = swingX.position * (Math.PI / 180)
  const sourceX = target.anchorX + Math.sin(swingZRadians) * hangLength
  const sourceY = 184 - (1 - Math.cos(swingMagnitude)) * hangLength
  const projectionDistance = Math.max(320, target.documentTop - sourceY + 340)
  const projectedX = sourceX + Math.tan(swingZRadians) * projectionDistance
  const projectedY = sourceY - Math.tan(swingXRadians) * projectionDistance

  return {
    anchorX: target.anchorX,
    swingX: swingX.position,
    swingXVelocity: swingX.velocity,
    swingZ: swingZ.position,
    swingZVelocity: swingZ.velocity,
    documentX: clamp(((projectedX - target.documentLeft) / target.documentWidth) * 100, 12, 88),
    documentY: clamp(((projectedY - target.documentTop) / target.documentHeight) * 100, 20, 72),
    coneScale: (current.coneScale ?? target.coneScale) + (target.coneScale - (current.coneScale ?? target.coneScale)) * (1 - Math.exp(-18 * safeDelta)),
    coneOffsetX: Math.sin(swingZRadians) * hangLength,
    coneOffsetY: -(1 - Math.cos(swingMagnitude)) * hangLength,
  }
}
