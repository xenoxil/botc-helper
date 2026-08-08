export type SeatQuarterT = 'top' | 'right' | 'bottom' | 'left'

export interface ICirclePosition {
  x: number
  y: number
  angleDeg: number
  /** 90° sector the seat belongs to (name outside, notes opposite). */
  quarter: SeatQuarterT
}

/** Normalize degrees to [-180, 180). */
const normalizeAngleDeg = (angleDeg: number): number =>
  ((((angleDeg + 180) % 360) + 360) % 360) - 180

/**
 * Four equal 90° quarters centered on cardinal directions.
 * Top: [-135, -45), Right: [-45, 45), Bottom: [45, 135), Left: rest.
 */
export const getSeatQuarter = (angleDeg: number): SeatQuarterT => {
  const a = normalizeAngleDeg(angleDeg)
  if (a >= -135 && a < -45) return 'top'
  if (a >= -45 && a < 45) return 'right'
  if (a >= 45 && a < 135) return 'bottom'
  return 'left'
}

/** Polar layout: first seat at top (−90°), then evenly around. Coordinates in %. */
export const getCirclePositions = (
  count: number,
  radiusPercent = 35,
): ICirclePosition[] => {
  if (count <= 0) return []

  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / count
    const angleDeg = (angle * 180) / Math.PI
    return {
      x: 50 + radiusPercent * Math.cos(angle),
      y: 50 + radiusPercent * Math.sin(angle),
      angleDeg,
      quarter: getSeatQuarter(angleDeg),
    }
  })
}

export const getPlayerInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

export const getNotesPreview = (notes: string): string => {
  const trimmed = notes.trim().replace(/\s+/g, ' ')
  return trimmed.length > 0 ? trimmed : '…'
}
