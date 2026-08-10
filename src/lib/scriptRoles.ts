import type { PlayerMarkColorT } from '../types/game'

export type CharacterTeamT = 'townsfolk' | 'outsider' | 'minion' | 'demon'

export interface IScriptRole {
  id: string
  name: string
  team: CharacterTeamT
  imageUrl: string
}

export const CHARACTER_TEAM_ORDER: readonly CharacterTeamT[] = [
  'townsfolk',
  'outsider',
  'minion',
  'demon',
] as const

export const CHARACTER_TEAM_LABELS: Record<CharacterTeamT, string> = {
  townsfolk: 'Горожане',
  outsider: 'Изгои',
  minion: 'Приспешники',
  demon: 'Демоны',
}

const isCharacterTeam = (value: unknown): value is CharacterTeamT =>
  value === 'townsfolk' ||
  value === 'outsider' ||
  value === 'minion' ||
  value === 'demon'

const getImageUrl = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (Array.isArray(value)) {
    const first = value.find(
      (entry): entry is string => typeof entry === 'string' && entry.trim().length > 0,
    )
    return first?.trim() ?? null
  }
  return null
}

export const getScriptRoles = (raw: unknown[]): IScriptRole[] => {
  const roles: IScriptRole[] = []

  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue
    const record = entry as Record<string, unknown>
    if (record.id === '_meta') continue
    if (typeof record.id !== 'string' || !record.id.trim()) continue
    if (typeof record.name !== 'string' || !record.name.trim()) continue
    if (!isCharacterTeam(record.team)) continue

    const imageUrl = getImageUrl(record.image)
    if (!imageUrl) continue

    roles.push({
      id: record.id,
      name: record.name.trim(),
      team: record.team,
      imageUrl,
    })
  }

  return roles
}

export const groupRolesByTeam = (
  roles: IScriptRole[],
): { team: CharacterTeamT; roles: IScriptRole[] }[] =>
  CHARACTER_TEAM_ORDER.map((team) => ({
    team,
    roles: roles.filter((role) => role.team === team),
  })).filter((group) => group.roles.length > 0)

export const getRoleById = (
  roles: IScriptRole[],
  roleId: string | null,
): IScriptRole | null => {
  if (!roleId) return null
  return roles.find((role) => role.id === roleId) ?? null
}

export const getRoleImageUrl = (
  roles: IScriptRole[],
  roleId: string | null,
): string | null => getRoleById(roles, roleId)?.imageUrl ?? null

export const getRoleName = (
  roles: IScriptRole[],
  roleId: string | null,
): string | null => getRoleById(roles, roleId)?.name ?? null

export const getMarkColorForTeam = (
  team: CharacterTeamT,
): PlayerMarkColorT =>
  team === 'townsfolk' || team === 'outsider' ? 'blue' : 'red'
