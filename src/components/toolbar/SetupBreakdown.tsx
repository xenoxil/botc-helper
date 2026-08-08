import {
  getSetupDistribution,
  getTravelerCount,
} from '../../lib/setupDistribution'
import './SetupBreakdown.css'

interface ISetupBreakdownProps {
  playerCount: number
  setupPlayerCount: number
}

export const SetupBreakdown = ({
  playerCount,
  setupPlayerCount,
}: ISetupBreakdownProps) => {
  const distribution = getSetupDistribution(setupPlayerCount)
  const travelers = getTravelerCount(playerCount, setupPlayerCount)

  const ariaLabel = [
    `Горожане ${distribution.townsfolk}`,
    `изгои ${distribution.outsiders}`,
    `приспешники ${distribution.minions}`,
    `демоны ${distribution.demons}`,
    travelers > 0 ? `странники ${travelers}` : null,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <span className="setup-breakdown" aria-label={ariaLabel}>
      <span className="setup-breakdown__good">{distribution.townsfolk}</span>
      <span className="setup-breakdown__sep">/</span>
      <span className="setup-breakdown__good">{distribution.outsiders}</span>
      <span className="setup-breakdown__sep">/</span>
      <span className="setup-breakdown__evil">{distribution.minions}</span>
      <span className="setup-breakdown__sep">/</span>
      <span className="setup-breakdown__evil">{distribution.demons}</span>
      {travelers > 0 ? (
        <>
          <span className="setup-breakdown__sep">/</span>
          <span className="setup-breakdown__traveler">{travelers}</span>
        </>
      ) : null}
    </span>
  )
}
