import { formatPlayerCountLabel } from '../../lib/formatPlayers'
import './Toolbar.css'

interface IToolbarProps {
  playerCount: number
  canAdd: boolean
  canClear: boolean
  onAdd: () => void
  onClear: () => void
  onOpenSettings: () => void
}

export const Toolbar = ({
  playerCount,
  canAdd,
  canClear,
  onAdd,
  onClear,
  onOpenSettings,
}: IToolbarProps) => {
  const handleClear = () => {
    if (!canClear) return
    const confirmed = window.confirm(
      'Очистить стол? Все игроки и заметки будут удалены.',
    )
    if (!confirmed) return
    onClear()
  }

  return (
    <header className="toolbar">
      <div className="toolbar__row">
        <h1 className="toolbar__brand">BOTC HELPER</h1>
        <div className="toolbar__actions">
          <button
            type="button"
            className="toolbar__icon-btn"
            onClick={onOpenSettings}
            aria-label="Настройки"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
            </svg>
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={handleClear}
            disabled={!canClear}
            aria-label="Очистить стол"
          >
            Очистить
          </button>
          <button
            type="button"
            className="toolbar__add"
            onClick={onAdd}
            disabled={!canAdd}
            aria-label="Добавить игрока"
          >
            +
          </button>
        </div>
      </div>
      <p className="toolbar__count" aria-live="polite">
        <span className="toolbar__count-num">{playerCount}</span>
        {` ${formatPlayerCountLabel(playerCount)}`}
      </p>
    </header>
  )
}
