import { useCallback, useMemo } from 'react'
import type { IPlayer, LayoutModeT } from '../../types/game'
import { getRoleImageUrl, type IScriptRole } from '../../lib/scriptRoles'
import { getSeatPositions } from '../../lib/squareLayout'
import { useCircleSeatDrag } from '../../hooks/useCircleSeatDrag'
import { PlayerSeat } from './PlayerSeat'
import './PlayerCircle.css'

interface IPlayerCircleProps {
  players: IPlayer[]
  layoutMode: LayoutModeT
  roles: IScriptRole[]
  selectedPlayerId: string | null
  onSelectPlayer: (playerId: string) => void
  onSwapPlayers: (playerIdA: string, playerIdB: string) => void
}

export const PlayerCircle = ({
  players,
  layoutMode,
  roles,
  selectedPlayerId,
  onSelectPlayer,
  onSwapPlayers,
}: IPlayerCircleProps) => {
  const positions = getSeatPositions(layoutMode, players.length)
  const isSquare = layoutMode === 'square'
  const roleById = useMemo(() => {
    const map = new Map<string, IScriptRole>()
    for (const role of roles) map.set(role.id, role)
    return map
  }, [roles])

  const getPlayerIdAtIndex = useCallback(
    (index: number) => players[index]?.id,
    [players],
  )

  const {
    stageRef,
    draggingPlayerId,
    dropTargetIndex,
    isDragging,
    onSeatPointerDown,
    onSeatPointerMove,
    onSeatPointerUp,
    onSeatPointerCancel,
  } = useCircleSeatDrag({
    playerCount: players.length,
    getPlayerIdAtIndex,
    onSwap: onSwapPlayers,
    onSelect: onSelectPlayer,
  })

  return (
    <div
      className={[
        'player-circle',
        isSquare ? 'player-circle--square' : '',
        isDragging ? 'player-circle--dragging' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        ref={stageRef}
        className="player-circle__stage"
        aria-label={isSquare ? 'Квадрат игроков' : 'Круг игроков'}
      >
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
              seatNumber={index + 1}
              roleImageUrl={getRoleImageUrl(roles, player.roleId)}
              roleName={
                player.roleId
                  ? (roleById.get(player.roleId)?.name ?? null)
                  : null
              }
              x={position.x}
              y={position.y}
              quarter={position.quarter}
              isSelected={player.id === selectedPlayerId}
              isDragging={player.id === draggingPlayerId}
              isDropTarget={
                isDragging &&
                dropTargetIndex === index &&
                player.id !== draggingPlayerId
              }
              isDimmed={isDragging && player.id !== draggingPlayerId}
              onPointerDown={(event) =>
                onSeatPointerDown(player.id, index, event)
              }
              onPointerMove={onSeatPointerMove}
              onPointerUp={onSeatPointerUp}
              onPointerCancel={onSeatPointerCancel}
            />
          )
        })}
      </div>
    </div>
  )
}
