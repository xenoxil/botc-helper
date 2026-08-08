import { useEffect, useState } from 'react'
import type { IPlayer } from '../../types/game'
import {
  getNotesPreview,
  getPlayerInitials,
  type SeatQuarterT,
} from '../../lib/circleLayout'
import './PlayerSeat.css'

interface IPlayerSeatProps {
  player: IPlayer
  x: number
  y: number
  quarter: SeatQuarterT
  isSelected: boolean
  onSelect: (playerId: string) => void
}

export const PlayerSeat = ({
  player,
  x,
  y,
  quarter,
  isSelected,
  onSelect,
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
    hasNotes ? '' : 'player-seat--empty-notes',
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
      onClick={() => onSelect(player.id)}
      aria-pressed={isSelected}
      aria-label={`${player.name || 'Без имени'}: ${notesPreview}`}
    >
      <span className="player-seat__name">{player.name || 'Без имени'}</span>
      <span className="player-seat__avatar">{getPlayerInitials(player.name)}</span>
      <span className="player-seat__notes">{notesPreview}</span>
    </button>
  )
}
