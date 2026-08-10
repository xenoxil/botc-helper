import { useRoleImageStatus } from '../../hooks/useRoleImageStatus'
import './RoleImage.css'

interface IRoleImageProps {
  src: string
  className?: string
  decoding?: 'async' | 'auto' | 'sync'
  draggable?: boolean
}

export const RoleImage = ({
  src,
  className,
  decoding = 'async',
  draggable = false,
}: IRoleImageProps) => {
  const status = useRoleImageStatus(src)
  const isReady = status === 'ready'
  const showSpinner = status === 'loading' || status === 'idle'

  return (
    <span className={['role-image', className].filter(Boolean).join(' ')}>
      {isReady ? (
        <img src={src} alt="" decoding={decoding} draggable={draggable} />
      ) : null}
      {showSpinner ? (
        <span className="role-image__spinner" aria-hidden="true" />
      ) : null}
    </span>
  )
}
