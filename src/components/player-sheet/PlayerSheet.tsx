import { useEffect, useRef } from 'react'
import type { IPlayer } from '../../types/game'
import './PlayerSheet.css'

interface IPlayerSheetProps {
  player: IPlayer
  onClose: () => void
  onNameChange: (playerId: string, name: string) => void
  onNotesChange: (playerId: string, notes: string) => void
  onRemove: (playerId: string) => void
}

export const PlayerSheet = ({
  player,
  onClose,
  onNameChange,
  onNotesChange,
  onRemove,
}: IPlayerSheetProps) => {
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameInputRef.current?.focus({ preventScroll: true })
  }, [])

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
          <h2 className="player-sheet__title">Игрок</h2>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Закрыть
          </button>
        </div>
        <div className="player-sheet__body">
          <div className="field">
            <label htmlFor="player-name">Имя</label>
            <input
              id="player-name"
              ref={nameInputRef}
              type="text"
              value={player.name}
              onChange={(event) => onNameChange(player.id, event.target.value)}
              placeholder="Имя игрока"
              autoComplete="off"
              enterKeyHint="done"
            />
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
          <button type="button" className="btn-danger" onClick={handleRemove}>
            Удалить игрока
          </button>
        </div>
      </section>
    </div>
  )
}
