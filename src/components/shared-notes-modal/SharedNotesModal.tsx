import { useEffect, useRef } from 'react'
import './SharedNotesModal.css'

interface ISharedNotesModalProps {
  notes: string
  onNotesChange: (notes: string) => void
  onClose: () => void
}

export const SharedNotesModal = ({
  notes,
  onNotesChange,
  onClose,
}: ISharedNotesModalProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div
      className="shared-notes-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <section
        className="shared-notes-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shared-notes-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shared-notes-modal__header">
          <h2 id="shared-notes-title" className="shared-notes-modal__title">
            Общие заметки
          </h2>
          <button
            type="button"
            className="shared-notes-modal__close"
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
        <div className="shared-notes-modal__body">
          <div className="field">
            <label htmlFor="shared-notes">Заметки</label>
            <textarea
              id="shared-notes"
              ref={textareaRef}
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
              placeholder="Общие факты, объявления, ночной порядок…"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
