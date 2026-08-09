import { formatPlayerCountLabel } from '../../lib/formatPlayers'
import { SETUP_PLAYER_OPTIONS } from '../../lib/setupDistribution'
import { SetupBreakdown } from './SetupBreakdown'
import './Toolbar.css'

interface IToolbarProps {
  playerCount: number
  setupPlayerCount: number
  sharedNotes: string
  canAdd: boolean
  canClear: boolean
  onAdd: () => void
  onOpenClear: () => void
  onOpenSettings: () => void
  onOpenSharedNotes: () => void
  onSetupPlayerCountChange: (count: number) => void
}

export const Toolbar = ({
  playerCount,
  setupPlayerCount,
  sharedNotes,
  canAdd,
  canClear,
  onAdd,
  onOpenClear,
  onOpenSettings,
  onOpenSharedNotes,
  onSetupPlayerCountChange,
}: IToolbarProps) => {
  const notesPreview = sharedNotes.trim()

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
            className="toolbar__icon-btn"
            onClick={onOpenClear}
            disabled={!canClear}
            aria-label="Очистить стол"
            title="Очистить стол"
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
              <path d="m13 11 9-9" />
              <path d="M14.6 12.6c.8.8.9 2.1.2 3L10 22l-8-8 6.4-4.8c.9-.7 2.2-.6 3 .2Z" />
              <path d="m6.8 15.3 6.4-4.8" />
            </svg>
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
      <div className="toolbar__meta">
        <p className="toolbar__count" aria-live="polite">
          <span className="toolbar__count-num">{playerCount}</span>
          {` ${formatPlayerCountLabel(playerCount)}`}
        </p>
        <label className="toolbar__setup">
          <span className="toolbar__setup-label">Раскладка</span>
          <select
            className="toolbar__setup-select"
            value={setupPlayerCount}
            onChange={(event) =>
              onSetupPlayerCountChange(Number(event.target.value))
            }
            aria-label="Раскладка на количество игроков"
          >
            {SETUP_PLAYER_OPTIONS.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </label>
        <SetupBreakdown
          playerCount={playerCount}
          setupPlayerCount={setupPlayerCount}
        />
      </div>
      <div className="toolbar__shared-notes">
        <button
          type="button"
          className="toolbar__shared-notes-btn"
          onClick={onOpenSharedNotes}
        >
          Общие заметки
        </button>
        {notesPreview ? (
          <button
            type="button"
            className="toolbar__shared-notes-preview"
            onClick={onOpenSharedNotes}
          >
            {notesPreview}
          </button>
        ) : null}
      </div>
    </header>
  )
}
