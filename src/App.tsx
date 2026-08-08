import { EmptyState } from './components/empty-state/EmptyState'
import { PlayerCircle } from './components/player-circle/PlayerCircle'
import { PlayerSheet } from './components/player-sheet/PlayerSheet'
import { Toolbar } from './components/toolbar/Toolbar'
import { useGameStore } from './hooks/useGameStore'
import { MIN_CIRCLE_PLAYERS } from './types/game'

function App() {
  const {
    players,
    selectedPlayerId,
    selectedPlayer,
    canAddPlayer,
    addPlayer,
    selectPlayer,
    updatePlayerName,
    updatePlayerNotes,
    removePlayer,
    clearTable,
  } = useGameStore()

  const showCircle = players.length >= MIN_CIRCLE_PLAYERS

  return (
    <div className="app-shell">
      <Toolbar
        playerCount={players.length}
        canAdd={canAddPlayer}
        canClear={players.length > 0}
        onAdd={addPlayer}
        onClear={clearTable}
      />
      <main className="app-main">
        {showCircle ? (
          <PlayerCircle
            players={players}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={selectPlayer}
          />
        ) : (
          <EmptyState
            players={players}
            selectedPlayerId={selectedPlayerId}
            onAdd={addPlayer}
            onSelectPlayer={selectPlayer}
            canAdd={canAddPlayer}
          />
        )}
        {selectedPlayer ? (
          <PlayerSheet
            player={selectedPlayer}
            onClose={() => selectPlayer(null)}
            onNameChange={updatePlayerName}
            onNotesChange={updatePlayerNotes}
            onRemove={removePlayer}
          />
        ) : null}
      </main>
    </div>
  )
}

export default App
