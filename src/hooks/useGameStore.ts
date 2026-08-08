import { useCallback, useEffect, useRef, useState } from 'react'
import { loadGameState, saveGameState } from '../lib/storage'
import { normalizeSetupPlayerCount } from '../lib/setupDistribution'
import {
  MAX_PLAYERS,
  type IGameState,
  type IPlayer,
  type LayoutModeT,
  type PlayerMarkColorT,
} from '../types/game'

type PersistSnapshotT = Pick<
  IGameState,
  'players' | 'layoutMode' | 'setupPlayerCount'
>

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
      setupPlayerCount: stored.setupPlayerCount,
      selectedPlayerId: null,
    }
  })

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const persistSnapshotRef = useRef<PersistSnapshotT>({
    players: state.players,
    layoutMode: state.layoutMode,
    setupPlayerCount: state.setupPlayerCount,
  })

  useEffect(() => {
    persistSnapshotRef.current = {
      players: state.players,
      layoutMode: state.layoutMode,
      setupPlayerCount: state.setupPlayerCount,
    }
  }, [state.players, state.layoutMode, state.setupPlayerCount])

  const persistState = useCallback((next: PersistSnapshotT, debounceMs = 0) => {
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
  }, [])

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

  const persistFrom = useCallback(
    (prev: IGameState, players: IPlayer[], debounceMs = 0) => {
      persistState(
        {
          players,
          layoutMode: prev.layoutMode,
          setupPlayerCount: prev.setupPlayerCount,
        },
        debounceMs,
      )
    },
    [persistState],
  )

  const addPlayer = useCallback(() => {
    setState((prev) => {
      if (prev.players.length >= MAX_PLAYERS) return prev

      const player = createPlayer(prev.players.length + 1)
      const players = [...prev.players, player]
      persistFrom(prev, players)

      return {
        ...prev,
        players,
        selectedPlayerId: player.id,
      }
    })
  }, [persistFrom])

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
        persistFrom(prev, players)
        return { ...prev, players }
      })
    },
    [persistFrom],
  )

  const updatePlayerNotes = useCallback(
    (playerId: string, notes: string) => {
      setState((prev) => {
        const players = prev.players.map((player) =>
          player.id === playerId ? { ...player, notes } : player,
        )
        persistFrom(prev, players, 200)
        return { ...prev, players }
      })
    },
    [persistFrom],
  )

  const removePlayer = useCallback(
    (playerId: string) => {
      setState((prev) => {
        const players = prev.players.filter((player) => player.id !== playerId)
        persistFrom(prev, players)
        return {
          ...prev,
          players,
          selectedPlayerId:
            prev.selectedPlayerId === playerId ? null : prev.selectedPlayerId,
        }
      })
    },
    [persistFrom],
  )

  const togglePlayerMarkColor = useCallback(
    (playerId: string, color: PlayerMarkColorT) => {
      setState((prev) => {
        const players = prev.players.map((player) => {
          if (player.id !== playerId) return player
          const markColor = player.markColor === color ? null : color
          return { ...player, markColor }
        })
        persistFrom(prev, players)
        return { ...prev, players }
      })
    },
    [persistFrom],
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
        persistFrom(prev, players)
        return { ...prev, players }
      })
    },
    [persistFrom],
  )

  const setLayoutMode = useCallback(
    (layoutMode: LayoutModeT) => {
      setState((prev) => {
        if (prev.layoutMode === layoutMode) return prev
        persistState({
          players: prev.players,
          layoutMode,
          setupPlayerCount: prev.setupPlayerCount,
        })
        return { ...prev, layoutMode }
      })
    },
    [persistState],
  )

  const setSetupPlayerCount = useCallback(
    (setupPlayerCount: number) => {
      const nextCount = normalizeSetupPlayerCount(setupPlayerCount)
      setState((prev) => {
        if (prev.setupPlayerCount === nextCount) return prev
        persistState({
          players: prev.players,
          layoutMode: prev.layoutMode,
          setupPlayerCount: nextCount,
        })
        return { ...prev, setupPlayerCount: nextCount }
      })
    },
    [persistState],
  )

  const clearTable = useCallback(() => {
    setState((prev) => {
      persistFrom(prev, [])
      return {
        ...prev,
        players: [],
        selectedPlayerId: null,
      }
    })
  }, [persistFrom])

  return {
    players: state.players,
    selectedPlayerId: state.selectedPlayerId,
    selectedPlayer,
    layoutMode: state.layoutMode,
    setupPlayerCount: state.setupPlayerCount,
    canAddPlayer: state.players.length < MAX_PLAYERS,
    addPlayer,
    selectPlayer,
    updatePlayerName,
    updatePlayerNotes,
    togglePlayerMarkColor,
    swapPlayers,
    setLayoutMode,
    setSetupPlayerCount,
    removePlayer,
    clearTable,
  }
}
