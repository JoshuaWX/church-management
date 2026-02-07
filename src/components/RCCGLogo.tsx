'use client'

import Image from 'next/image'
import { useState } from 'react'

interface RCCGLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'light' | 'dark'
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
 * RCCG Logo component.
 *
 * Tries to load `/images/rccg-logo.png` from the public folder.
 * Falls back to an inline SVG emblem (dove + Bible motif) when the
 * image file isn't present. Drop the official RCCG logo into
 * `public/images/rccg-logo.png` and it will be used automatically.
 */
export function RCCGLogo({ size = 'md', variant = 'dark', className = '', showText = false }: RCCGLogoProps) {
  const [imgError, setImgError] = useState(false)
  const s = sizeMap[size]
  const isDark = variant === 'dark'

  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <div className={`${s.container} relative flex-shrink-0`}>
        {!imgError ? (
          <Image
            src="/images/rccg-logo.png"
            alt="RCCG Logo"
            width={s.img}
            height={s.img}
            className="object-contain w-full h-full"
            onError={() => setImgError(true)}
            priority={size === 'xl' || size === 'lg'}
          />
        ) : (
          <RCCGEmblemSVG isDark={isDark} />
        )}
      </div>
      {showText && (
        <span className={`${s.text} font-bold tracking-tight ${isDark ? 'text-gray-900' : 'text-white'}`}>
          RCCG
        </span>
      )}
    </div>
  )
}

/**
 * Inline SVG fallback — a stylized dove descending over an open Bible,
 * the core visual identity of the Redeemed Christian Church of God.
 */
function RCCGEmblemSVG({ isDark }: { isDark: boolean }) {
  const primary = isDark ? '#1e3a8a' : '#ffffff'
  const accent = isDark ? '#d4810f' : '#fbbf24'

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-label="RCCG emblem"
    >
      {/* Outer circle */}
      <circle cx="32" cy="32" r="30" stroke={primary} strokeWidth="2" opacity="0.15" />

      {/* Open Bible base */}
      <path
        d="M16 42 L32 38 L48 42 L48 48 C48 48 40 46 32 46 C24 46 16 48 16 48 Z"
        fill={primary}
        opacity="0.9"
      />
      {/* Bible spine */}
      <line x1="32" y1="38" x2="32" y2="46" stroke={isDark ? '#ffffff' : '#1e3a8a'} strokeWidth="1" opacity="0.5" />
      {/* Bible pages - left */}
      <path
        d="M17 42.5 C17 42.5 23 41 31 41.5 L31 45.5 C23 45 17 46.5 17 46.5 Z"
        fill={isDark ? '#ffffff' : '#1e3a8a'}
        opacity="0.15"
      />

      {/* Dove body */}
      <ellipse cx="32" cy="24" rx="6" ry="4.5" fill={primary} opacity="0.85" />

      {/* Dove head */}
      <circle cx="38" cy="21" r="3" fill={primary} opacity="0.85" />

      {/* Dove beak */}
      <path d="M41 21 L43.5 20.5 L41 22 Z" fill={accent} />

      {/* Left wing */}
      <path
        d="M26 24 C20 18 15 17 12 18 C16 20 20 23 26 24 Z"
        fill={primary}
        opacity="0.7"
      />
      <path
        d="M27 22 C22 15 17 13 13 13 C18 16 21 20 27 22 Z"
        fill={primary}
        opacity="0.5"
      />

      {/* Right wing */}
      <path
        d="M38 24 C44 18 49 17 52 18 C48 20 44 23 38 24 Z"
        fill={primary}
        opacity="0.7"
      />
      <path
        d="M37 22 C42 15 47 13 51 13 C46 16 43 20 37 22 Z"
        fill={primary}
        opacity="0.5"
      />

      {/* Dove eye */}
      <circle cx="39" cy="20.5" r="0.8" fill={isDark ? '#ffffff' : '#1e3a8a'} />

      {/* Cross above */}
      <rect x="31" y="8" width="2" height="10" rx="1" fill={accent} opacity="0.8" />
      <rect x="28" y="11" width="8" height="2" rx="1" fill={accent} opacity="0.8" />
    </svg>
  )
}

export default RCCGLogo
