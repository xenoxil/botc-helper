import {
  getCirclePositions,
  getSeatQuarter,
  type ICirclePosition,
} from './circleLayout'
import type { LayoutModeT } from '../types/game'

/**
 * Square perimeter layout: same angles as the circle, projected onto a square.
 * First seat at top (−90°), then evenly clockwise. Coordinates in %.
 */
export const getSquarePositions = (
  count: number,
  halfExtentPercent = 35,
): ICirclePosition[] => {
  if (count <= 0) return []

  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / count
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    const scale = 1 / Math.max(Math.abs(c), Math.abs(s))
    const angleDeg = (angle * 180) / Math.PI

    return {
      x: 50 + halfExtentPercent * c * scale,
      y: 50 + halfExtentPercent * s * scale,
      angleDeg,
      quarter: getSeatQuarter(angleDeg),
    }
  })
}

export const getSeatPositions = (
  layoutMode: LayoutModeT,
  count: number,
): ICirclePosition[] => {
  if (layoutMode === 'square') return getSquarePositions(count)
  return getCirclePositions(count)
}
