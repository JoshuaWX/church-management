import Image from 'next/image'

interface RCCGLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
}

const sizeMap = {
  sm: { container: 'w-8 h-8', img: 32, text: 'text-xs' },
  md: { container: 'w-12 h-12', img: 48, text: 'text-sm' },
  lg: { container: 'w-16 h-16', img: 64, text: 'text-base' },
  xl: { container: 'w-24 h-24', img: 96, text: 'text-lg' },
}

/**
 * RCCG Logo component — renders the official logo from
 * `/images/rccg-logo.png` in the public folder.
 */
export function RCCGLogo({ size = 'md', className = '', showText = false }: RCCGLogoProps) {
  const s = sizeMap[size]

  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <div className={`${s.container} relative flex-shrink-0`}>
        <Image
          src="/images/rccg-logo.png"
          alt="RCCG Logo"
          width={s.img}
          height={s.img}
          className="object-contain w-full h-full"
          priority={size === 'xl' || size === 'lg'}
        />
      </div>
      {showText && (
        <span className={`${s.text} font-bold tracking-tight text-gray-900`}>
          RCCG
        </span>
      )}
    </div>
  )
}

export default RCCGLogo
