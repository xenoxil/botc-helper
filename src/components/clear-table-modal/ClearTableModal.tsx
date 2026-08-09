import { useState } from 'react'
import { useModalInteractionGate } from '../../hooks/useModalInteractionGate'
import './ClearTableModal.css'

type ClearActionT = 'table' | 'playerData'

interface IClearTableModalProps {
  hasPlayers: boolean
  onClearTable: () => void
  onClearPlayerData: () => void
  onClose: () => void
}

const CONFIRM_COPY: Record<ClearActionT, string> = {
  table: 'Удалить всех игроков и общие заметки? Это нельзя отменить.',
  playerData: 'Очистить заметки и метки игроков? Имена останутся.',
}

export const ClearTableModal = ({
  hasPlayers,
  onClearTable,
  onClearPlayerData,
  onClose,
}: IClearTableModalProps) => {
  const [pendingAction, setPendingAction] = useState<ClearActionT | null>(null)
  const isInteractive = useModalInteractionGate(pendingAction)

  const handleConfirm = () => {
    if (pendingAction === 'table') {
      onClearTable()
    } else if (pendingAction === 'playerData') {
      onClearPlayerData()
    }
    onClose()
  }

  return (
    <div
      className={[
        'clear-table-modal-backdrop',
        isInteractive ? '' : 'modal--inert',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClose}
      role="presentation"
    >
      <section
        className="clear-table-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-table-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="clear-table-modal__header">
          <h2 id="clear-table-title" className="clear-table-modal__title">
            Очистка
          </h2>
          <button
            type="button"
            className="clear-table-modal__close"
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

        {pendingAction === null ? (
          <div className="clear-table-modal__options">
            <button
              type="button"
              className="clear-table-modal__option"
              onClick={() => setPendingAction('table')}
            >
              Полная очистка стола
            </button>
            <button
              type="button"
              className="clear-table-modal__option"
              onClick={() => setPendingAction('playerData')}
              disabled={!hasPlayers}
            >
              Очистить данные игроков
            </button>
          </div>
        ) : (
          <div className="clear-table-modal__confirm">
            <p className="clear-table-modal__message">
              {CONFIRM_COPY[pendingAction]}
            </p>
            <div className="clear-table-modal__actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setPendingAction(null)}
              >
                Отмена
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleConfirm}
              >
                Подтвердить
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
