import type { IScriptMeta } from '../types/script'

export type ParseScriptResultT =
  | { ok: true; meta: IScriptMeta; raw: unknown[] }
  | { ok: false; error: string }

const isMetaEntry = (
  entry: unknown,
): entry is { id: '_meta'; name?: unknown; author?: unknown } =>
  Boolean(
    entry &&
      typeof entry === 'object' &&
      (entry as { id?: unknown }).id === '_meta',
  )

const isScriptEntry = (entry: unknown): boolean => {
  if (typeof entry === 'string') return entry.trim().length > 0
  if (!entry || typeof entry !== 'object') return false
  const id = (entry as { id?: unknown }).id
  return typeof id === 'string' && id.trim().length > 0
}

export const extractScriptMeta = (
  raw: unknown[],
  fallbackName: string,
): IScriptMeta => {
  const metaEntry = raw.find(isMetaEntry)
  const name =
    metaEntry && typeof metaEntry.name === 'string' && metaEntry.name.trim()
      ? metaEntry.name.trim()
      : fallbackName
  const author =
    metaEntry && typeof metaEntry.author === 'string' && metaEntry.author.trim()
      ? metaEntry.author.trim()
      : ''

  return { name, author }
}

export const parseScriptJson = (
  text: string,
  fallbackName: string,
): ParseScriptResultT => {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'Невалидный JSON.' }
  }

  if (!Array.isArray(parsed)) {
    return { ok: false, error: 'Ожидался JSON-массив сценария.' }
  }

  if (parsed.length === 0) {
    return { ok: false, error: 'Файл сценария пуст.' }
  }

  if (!parsed.every(isScriptEntry)) {
    return {
      ok: false,
      error: 'Элементы сценария должны быть id или объектами с id.',
    }
  }

  return {
    ok: true,
    meta: extractScriptMeta(parsed, fallbackName),
    raw: parsed,
  }
}

export const fallbackNameFromFile = (fileName: string): string => {
  const base = fileName.replace(/\.json$/i, '').trim()
  return base || 'Сценарий'
}
