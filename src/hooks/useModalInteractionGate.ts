import { useEffect, useState } from 'react'

const DEFAULT_DELAY_MS = 350

/**
 * Blocks modal pointer interaction briefly after open / resetKey change
 * so the opening tap cannot hit newly appeared buttons.
 */
export const useModalInteractionGate = (
  resetKey?: unknown,
  delayMs = DEFAULT_DELAY_MS,
): boolean => {
  const [gateKey, setGateKey] = useState(resetKey)
  const [isInteractive, setIsInteractive] = useState(false)

  if (gateKey !== resetKey) {
    setGateKey(resetKey)
    setIsInteractive(false)
  }

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setIsInteractive(true)
    }, delayMs)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [delayMs, resetKey])

  return isInteractive
}
