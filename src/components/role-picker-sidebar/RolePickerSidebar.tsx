import { useMemo, useState } from 'react'
import { useModalInteractionGate } from '../../hooks/useModalInteractionGate'
import {
  CHARACTER_TEAM_LABELS,
  groupRolesByTeam,
  type IScriptRole,
} from '../../lib/scriptRoles'
import { RoleImage } from '../role-image/RoleImage'
import './RolePickerSidebar.css'

interface IRolePickerSidebarProps {
  playerId: string
  roleId: string | null
  roles: IScriptRole[]
  onRoleChange: (playerId: string, roleId: string | null) => void
  onClose: () => void
}

const NO_ROLE_LABEL = 'Нет роли'

export const RolePickerSidebar = ({
  playerId,
  roleId,
  roles,
  onRoleChange,
  onClose,
}: IRolePickerSidebarProps) => {
  const isInteractive = useModalInteractionGate(playerId)
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredRoles = useMemo(() => {
    if (!normalizedQuery) return roles
    return roles.filter((role) =>
      role.name.toLowerCase().includes(normalizedQuery),
    )
  }, [normalizedQuery, roles])

  const roleGroups = useMemo(
    () => groupRolesByTeam(filteredRoles),
    [filteredRoles],
  )

  const showNoRole =
    !normalizedQuery || NO_ROLE_LABEL.toLowerCase().includes(normalizedQuery)

  const hasResults = roleGroups.length > 0 || showNoRole

  const selectRole = (nextRoleId: string | null) => {
    onRoleChange(playerId, nextRoleId)
    onClose()
  }

  return (
    <div
      className={[
        'role-picker-sidebar-backdrop',
        isInteractive ? '' : 'modal--inert',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClose}
      role="presentation"
    >
      <aside
        className="role-picker-sidebar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-picker-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="role-picker-sidebar__header">
          <h2 id="role-picker-title" className="role-picker-sidebar__title">
            Роль
          </h2>
          <button
            type="button"
            className="role-picker-sidebar__close"
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

        <label className="role-picker-sidebar__search">
          <span className="role-picker-sidebar__search-label">
            Поиск по роли
          </span>
          <input
            type="search"
            className="role-picker-sidebar__search-input"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Поиск по названию"
            autoComplete="off"
          />
        </label>

        <div className="role-picker-sidebar__body">
          {hasResults ? (
            <>
              {roleGroups.map((group) => (
                <div key={group.team} className="role-picker-sidebar__group">
                  <p className="role-picker-sidebar__group-title">
                    {CHARACTER_TEAM_LABELS[group.team]}
                  </p>
                  <div className="role-picker-sidebar__grid">
                    {group.roles.map((role) => {
                      const isSelected = roleId === role.id
                      return (
                        <div
                          key={role.id}
                          className="role-picker-sidebar__cell"
                        >
                          <button
                            type="button"
                            className={[
                              'role-picker-sidebar__btn',
                              isSelected
                                ? 'role-picker-sidebar__btn--selected'
                                : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            onClick={() => selectRole(role.id)}
                            aria-pressed={isSelected}
                            aria-label={role.name}
                            title={role.name}
                          >
                            <RoleImage src={role.imageUrl} />
                          </button>
                          <span className="role-picker-sidebar__caption">
                            {role.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              {showNoRole ? (
                <div className="role-picker-sidebar__group">
                  <p className="role-picker-sidebar__group-title">
                    {NO_ROLE_LABEL}
                  </p>
                  <div className="role-picker-sidebar__grid">
                    <div className="role-picker-sidebar__cell">
                      <button
                        type="button"
                        className={[
                          'role-picker-sidebar__btn',
                          'role-picker-sidebar__btn--clear',
                          roleId == null
                            ? 'role-picker-sidebar__btn--selected'
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => selectRole(null)}
                        aria-pressed={roleId == null}
                        aria-label={NO_ROLE_LABEL}
                        title={NO_ROLE_LABEL}
                      />
                      <span className="role-picker-sidebar__caption">
                        {NO_ROLE_LABEL}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <p className="role-picker-sidebar__empty">Ничего не найдено</p>
          )}
        </div>
      </aside>
    </div>
  )
}
