import type { IPlayer } from '../../types/game'
import './EmptyState.css'

interface IEmptyStateProps {
  players: IPlayer[]
  selectedPlayerId: string | null
  onAdd: () => void
  onSelectPlayer: (playerId: string) => void
  canAdd: boolean
}

export const EmptyState = ({
  players,
  selectedPlayerId,
  onAdd,
  onSelectPlayer,
  canAdd,
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
          ? `Сейчас ${players.length}. Добавьте ещё, чтобы собрать круг (от 3 игроков).`
          : 'Добавьте игроков за стол — они выстроятся по кругу, как за игрой.'}
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
      <button
        type="button"
        className="btn-primary"
        onClick={onAdd}
        disabled={!canAdd}
      >
        Добавить игрока
      </button>
    </div>
  )
}
