import type { IPlayer } from '../../types/game'
import './EmptyState.css'

interface IEmptyStateProps {
  players: IPlayer[]
  selectedPlayerId: string | null
  onSelectPlayer: (playerId: string) => void
}

export const EmptyState = ({
  players,
  selectedPlayerId,
  onSelectPlayer,
}: IEmptyStateProps) => {
  const isPartial = players.length > 0

  return (
    <div className="empty-state">
      <span className="empty-state__mark" aria-hidden="true" />
      <h2 className="empty-state__title">
        {isPartial ? 'Нужно ещё игроков' : 'Стол пуст'}
      </h2>
      <p className="empty-state__text">
        {isPartial
          ? `Сейчас ${players.length}. Нажмите «+» сверху, чтобы собрать круг (от 3 игроков).`
          : 'Нажмите «+» сверху, чтобы добавить игроков — они выстроятся по кругу.'}
      </p>
      {isPartial ? (
        <ul className="empty-state__list">
          {players.map((player) => (
            <li key={player.id}>
              <button
                type="button"
                className={
                  player.id === selectedPlayerId
                    ? 'empty-state__chip empty-state__chip--selected'
                    : 'empty-state__chip'
                }
                onClick={() => onSelectPlayer(player.id)}
              >
                {player.name || 'Без имени'}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
