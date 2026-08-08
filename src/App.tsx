import { useState } from 'react'
import { EmptyState } from './components/empty-state/EmptyState'
import { PlayerCircle } from './components/player-circle/PlayerCircle'
import { PlayerSheet } from './components/player-sheet/PlayerSheet'
import { SettingsModal } from './components/settings-modal/SettingsModal'
import { Toolbar } from './components/toolbar/Toolbar'
import { useGameStore } from './hooks/useGameStore'
import { MIN_CIRCLE_PLAYERS } from './types/game'

function App() {
  const {
    players,
    selectedPlayerId,
    selectedPlayer,
    layoutMode,
    canAddPlayer,
    addPlayer,
    selectPlayer,
    updatePlayerName,
    updatePlayerNotes,
    togglePlayerMarkColor,
    swapPlayers,
    setLayoutMode,
    removePlayer,
    clearTable,
  } = useGameStore()

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const showTable = players.length >= MIN_CIRCLE_PLAYERS
  // Square layout is persisted but not rendered yet — always use the circle.
  const showCircleLayout =
    showTable && (layoutMode === 'circle' || layoutMode === 'square')

  return (
    <div className="app-shell">
      <Toolbar
        playerCount={players.length}
        canAdd={canAddPlayer}
        canClear={players.length > 0}
        onAdd={addPlayer}
        onClear={clearTable}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <main className="app-main">
        {showCircleLayout ? (
          <PlayerCircle
            players={players}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={selectPlayer}
            onSwapPlayers={swapPlayers}
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
            onToggleMarkColor={togglePlayerMarkColor}
            onRemove={removePlayer}
          />
        ) : null}
        {isSettingsOpen ? (
          <SettingsModal
            layoutMode={layoutMode}
            onLayoutModeChange={setLayoutMode}
            onClose={() => setIsSettingsOpen(false)}
          />
        ) : null}
      </main>
    </div>
  )
}

export default App
