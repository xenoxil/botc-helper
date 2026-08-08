import type { IPlayer } from '../../types/game'
import { getCirclePositions } from '../../lib/circleLayout'
import { PlayerSeat } from './PlayerSeat'
import './PlayerCircle.css'

interface IPlayerCircleProps {
  players: IPlayer[]
  selectedPlayerId: string | null
  onSelectPlayer: (playerId: string) => void
}

const formatPlayerCountLabel = (count: number): string => {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return 'игрок'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'игрока'
  return 'игроков'
}

export const PlayerCircle = ({
  players,
  selectedPlayerId,
  onSelectPlayer,
}: IPlayerCircleProps) => {
  const positions = getCirclePositions(players.length)

  return (
    <div className="player-circle">
      <div className="player-circle__stage" aria-label="Круг игроков">
        <div className="player-circle__ring" aria-hidden="true" />
        <div className="player-circle__center">
          <span className="player-circle__mark" aria-hidden="true" />
          <span className="player-circle__count">{players.length}</span>
          <span className="player-circle__label">
            {formatPlayerCountLabel(players.length)}
          </span>
        </div>
        {players.map((player, index) => {
          const position = positions[index]
          if (!position) return null

          return (
            <PlayerSeat
              key={player.id}
              player={player}
              x={position.x}
              y={position.y}
              quarter={position.quarter}
              isSelected={player.id === selectedPlayerId}
              onSelect={onSelectPlayer}
            />
          )
        })}
      </div>
    </div>
  )
}
