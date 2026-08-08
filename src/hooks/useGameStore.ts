import { useCallback, useEffect, useRef, useState } from 'react'
import { loadGameState, saveGameState } from '../lib/storage'
import {
  MAX_PLAYERS,
  type IGameState,
  type IPlayer,
} from '../types/game'

const createPlayer = (index: number): IPlayer => ({
  id: crypto.randomUUID(),
  name: `Игрок ${index}`,
  notes: '',
})

export const useGameStore = () => {
  const [state, setState] = useState<IGameState>(() => {
    const stored = loadGameState()
    return {
      players: stored.players,
      selectedPlayerId: null,
    }
  })

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const playersRef = useRef(state.players)

  useEffect(() => {
    playersRef.current = state.players
  }, [state.players])

  const persistPlayers = useCallback((players: IPlayer[], debounceMs = 0) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }

    const write = () => {
      saveGameState({ players })
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
        saveGameState({ players: playersRef.current })
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
      persistPlayers(players)

      return {
        players,
        selectedPlayerId: player.id,
      }
    })
  }, [persistPlayers])

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
        persistPlayers(players)
        return { ...prev, players }
      })
    },
    [persistPlayers],
  )

  const updatePlayerNotes = useCallback(
    (playerId: string, notes: string) => {
      setState((prev) => {
        const players = prev.players.map((player) =>
          player.id === playerId ? { ...player, notes } : player,
        )
        persistPlayers(players, 200)
        return { ...prev, players }
      })
    },
    [persistPlayers],
  )

  const removePlayer = useCallback(
    (playerId: string) => {
      setState((prev) => {
        const players = prev.players.filter((player) => player.id !== playerId)
        persistPlayers(players)
        return {
          players,
          selectedPlayerId:
            prev.selectedPlayerId === playerId ? null : prev.selectedPlayerId,
        }
      })
    },
    [persistPlayers],
  )

  const clearTable = useCallback(() => {
    setState({
      players: [],
      selectedPlayerId: null,
    })
    persistPlayers([])
  }, [persistPlayers])

  return {
    players: state.players,
    selectedPlayerId: state.selectedPlayerId,
    selectedPlayer,
    canAddPlayer: state.players.length < MAX_PLAYERS,
    addPlayer,
    selectPlayer,
    updatePlayerName,
    updatePlayerNotes,
    removePlayer,
    clearTable,
  }
}
