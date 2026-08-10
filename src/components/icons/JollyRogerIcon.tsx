interface IJollyRogerIconProps {
  size?: number
}

/** Classic pirate skull and crossbones (Jolly Roger). */
export const JollyRogerIcon = ({ size = 18 }: IJollyRogerIconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    fill="currentColor"
  >
    {/* Full X crossbones under the skull */}
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
    >
      <line x1="4.5" y1="20.5" x2="19.5" y2="13.5" />
      <line x1="4.5" y1="13.5" x2="19.5" y2="20.5" />
    </g>
    <circle cx="4.5" cy="20.5" r="1.55" />
    <circle cx="19.5" cy="13.5" r="1.55" />
    <circle cx="4.5" cy="13.5" r="1.55" />
    <circle cx="19.5" cy="20.5" r="1.55" />

    {/* Skull */}
    <path
      fillRule="evenodd"
      d="M12 1.5c-3.9 0-7 2.7-7 6.1 0 2.2 1.15 4.05 2.95 5.15L6.5 15.5h2.7l.55-1.1h4.5l.55 1.1H17l-1.45-2.75C17.35 11.65 18.5 9.8 18.5 7.6c0-3.4-3.1-6.1-6.5-6.1ZM9.45 6.55a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3Zm5.1 0a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3ZM12 10.2c-.6 0-1.1.5-1.35 1.1h2.7c-.25-.6-.75-1.1-1.35-1.1Z"
    />
  </svg>
)
