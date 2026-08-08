import { useEffect, useRef, useState } from 'react'
import type { IPlayer, PlayerMarkColorT } from '../../types/game'
import './PlayerSheet.css'

interface IPlayerSheetProps {
  player: IPlayer
  onClose: () => void
  onNameChange: (playerId: string, name: string) => void
  onNotesChange: (playerId: string, notes: string) => void
  onToggleMarkColor: (playerId: string, color: PlayerMarkColorT) => void
  onRemove: (playerId: string) => void
}

export const PlayerSheet = ({
  player,
  onClose,
  onNameChange,
  onNotesChange,
  onToggleMarkColor,
  onRemove,
}: IPlayerSheetProps) => {
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [isEditingName, setIsEditingName] = useState(false)
  const [draftName, setDraftName] = useState(player.name)

  useEffect(() => {
    if (!isEditingName) return
    nameInputRef.current?.focus({ preventScroll: true })
    nameInputRef.current?.select()
  }, [isEditingName])

  const startEditName = () => {
    setDraftName(player.name)
    setIsEditingName(true)
  }

  const cancelEditName = () => {
    setDraftName(player.name)
    setIsEditingName(false)
  }

  const saveEditName = () => {
    onNameChange(player.id, draftName.trim() || player.name)
    setIsEditingName(false)
  }

  const handleRemove = () => {
    const confirmed = window.confirm(
      `Удалить игрока «${player.name || 'без имени'}»?`,
    )
    if (!confirmed) return
    onRemove(player.id)
  }

  return (
    <div
      className="player-sheet-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <section
        className="player-sheet"
        aria-label="Заметки игрока"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="player-sheet__header">
          <div
            className="player-sheet__marks"
            role="group"
            aria-label="Метка игрока"
          >
            <button
              type="button"
              className={[
                'player-sheet__mark-btn',
                'player-sheet__mark-btn--blue',
                player.markColor === 'blue'
                  ? 'player-sheet__mark-btn--active'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-pressed={player.markColor === 'blue'}
              onClick={() => onToggleMarkColor(player.id, 'blue')}
            >
              Синий
            </button>
            <button
              type="button"
              className={[
                'player-sheet__mark-btn',
                'player-sheet__mark-btn--red',
                player.markColor === 'red'
                  ? 'player-sheet__mark-btn--active'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-pressed={player.markColor === 'red'}
              onClick={() => onToggleMarkColor(player.id, 'red')}
            >
              Красный
            </button>
          </div>
          <div className="player-sheet__header-actions">
            <button
              type="button"
              className="player-sheet__trash"
              onClick={handleRemove}
              aria-label="Удалить игрока"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 7h16" />
                <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                <path d="M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </button>
            <button
              type="button"
              className="player-sheet__close"
              onClick={onClose}
              aria-label="Закрыть"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
        <div className="player-sheet__body">
          <div className="field">
            <span className="field__label" id="player-name-label">
              Имя
            </span>
            {isEditingName ? (
              <div className="player-sheet__name-row">
                <input
                  id="player-name"
                  ref={nameInputRef}
                  type="text"
                  className="player-sheet__name-input"
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      saveEditName()
                    }
                    if (event.key === 'Escape') {
                      event.preventDefault()
                      cancelEditName()
                    }
                  }}
                  placeholder="Имя игрока"
                  autoComplete="off"
                  enterKeyHint="done"
                  aria-labelledby="player-name-label"
                />
                <button
                  type="button"
                  className="player-sheet__icon-btn player-sheet__icon-btn--save"
                  onClick={saveEditName}
                  aria-label="Сохранить имя"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5L19 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="player-sheet__icon-btn player-sheet__icon-btn--cancel"
                  onClick={cancelEditName}
                  aria-label="Отменить редактирование имени"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="player-sheet__name-row">
                <p className="player-sheet__name-text">
                  {player.name || 'Без имени'}
                </p>
                <button
                  type="button"
                  className="player-sheet__icon-btn"
                  onClick={startEditName}
                  aria-label="Редактировать имя"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="field">
            <label htmlFor="player-notes">Заметки</label>
            <textarea
              id="player-notes"
              value={player.notes}
              onChange={(event) => onNotesChange(player.id, event.target.value)}
              placeholder="Подозрения, факты, роли…"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
