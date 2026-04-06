import { useState } from 'react'
import type { BadgeDef } from '@/lib/badges'

interface Props {
  badge: BadgeDef
  owned?: boolean
  size?: number
}

// ── Landmark SVGs ──────────────────────────────────────────────────────────────

function Landmark({ id }: { id: string }) {
  switch (id) {
    case 'toronto': return (
      <g fill="white">
        <rect x="49" y="11" width="2" height="10"/>
        <rect x="48" y="21" width="4" height="14"/>
        <rect x="36" y="33" width="28" height="6" rx="3"/>
        <rect x="48.5" y="39" width="3" height="16"/>
        <polygon points="48.5,55 32,75 36,75 50,57"/>
        <polygon points="51.5,55 68,75 64,75 50,57"/>
        <rect x="48.5" y="55" width="3" height="20"/>
        <rect x="32" y="67" width="36" height="2"/>
      </g>
    )
    case 'newyork': return (
      <g fill="white">
        <polygon points="43,32 45,22 47,32 49,20 51,32 53,22 55,32"/>
        <ellipse cx="49" cy="38" rx="8" ry="7"/>
        <rect x="53" y="30" width="12" height="3" rx="1.5" transform="rotate(-30 59 31.5)"/>
        <rect x="66" y="18" width="3" height="12" rx="1"/>
        <ellipse cx="67.5" cy="17" rx="3.5" ry="4.5" opacity="0.9"/>
        <polygon points="42,45 38,74 60,74 56,45"/>
        <rect x="36" y="74" width="26" height="5"/>
        <rect x="34" y="79" width="30" height="2"/>
      </g>
    )
    case 'paris': return (
      <g fill="white">
        <polygon points="50,12 52,28 48,28"/>
        <polygon points="48,28 52,28 54,40 46,40"/>
        <rect x="43" y="38" width="14" height="4" rx="1"/>
        <polygon points="43,42 57,42 60,58 40,58"/>
        <rect x="38" y="56" width="24" height="4" rx="1"/>
        <path d="M 38,60 Q 34,72 32,78 L 38,78 Q 40,72 44,64 Z" />
        <path d="M 62,60 Q 66,72 68,78 L 62,78 Q 60,72 56,64 Z" />
        <rect x="32" y="73" width="36" height="2.5"/>
      </g>
    )
    case 'london': return (
      <g fill="white">
        <polygon points="50,10 53,22 47,22"/>
        <rect x="43" y="22" width="14" height="5"/>
        <rect x="44" y="27" width="4" height="6" rx="2"/>
        <rect x="52" y="27" width="4" height="6" rx="2"/>
        <rect x="42" y="33" width="16" height="20"/>
        <circle cx="50" cy="43" r="7" fill="none" stroke="white" strokeWidth="1.5"/>
        <line x1="50" y1="43" x2="50" y2="38" stroke="white" strokeWidth="1.5"/>
        <line x1="50" y1="43" x2="54" y2="43" stroke="white" strokeWidth="1.5"/>
        <rect x="44" y="53" width="12" height="22"/>
        <rect x="38" y="75" width="24" height="4"/>
      </g>
    )
    case 'sydney': return (
      <g fill="white">
        <rect x="20" y="74" width="60" height="4" rx="1"/>
        <path d="M 28,74 Q 28,50 42,38 Q 48,34 50,38 Q 44,50 44,74 Z"/>
        <path d="M 44,74 Q 44,46 54,34 Q 58,30 62,34 Q 58,46 58,74 Z"/>
        <path d="M 56,74 Q 56,56 63,46 Q 66,42 68,46 Q 66,56 66,74 Z"/>
        <rect x="20" y="78" width="60" height="1.5" opacity="0.5"/>
      </g>
    )
    case 'tokyo': return (
      <g fill="white">
        <rect x="49" y="10" width="2" height="10"/>
        <polygon points="47,20 53,20 54,34 46,34"/>
        <rect x="42" y="32" width="16" height="4" rx="1"/>
        <polygon points="44,36 56,36 58,52 42,52"/>
        <rect x="38" y="50" width="24" height="4" rx="1"/>
        <polygon points="40,54 60,54 64,72 36,72"/>
        <line x1="40" y1="63" x2="60" y2="63" stroke="white" strokeWidth="1.5"/>
        <rect x="34" y="72" width="32" height="3"/>
      </g>
    )
    case 'dubai': return (
      <g fill="white">
        <rect x="49.2" y="8" width="1.6" height="12"/>
        <polygon points="47,20 53,20 52,32 48,32"/>
        <polygon points="46,32 54,32 56,44 44,44"/>
        <rect x="44" y="42" width="12" height="3"/>
        <polygon points="44,45 56,45 59,57 41,57"/>
        <rect x="41" y="55" width="18" height="3"/>
        <polygon points="41,58 59,58 63,70 37,70"/>
        <rect x="37" y="68" width="26" height="3"/>
        <polygon points="37,71 63,71 67,78 33,78"/>
      </g>
    )
    case 'shanghai': return (
      <g fill="white">
        <rect x="49" y="9" width="2" height="12"/>
        <circle cx="50" cy="24" r="4"/>
        <rect x="48.5" y="28" width="3" height="8"/>
        <circle cx="50" cy="42" r="11"/>
        <rect x="48" y="53" width="4" height="8"/>
        <circle cx="50" cy="66" r="8"/>
        <rect x="47" y="74" width="6" height="6"/>
        <rect x="34" y="79" width="32" height="3" rx="1"/>
      </g>
    )
    default: return null
  }
}

