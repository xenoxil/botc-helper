import type { IPlayer } from '../../types/game'
import { getPlayerInitials } from '../../lib/circleLayout'
import './PlayerSeat.css'

interface IPlayerSeatProps {
  player: IPlayer
  x: number
  y: number
  isSelected: boolean
  onSelect: (playerId: string) => void
}

export const PlayerSeat = ({
  player,
  x,
  y,
  isSelected,
  onSelect,
}: IPlayerSeatProps) => {
  const hasNotes = player.notes.trim().length > 0
  const className = [
    'player-seat',
    isSelected ? 'player-seat--selected' : '',
    hasNotes ? 'player-seat--has-notes' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={className}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={() => onSelect(player.id)}
      aria-pressed={isSelected}
      aria-label={player.name}
    >
      <span className="player-seat__avatar">{getPlayerInitials(player.name)}</span>
      <span className="player-seat__name">{player.name}</span>
    </button>
  )
}
