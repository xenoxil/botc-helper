import { useModalInteractionGate } from '../../hooks/useModalInteractionGate'
import type { LayoutModeT } from '../../types/game'
import './SettingsModal.css'

interface ISettingsModalProps {
  layoutMode: LayoutModeT
  onLayoutModeChange: (mode: LayoutModeT) => void
  onClose: () => void
}

export const SettingsModal = ({
  layoutMode,
  onLayoutModeChange,
  onClose,
}: ISettingsModalProps) => {
  const isInteractive = useModalInteractionGate()

  return (
    <div
      className={['settings-modal', isInteractive ? '' : 'modal--inert']
        .filter(Boolean)
        .join(' ')}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <header className="settings-modal__header">
        <h2 id="settings-title" className="settings-modal__title">
          Настройки
        </h2>
        <button
          type="button"
          className="settings-modal__close"
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
      </header>

      <div className="settings-modal__body">
        <div className="settings-modal__field">
          <label htmlFor="layout-mode" className="settings-modal__label">
            Расположение игроков
          </label>
          <select
            id="layout-mode"
            className="settings-modal__select"
            value={layoutMode}
            onChange={(event) =>
              onLayoutModeChange(event.target.value as LayoutModeT)
            }
          >
            <option value="circle">Круг</option>
            <option value="square">Квадрат</option>
          </select>
          <p className="settings-modal__hint">
            Квадрат появится в следующем обновлении.
          </p>
        </div>
      </div>
    </div>
  )
}