// ── Back-face decorative design ────────────────────────────────────────────────

const STAR_POSITIONS: [number, number][] = [
  [18, 22], [82, 22], [14, 55], [86, 55], [32, 12], [68, 12],
  [22, 78], [78, 78], [50, 88], [50, 14], [28, 48], [72, 48],
  [40, 28], [60, 28], [38, 72], [62, 72],
]

function BackFace({ badge, owned }: { badge: BadgeDef; owned: boolean }) {
  const accentColor = owned ? badge.glow : '#64748b'
  return (
    <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {/* Decorative rings */}
      <circle cx="50" cy="50" r="44" fill="none" stroke={accentColor} strokeWidth="0.6" opacity="0.25"/>
      <circle cx="50" cy="50" r="36" fill="none" stroke={accentColor} strokeWidth="0.6" opacity="0.2"/>
      <circle cx="50" cy="50" r="28" fill="none" stroke={accentColor} strokeWidth="0.6" opacity="0.15"/>
      {/* Star dots */}
      {STAR_POSITIONS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.2 : 0.8} fill={accentColor} opacity={owned ? 0.7 : 0.4} />
      ))}
      {/* Country label */}
      <text
        x="50" y="44"
        textAnchor="middle"
        fill={owned ? badge.glow : '#94a3b8'}
        fontSize="9"
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
        letterSpacing="1.5"
      >
        {badge.country.toUpperCase()}
      </text>
      {/* Landmark name */}
      <text
        x="50" y="56"
        textAnchor="middle"
        fill="white"
        fontSize="6.5"
        fontFamily="system-ui, sans-serif"
        opacity={owned ? 0.8 : 0.5}
      >
        {badge.landmark}
      </text>
      {/* Price or owned indicator */}
      <text
        x="50" y="70"
        textAnchor="middle"
        fill="#fbbf24"
        fontSize="8.5"
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
        opacity={owned ? 1 : 0.6}
      >
        {owned ? '✦ OWNED ✦' : `🪙 ${badge.price}`}
      </text>
    </svg>
  )
}

// ── 3D Badge ───────────────────────────────────────────────────────────────────

export default function Badge3D({ badge, owned = true, size = 160 }: Props) {
  const [paused, setPaused] = useState(false)

  const rimGold = 'conic-gradient(from 0deg, #96700a, #ffd700, #e8b800, #ffd700, #b8860b, #ffe066, #ffd700, #96700a)'
  const rimSilver = 'conic-gradient(from 0deg, #475569, #94a3b8, #64748b, #94a3b8, #475569)'
  const rimBg = owned ? rimGold : rimSilver
  const rimPad = Math.round(size * 0.065)

  const glowStyle = owned
    ? { filter: `drop-shadow(0 0 ${size * 0.12}px ${badge.glow}99) drop-shadow(0 ${size * 0.08}px ${size * 0.12}px rgba(0,0,0,0.4))` }
    : { filter: `drop-shadow(0 ${size * 0.06}px ${size * 0.08}px rgba(0,0,0,0.3))` }

  return (
    <div
      style={{ perspective: `${size * 5}px`, width: size, height: size, ...glowStyle }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Rotating card */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          animation: owned ? 'badge-spin 8s linear infinite' : 'none',
          animationPlayState: paused ? 'paused' : 'running',
          position: 'relative',
        }}
      >
        {/* ── Front face ───────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            borderRadius: '50%',
            background: rimBg,
            padding: rimPad,
          }}
        >
          {/* Inner face */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: owned
                ? `linear-gradient(145deg, ${badge.from} 0%, ${badge.to} 60%, ${badge.from} 100%)`
                : 'linear-gradient(145deg, #475569, #334155)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Landmark SVG */}
            <svg
              viewBox="0 0 100 100"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
              <g opacity={owned ? 1 : 0.45}>
                <Landmark id={badge.id} />
              </g>
              <text
                x="50" y="93"
                textAnchor="middle"
                fill="white"
                fontSize="8"
                fontWeight="bold"
                fontFamily="system-ui, sans-serif"
                letterSpacing="0.5"
                opacity={owned ? 1 : 0.5}
              >
                {badge.name.toUpperCase()}
              </text>
            </svg>

            {/* Top specular highlight */}
            {owned && (
              <div
                style={{
                  position: 'absolute',
                  top: '4%',
                  left: '8%',
                  width: '50%',
                  height: '38%',
                  background: 'radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.28) 0%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Sweeping shine */}
            {owned && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: '45%',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.32) 50%, transparent 100%)',
                  animation: 'badge-shine 3s ease-in-out infinite',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        </div>

        {/* ── Back face ────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '50%',
            background: rimBg,
            padding: rimPad,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <BackFace badge={badge} owned={owned} />
          </div>
        </div>
      </div>
    </div>
  )
}
