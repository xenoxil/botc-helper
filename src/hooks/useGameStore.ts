import { useCallback, useEffect, useRef, useState } from 'react'
import { loadGameState, saveGameState } from '../lib/storage'
import {
  MAX_PLAYERS,
  type IGameState,
  type IPlayer,
  type LayoutModeT,
  type PlayerMarkColorT,
} from '../types/game'

const createPlayer = (index: number): IPlayer => ({
  id: crypto.randomUUID(),
  name: `Игрок ${index}`,
  notes: '',
  markColor: null,
})

export const useGameStore = () => {
  const [state, setState] = useState<IGameState>(() => {
    const stored = loadGameState()
    return {
      players: stored.players,
      layoutMode: stored.layoutMode,
      selectedPlayerId: null,
    }
  })

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const persistSnapshotRef = useRef({
    players: state.players,
    layoutMode: state.layoutMode,
  })

  useEffect(() => {
    persistSnapshotRef.current = {
      players: state.players,
      layoutMode: state.layoutMode,
    }
  }, [state.players, state.layoutMode])

  const persistState = useCallback(
    (
      next: { players: IPlayer[]; layoutMode: LayoutModeT },
      debounceMs = 0,
    ) => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }

      const write = () => {
        saveGameState(next)
      }

      if (debounceMs > 0) {
        saveTimerRef.current = setTimeout(write, debounceMs)
        return
      }

      write()
    },
    [],
  )

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        saveGameState(persistSnapshotRef.current)
      }
    }
  }, [])

  const selectedPlayer =
    state.players.find((player) => player.id === state.selectedPlayerId) ??
    null

  const addPlayer = useCallback(() => {
    setState((prev) => {
      if (prev.players.length >= MAX_PLAYERS) return prev

      const player = createPlayer(prev.players.length + 1)
      const players = [...prev.players, player]
      persistState({ players, layoutMode: prev.layoutMode })

      return {
        ...prev,
        players,
        selectedPlayerId: player.id,
      }
    })
  }, [persistState])

  const selectPlayer = useCallback((playerId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedPlayerId: playerId,
    }))
  }, [])

  const updatePlayerName = useCallback(
    (playerId: string, name: string) => {
      setState((prev) => {
        const players = prev.players.map((player) =>
          player.id === playerId ? { ...player, name } : player,
        )
        persistState({ players, layoutMode: prev.layoutMode })
        return { ...prev, players }
      })
    },
    [persistState],
  )

  const updatePlayerNotes = useCallback(
    (playerId: string, notes: string) => {
      setState((prev) => {
        const players = prev.players.map((player) =>
          player.id === playerId ? { ...player, notes } : player,
        )
        persistState({ players, layoutMode: prev.layoutMode }, 200)
        return { ...prev, players }
      })
    },
    [persistState],
  )

  const removePlayer = useCallback(
    (playerId: string) => {
      setState((prev) => {
        const players = prev.players.filter((player) => player.id !== playerId)
        persistState({ players, layoutMode: prev.layoutMode })
        return {
          ...prev,
          players,
          selectedPlayerId:
            prev.selectedPlayerId === playerId ? null : prev.selectedPlayerId,
        }
      })
    },
    [persistState],
  )

  const togglePlayerMarkColor = useCallback(
    (playerId: string, color: PlayerMarkColorT) => {
      setState((prev) => {
        const players = prev.players.map((player) => {
          if (player.id !== playerId) return player
          const markColor = player.markColor === color ? null : color
          return { ...player, markColor }
        })
        persistState({ players, layoutMode: prev.layoutMode })
        return { ...prev, players }
      })
    },
    [persistState],
  )

  const swapPlayers = useCallback(
    (playerIdA: string, playerIdB: string) => {
      if (playerIdA === playerIdB) return

      setState((prev) => {
        const indexA = prev.players.findIndex((player) => player.id === playerIdA)
        const indexB = prev.players.findIndex((player) => player.id === playerIdB)
        if (indexA < 0 || indexB < 0) return prev

        const players = [...prev.players]
        const playerA = players[indexA]
        const playerB = players[indexB]
        if (!playerA || !playerB) return prev

        players[indexA] = playerB
        players[indexB] = playerA
        persistState({ players, layoutMode: prev.layoutMode })
        return { ...prev, players }
      })
    },
    [persistState],
  )

  const setLayoutMode = useCallback(
    (layoutMode: LayoutModeT) => {
      setState((prev) => {
        if (prev.layoutMode === layoutMode) return prev
        persistState({ players: prev.players, layoutMode })
        return { ...prev, layoutMode }
      })
    },
    [persistState],
  )

  const clearTable = useCallback(() => {
    setState((prev) => {
      persistState({ players: [], layoutMode: prev.layoutMode })
      return {
        ...prev,
        players: [],
        selectedPlayerId: null,
      }
    })
  }, [persistState])

  return {
    players: state.players,
    selectedPlayerId: state.selectedPlayerId,
    selectedPlayer,
    layoutMode: state.layoutMode,
    canAddPlayer: state.players.length < MAX_PLAYERS,
    addPlayer,
    selectPlayer,
    updatePlayerName,
    updatePlayerNotes,
    togglePlayerMarkColor,
    swapPlayers,
    setLayoutMode,
    removePlayer,
    clearTable,
  }
}
