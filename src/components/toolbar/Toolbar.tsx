import './Toolbar.css'

interface IToolbarProps {
  canAdd: boolean
  canClear: boolean
  onAdd: () => void
  onClear: () => void
}

export const Toolbar = ({
  canAdd,
  canClear,
  onAdd,
  onClear,
}: IToolbarProps) => {
  const handleClear = () => {
    if (!canClear) return
    const confirmed = window.confirm('Очистить стол? Все игроки и заметки будут удалены.')
    if (!confirmed) return
    onClear()
  }

  return (
    <header className="toolbar">
      <h1 className="toolbar__brand">BOTC HELPER</h1>
      <div className="toolbar__actions">
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
    </header>
  )
}
