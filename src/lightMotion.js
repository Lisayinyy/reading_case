export function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

export function resolveLightTarget({ pointer, viewport, documentRect }) {
  const viewportWidth = Math.max(1, viewport.width)
  const viewportHeight = Math.max(1, viewport.height)
  const lampPadding = Math.min(80, Math.max(44, viewportWidth * 0.06))
  const documentWidth = Math.max(1, documentRect.width)
  const documentHeight = Math.max(1, documentRect.height)
  const lampX = clamp(pointer.x, lampPadding, viewportWidth - lampPadding)
  const depthProgress = clamp(pointer.y / viewportHeight, 0, 1) * 2 - 1
  const proximity = (depthProgress + 1) / 2

  return {
    x: lampX,
    documentX: clamp(((pointer.x - documentRect.left) / documentWidth) * 100, 4, 96),
    documentY: clamp(((pointer.y - documentRect.top) / documentHeight) * 100, 6, 94),
    tilt: clamp(((lampX / viewportWidth) - 0.5) * 16, -8, 8),
    elevation: depthProgress * 22,
    depth: depthProgress * 70,
    scale: 1 + depthProgress * 0.07,
    pitch: depthProgress * -4,
    coneScale: 1 + depthProgress * 0.1,
    bulbScale: 0.78 + proximity * 0.38,
    rimHeight: 31 - proximity * 12,
    bulbOpacity: 0.72 + proximity * 0.28,
    bulbGlow: 0.62 + proximity * 0.38,
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
    elevation: current.elevation + (target.elevation - current.elevation) * follow,
    depth: current.depth + (target.depth - current.depth) * follow,
    scale: current.scale + (target.scale - current.scale) * follow,
    pitch: current.pitch + (target.pitch - current.pitch) * tiltFollow,
    coneScale: current.coneScale + (target.coneScale - current.coneScale) * follow,
    bulbScale: current.bulbScale + (target.bulbScale - current.bulbScale) * follow,
    rimHeight: current.rimHeight + (target.rimHeight - current.rimHeight) * follow,
    bulbOpacity: current.bulbOpacity + (target.bulbOpacity - current.bulbOpacity) * follow,
    bulbGlow: current.bulbGlow + (target.bulbGlow - current.bulbGlow) * follow,
  }
}
