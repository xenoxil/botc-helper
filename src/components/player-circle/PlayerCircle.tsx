import type { IPlayer } from '../../types/game'
import { getCirclePositions } from '../../lib/circleLayout'
import { PlayerSeat } from './PlayerSeat'
import './PlayerCircle.css'

interface IPlayerCircleProps {
  players: IPlayer[]
  selectedPlayerId: string | null
  onSelectPlayer: (playerId: string) => void
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
        <div className="player-circle__center" aria-hidden="true">
          <span className="player-circle__mark" />
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
