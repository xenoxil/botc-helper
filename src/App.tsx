import { useMemo, useState } from 'react'
import { EmptyState } from './components/empty-state/EmptyState'
import { PlayerCircle } from './components/player-circle/PlayerCircle'
import { PlayerSheet } from './components/player-sheet/PlayerSheet'
import { SettingsModal } from './components/settings-modal/SettingsModal'
import { ClearTableModal } from './components/clear-table-modal/ClearTableModal'
import { ScriptPickerModal } from './components/script-picker-modal/ScriptPickerModal'
import { SharedNotesModal } from './components/shared-notes-modal/SharedNotesModal'
import { Toolbar } from './components/toolbar/Toolbar'
import { useGameStore } from './hooks/useGameStore'
import { getScriptRoles } from './lib/scriptRoles'
import { MIN_CIRCLE_PLAYERS } from './types/game'

function App() {
  const {
    players,
    selectedPlayerId,
    selectedPlayer,
    layoutMode,
    setupPlayerCount,
    sharedNotes,
    selectedScriptId,
    customScripts,
    selectedScriptMeta,
    selectedScriptRaw,
    canAddPlayer,
    addPlayer,
    selectPlayer,
    updatePlayerName,
    updatePlayerNotes,
    updatePlayerRole,
    togglePlayerMarkColor,
    swapPlayers,
    setLayoutMode,
    setSetupPlayerCount,
    updateSharedNotes,
    removePlayer,
    clearTable,
    clearPlayerData,
    selectScript,
    addCustomScript,
    replaceCustomScript,
  } = useGameStore()

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSharedNotesOpen, setIsSharedNotesOpen] = useState(false)
  const [isClearOpen, setIsClearOpen] = useState(false)
  const [isScriptsOpen, setIsScriptsOpen] = useState(false)
  const [openWithNameEdit, setOpenWithNameEdit] = useState(false)
  const showTable = players.length >= MIN_CIRCLE_PLAYERS
  const scriptRoles = useMemo(
    () => getScriptRoles(selectedScriptRaw),
    [selectedScriptRaw],
  )

  const handleSelectPlayer = (playerId: string | null) => {
    setOpenWithNameEdit(false)
    selectPlayer(playerId)
  }

  const handleAddPlayer = () => {
    setOpenWithNameEdit(true)
    addPlayer()
  }

  return (
    <div className="app-shell">
      <Toolbar
        playerCount={players.length}
        setupPlayerCount={setupPlayerCount}
        sharedNotes={isSharedNotesOpen ? '' : sharedNotes}
        selectedScriptMeta={selectedScriptMeta}
        canAdd={canAddPlayer}
        canClear={players.length > 0 || sharedNotes.trim().length > 0}
        onAdd={handleAddPlayer}
        onOpenClear={() => setIsClearOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenScripts={() => setIsScriptsOpen(true)}
        onOpenSharedNotes={() => setIsSharedNotesOpen(true)}
        onSetupPlayerCountChange={setSetupPlayerCount}
      />
      <main className="app-main">
        {showTable ? (
          <PlayerCircle
            players={players}
            layoutMode={layoutMode}
            roles={scriptRoles}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={handleSelectPlayer}
            onSwapPlayers={swapPlayers}
          />
        ) : (
          <EmptyState
            players={players}
            selectedPlayerId={selectedPlayerId}
            onSelectPlayer={handleSelectPlayer}
          />
        )}
        {selectedPlayer ? (
          <PlayerSheet
            key={selectedPlayer.id}
            player={selectedPlayer}
            seatNumber={
              players.findIndex((player) => player.id === selectedPlayer.id) + 1
            }
            roles={scriptRoles}
            startInNameEdit={openWithNameEdit}
            onClose={() => handleSelectPlayer(null)}
            onNameChange={updatePlayerName}
            onNotesChange={updatePlayerNotes}
            onRoleChange={updatePlayerRole}
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
        {isSharedNotesOpen ? (
          <SharedNotesModal
            notes={sharedNotes}
            onNotesChange={updateSharedNotes}
            onClose={() => setIsSharedNotesOpen(false)}
          />
        ) : null}
        {isClearOpen ? (
          <ClearTableModal
            hasPlayers={players.length > 0}
            onClearTable={clearTable}
            onClearPlayerData={clearPlayerData}
            onClose={() => setIsClearOpen(false)}
          />
        ) : null}
        {isScriptsOpen ? (
          <ScriptPickerModal
            selectedScriptId={selectedScriptId}
            customScripts={customScripts}
            onSelectScript={selectScript}
            onAddCustomScript={addCustomScript}
            onReplaceCustomScript={replaceCustomScript}
            onClose={() => setIsScriptsOpen(false)}
          />
        ) : null}
      </main>
    </div>
  )
}

export default App
