import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { getNearestSeatIndex } from '../lib/circleLayout'

const LONG_PRESS_MS = 300
const DRAG_START_PX = 12

interface ICircleSeatDragState {
  draggingPlayerId: string | null
  dropTargetIndex: number | null
}

interface IUseCircleSeatDragParams {
  playerCount: number
  getPlayerIdAtIndex: (index: number) => string | undefined
  onSwap: (playerIdA: string, playerIdB: string) => void
  onSelect: (playerId: string) => void
}

export const useCircleSeatDrag = ({
  playerCount,
  getPlayerIdAtIndex,
  onSwap,
  onSelect,
}: IUseCircleSeatDragParams) => {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pointerIdRef = useRef<number | null>(null)
  const targetElRef = useRef<HTMLElement | null>(null)
  const originRef = useRef<{ x: number; y: number } | null>(null)
  const fromPlayerIdRef = useRef<string | null>(null)
  const fromIndexRef = useRef<number | null>(null)
  const didDragRef = useRef(false)
  const dropTargetIndexRef = useRef<number | null>(null)

  const [dragState, setDragState] = useState<ICircleSeatDragState>({
    draggingPlayerId: null,
    dropTargetIndex: null,
  })

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }, [])

  const resetDrag = useCallback(() => {
    clearHoldTimer()
    pointerIdRef.current = null
    targetElRef.current = null
    originRef.current = null
    fromPlayerIdRef.current = null
    fromIndexRef.current = null
    dropTargetIndexRef.current = null
    didDragRef.current = false
    setDragState({ draggingPlayerId: null, dropTargetIndex: null })
  }, [clearHoldTimer])

  useEffect(() => {
    return () => clearHoldTimer()
  }, [clearHoldTimer])

  const updateDropTarget = useCallback(
    (clientX: number, clientY: number) => {
      const stage = stageRef.current
      if (!stage || playerCount <= 0) return

      const rect = stage.getBoundingClientRect()
      const localX = clientX - rect.left
      const localY = clientY - rect.top
      const nearest = getNearestSeatIndex(
        localX,
        localY,
        rect.width,
        rect.height,
        playerCount,
      )
      dropTargetIndexRef.current = nearest
      setDragState((prev) =>
        prev.dropTargetIndex === nearest
          ? prev
          : { ...prev, dropTargetIndex: nearest },
      )
    },
    [playerCount],
  )

  const startDrag = useCallback((playerId: string, index: number) => {
    if (didDragRef.current) return

    didDragRef.current = true
    fromPlayerIdRef.current = playerId
    fromIndexRef.current = index
    dropTargetIndexRef.current = index
    setDragState({
      draggingPlayerId: playerId,
      dropTargetIndex: index,
    })

    const el = targetElRef.current
    const pointerId = pointerIdRef.current
    if (el && pointerId != null) {
      try {
        el.setPointerCapture(pointerId)
      } catch {
        // ignore capture failures
      }
    }
  }, [])

  const onSeatPointerDown = useCallback(
    (playerId: string, index: number, event: ReactPointerEvent) => {
      if (event.button !== 0) return

      clearHoldTimer()
      pointerIdRef.current = event.pointerId
      targetElRef.current = event.currentTarget as HTMLElement
      originRef.current = { x: event.clientX, y: event.clientY }
      fromPlayerIdRef.current = playerId
      fromIndexRef.current = index
      didDragRef.current = false

      holdTimerRef.current = setTimeout(() => {
        holdTimerRef.current = null
        if (pointerIdRef.current !== event.pointerId) return
        startDrag(playerId, index)
      }, LONG_PRESS_MS)
    },
    [clearHoldTimer, startDrag],
  )

  const onSeatPointerMove = useCallback(
    (event: ReactPointerEvent) => {
      if (pointerIdRef.current !== event.pointerId) return

      if (!didDragRef.current) {
        const origin = originRef.current
        const playerId = fromPlayerIdRef.current
        const index = fromIndexRef.current
        if (!origin || playerId == null || index == null) return

        const dx = event.clientX - origin.x
        const dy = event.clientY - origin.y
        if (Math.hypot(dx, dy) > DRAG_START_PX) {
          clearHoldTimer()
          startDrag(playerId, index)
          updateDropTarget(event.clientX, event.clientY)
        }
        return
      }

      updateDropTarget(event.clientX, event.clientY)
    },
    [clearHoldTimer, startDrag, updateDropTarget],
  )

  const onSeatPointerUp = useCallback(
    (event: ReactPointerEvent) => {
      if (pointerIdRef.current !== event.pointerId) return

      const wasDragging = didDragRef.current
      const fromPlayerId = fromPlayerIdRef.current
      const targetIndex = dropTargetIndexRef.current

      clearHoldTimer()

      if (wasDragging && fromPlayerId != null && targetIndex != null) {
        const targetPlayerId = getPlayerIdAtIndex(targetIndex)
        if (targetPlayerId && targetPlayerId !== fromPlayerId) {
          onSwap(fromPlayerId, targetPlayerId)
        }
      } else if (!wasDragging && fromPlayerId != null) {
        onSelect(fromPlayerId)
      }

      const el = targetElRef.current
      if (el?.hasPointerCapture(event.pointerId)) {
        try {
          el.releasePointerCapture(event.pointerId)
        } catch {
          // ignore
        }
      }

      resetDrag()
    },
    [clearHoldTimer, getPlayerIdAtIndex, onSelect, onSwap, resetDrag],
  )

  const onSeatPointerCancel = useCallback(
    (event: ReactPointerEvent) => {
      if (pointerIdRef.current !== event.pointerId) return
      resetDrag()
    },
    [resetDrag],
  )

  return {
    stageRef,
    draggingPlayerId: dragState.draggingPlayerId,
    dropTargetIndex: dragState.dropTargetIndex,
    isDragging: dragState.draggingPlayerId != null,
    onSeatPointerDown,
    onSeatPointerMove,
    onSeatPointerUp,
    onSeatPointerCancel,
  }
}
