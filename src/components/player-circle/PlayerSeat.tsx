import { useEffect, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { IPlayer } from '../../types/game'
import {
  getNotesPreview,
  type SeatQuarterT,
} from '../../lib/circleLayout'
import './PlayerSeat.css'

interface IPlayerSeatProps {
  player: IPlayer
  seatNumber: number
  x: number
  y: number
  quarter: SeatQuarterT
  isSelected: boolean
  isDragging: boolean
  isDropTarget: boolean
  isDimmed: boolean
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => void
  onPointerCancel: (event: ReactPointerEvent<HTMLButtonElement>) => void
}

export const PlayerSeat = ({
  player,
  seatNumber,
  x,
  y,
  quarter,
  isSelected,
  isDragging,
  isDropTarget,
  isDimmed,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: IPlayerSeatProps) => {
  const [isEntering, setIsEntering] = useState(true)
  const hasNotes = player.notes.trim().length > 0
  const notesPreview = getNotesPreview(player.notes)
  const className = [
    'player-seat',
    `player-seat--${quarter}`,
    isEntering ? 'player-seat--enter' : '',
    isSelected ? 'player-seat--selected' : '',
    player.markColor ? `player-seat--mark-${player.markColor}` : '',
    isDragging ? 'player-seat--dragging' : '',
    isDropTarget ? 'player-seat--drop-target' : '',
    isDimmed ? 'player-seat--dimmed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    if (!isEntering) return
    const timer = window.setTimeout(() => setIsEntering(false), 280)
    return () => window.clearTimeout(timer)
  }, [isEntering])

  return (
    <button
      type="button"
      className={className}
      style={{ left: `${x}%`, top: `${y}%` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClick={(event) => {
        // Selection is handled on pointer up to avoid conflict with drag
        event.preventDefault()
      }}
      aria-pressed={isSelected}
      aria-label={
        hasNotes
          ? `Место ${seatNumber}, ${player.name || 'Без имени'}: ${notesPreview}`
          : `Место ${seatNumber}, ${player.name || 'Без имени'}`
      }
    >
      <span className="player-seat__name">{player.name || 'Без имени'}</span>
      <span className="player-seat__avatar">
        <span className="player-seat__number" aria-hidden="true">
          {seatNumber}
        </span>
      </span>
      {hasNotes ? (
        <span className="player-seat__notes">{notesPreview}</span>
      ) : null}
    </button>
  )
}
