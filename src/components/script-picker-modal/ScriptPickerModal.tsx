import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useModalInteractionGate } from '../../hooks/useModalInteractionGate'
import { BUILTIN_SCRIPTS } from '../../lib/builtinScripts'
import {
  extractScriptMeta,
  fallbackNameFromFile,
  parseScriptJson,
} from '../../lib/scriptJson'
import type { ICustomScript, ScriptIdT } from '../../types/script'
import './ScriptPickerModal.css'

interface IScriptPickerModalProps {
  selectedScriptId: ScriptIdT
  customScripts: ICustomScript[]
  onSelectScript: (scriptId: ScriptIdT) => void
  onAddCustomScript: (sourceFileName: string, raw: unknown[]) => void
  onReplaceCustomScript: (
    scriptId: string,
    sourceFileName: string,
    raw: unknown[],
  ) => void
  onRemoveCustomScript: (scriptId: string) => void
  onClose: () => void
}

const matchesQuery = (query: string, ...parts: string[]): boolean => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return parts.some((part) => part.toLowerCase().includes(normalized))
}

export const ScriptPickerModal = ({
  selectedScriptId,
  customScripts,
  onSelectScript,
  onAddCustomScript,
  onReplaceCustomScript,
  onRemoveCustomScript,
  onClose,
}: IScriptPickerModalProps) => {
  const isInteractive = useModalInteractionGate()
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const replaceTargetIdRef = useRef<string | null>(null)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBuiltins = useMemo(
    () =>
      BUILTIN_SCRIPTS.filter((script) => {
        const meta = extractScriptMeta(script.raw, script.name)
        return matchesQuery(
          searchQuery,
          script.name,
          script.author,
          meta.name,
          meta.author,
        )
      }),
    [searchQuery],
  )

  const filteredCustoms = useMemo(
    () =>
      customScripts.filter((script) =>
        matchesQuery(searchQuery, script.name, script.author),
      ),
    [customScripts, searchQuery],
  )

  const hasResults = filteredBuiltins.length > 0 || filteredCustoms.length > 0

  const applyParsedFile = (
    file: File,
    mode: 'add' | 'replace',
    replaceId: string | null,
  ) => {
    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      const parsed = parseScriptJson(text, fallbackNameFromFile(file.name))
      if (!parsed.ok) {
        setError(parsed.error)
        return
      }

      setError('')
      if (mode === 'add') {
        onAddCustomScript(file.name, parsed.raw)
        return
      }

      if (replaceId) {
        onReplaceCustomScript(replaceId, file.name, parsed.raw)
      }
    }
    reader.onerror = () => {
      setError('Не удалось прочитать файл.')
    }
    reader.readAsText(file)
  }

  const handleUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    applyParsedFile(file, 'add', null)
  }

  const handleReplaceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const replaceId = replaceTargetIdRef.current
    event.target.value = ''
    replaceTargetIdRef.current = null
    if (!file || !replaceId) return
    applyParsedFile(file, 'replace', replaceId)
  }

  const openReplacePicker = (scriptId: string) => {
    replaceTargetIdRef.current = scriptId
    replaceInputRef.current?.click()
  }

  const handleRemoveCustom = (scriptId: string, scriptName: string) => {
    const confirmed = window.confirm(
      `Удалить сценарий «${scriptName || 'без имени'}»?`,
    )
    if (!confirmed) return
    onRemoveCustomScript(scriptId)
  }

  return (
    <div
      className={[
        'script-picker-modal-backdrop',
        isInteractive ? '' : 'modal--inert',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClose}
      role="presentation"
    >
      <section
        className="script-picker-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="script-picker-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="script-picker-modal__header">
          <h2 id="script-picker-title" className="script-picker-modal__title">
            Сценарий
          </h2>
          <button
            type="button"
            className="script-picker-modal__close"
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

        <label className="script-picker-modal__search">
          <span className="script-picker-modal__search-label">Поиск</span>
          <input
            type="search"
            className="script-picker-modal__search-input"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Поиск по названию или автору"
            autoComplete="off"
          />
        </label>

        {hasResults ? (
          <ul className="script-picker-modal__list">
            {filteredBuiltins.map((script) => {
              const isSelected = selectedScriptId === script.id
              return (
                <li key={script.id}>
                  <button
                    type="button"
                    className={[
                      'script-picker-modal__item',
                      isSelected ? 'script-picker-modal__item--selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => onSelectScript(script.id)}
                    aria-pressed={isSelected}
                  >
                    <span className="script-picker-modal__item-name">
                      {script.name}
                    </span>
                    {script.author ? (
                      <span className="script-picker-modal__item-author">
                        {script.author}
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}

            {filteredCustoms.map((script) => {
              const isSelected = selectedScriptId === script.id
              return (
                <li key={script.id}>
                  <button
                    type="button"
                    className={[
                      'script-picker-modal__item',
                      isSelected ? 'script-picker-modal__item--selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => onSelectScript(script.id)}
                    aria-pressed={isSelected}
                  >
                    <span className="script-picker-modal__item-name">
                      {script.name}
                    </span>
                    {script.author ? (
                      <span className="script-picker-modal__item-author">
                        {script.author}
                      </span>
                    ) : null}
                  </button>
                  <button
                    type="button"
                    className="script-picker-modal__edit"
                    onClick={() => openReplacePicker(script.id)}
                    aria-label={`Изменить сценарий ${script.name}`}
                    title="Заменить JSON"
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
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="script-picker-modal__delete"
                    onClick={() => handleRemoveCustom(script.id, script.name)}
                    aria-label={`Удалить сценарий ${script.name}`}
                    title="Удалить"
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
                      <path d="M4 7h16" />
                      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      <path d="M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                    </svg>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="script-picker-modal__empty">Ничего не найдено</p>
        )}

        <div className="script-picker-modal__footer">
          <button
            type="button"
            className="btn-primary script-picker-modal__upload"
            onClick={() => uploadInputRef.current?.click()}
          >
            Загрузить JSON
          </button>
          {error ? (
            <p className="script-picker-modal__error" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <input
          ref={uploadInputRef}
          type="file"
          accept="application/json,.json"
          className="script-picker-modal__file"
          onChange={handleUploadChange}
        />
        <input
          ref={replaceInputRef}
          type="file"
          accept="application/json,.json"
          className="script-picker-modal__file"
          onChange={handleReplaceChange}
        />
      </section>
    </div>
  )
}
