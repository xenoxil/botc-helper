export type RoleImageStatusT = 'loading' | 'ready' | 'error'

interface IRoleImageEntry {
  image: HTMLImageElement
  status: RoleImageStatusT
}

const cache = new Map<string, IRoleImageEntry>()
const listeners = new Map<string, Set<() => void>>()

const notify = (url: string) => {
  const subs = listeners.get(url)
  if (!subs) return
  for (const listener of subs) listener()
}

const setStatus = (url: string, status: RoleImageStatusT) => {
  const entry = cache.get(url)
  if (!entry || entry.status === status) return
  entry.status = status
  notify(url)
}

const ensureCached = (url: string): IRoleImageEntry => {
  const existing = cache.get(url)
  if (existing) return existing

  const image = new Image()
  image.decoding = 'async'
  const entry: IRoleImageEntry = { image, status: 'loading' }
  cache.set(url, entry)

  image.onload = () => setStatus(url, 'ready')
  image.onerror = () => setStatus(url, 'error')
  image.src = url

  if (image.complete) {
    entry.status = image.naturalWidth > 0 ? 'ready' : 'error'
  }

  return entry
}

export const prefetchRoleImages = (urls: string[]): void => {
  for (const url of urls) {
    if (!url) continue
    ensureCached(url)
  }
}

/** Read-only; does not start a load. */
export const peekRoleImageStatus = (
  url: string,
): RoleImageStatusT | undefined => cache.get(url)?.status

export const subscribeRoleImage = (
  url: string,
  listener: () => void,
): (() => void) => {
  ensureCached(url)
  let subs = listeners.get(url)
  if (!subs) {
    subs = new Set()
    listeners.set(url, subs)
  }
  subs.add(listener)
  return () => {
    subs.delete(listener)
    if (subs.size === 0) listeners.delete(url)
  }
}
