export function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

export function resolveLightTarget({ pointer, viewport, documentRect }) {
  const viewportWidth = Math.max(1, viewport.width)
  const lampPadding = Math.min(80, Math.max(44, viewportWidth * 0.06))
  const documentWidth = Math.max(1, documentRect.width)
  const documentHeight = Math.max(1, documentRect.height)
  const lampX = clamp(pointer.x, lampPadding, viewportWidth - lampPadding)

  return {
    x: lampX,
    documentX: clamp(((pointer.x - documentRect.left) / documentWidth) * 100, 4, 96),
    documentY: clamp(((pointer.y - documentRect.top) / documentHeight) * 100, 6, 94),
    tilt: clamp(((lampX / viewportWidth) - 0.5) * 16, -8, 8),
  }
}

export function advanceLightMotion(current, target, deltaSeconds) {
  const safeDelta = clamp(deltaSeconds, 0, 0.064)
  const follow = 1 - Math.exp(-18 * safeDelta)
  const tiltFollow = 1 - Math.exp(-14 * safeDelta)

  return {
    x: current.x + (target.x - current.x) * follow,
    documentX: current.documentX + (target.documentX - current.documentX) * follow,
    documentY: current.documentY + (target.documentY - current.documentY) * follow,
    tilt: current.tilt + (target.tilt - current.tilt) * tiltFollow,
  }
}
