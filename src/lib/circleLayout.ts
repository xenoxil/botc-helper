export interface ICirclePosition {
  x: number
  y: number
  angleDeg: number
}

/** Polar layout: first seat at top (−90°), clockwise. Coordinates in %. */
export const getCirclePositions = (
  count: number,
  radiusPercent = 40,
): ICirclePosition[] => {
  if (count <= 0) return []

  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / count
    return {
      x: 50 + radiusPercent * Math.cos(angle),
      y: 50 + radiusPercent * Math.sin(angle),
      angleDeg: (angle * 180) / Math.PI,
    }
  })
}

export const getPlayerInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}
