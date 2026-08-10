import { useSyncExternalStore } from 'react'
import {
  peekRoleImageStatus,
  subscribeRoleImage,
  type RoleImageStatusT,
} from '../lib/roleImageCache'

export const useRoleImageStatus = (url: string | null): RoleImageStatusT | 'idle' => {
  const subscribe = (onStoreChange: () => void) => {
    if (!url) return () => undefined
    return subscribeRoleImage(url, onStoreChange)
  }

  const getSnapshot = (): RoleImageStatusT | 'idle' => {
    if (!url) return 'idle'
    return peekRoleImageStatus(url) ?? 'loading'
  }

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
