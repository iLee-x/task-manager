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
    case 'beijing': return (
      // Forbidden City / Tiananmen Gate
      <g fill="white">
        {/* Top roof tier */}
        <path d="M 38,26 Q 50,18 62,26 L 60,30 L 40,30 Z"/>
        <rect x="40" y="30" width="20" height="6" rx="1"/>
        {/* Middle roof tier */}
        <path d="M 33,42 Q 50,34 67,42 L 64,47 L 36,47 Z"/>
        <rect x="36" y="47" width="28" height="7" rx="1"/>
        {/* Gate wall */}
        <rect x="34" y="54" width="32" height="18"/>
        {/* Gate arch */}
        <path d="M 44,72 L 44,62 Q 50,57 56,62 L 56,72 Z" fill="rgba(0,0,0,0.4)"/>
        {/* Base */}
        <rect x="28" y="72" width="44" height="5" rx="1"/>
        {/* Windows */}
        <rect x="37" y="57" width="5" height="7" rx="1" fill="rgba(0,0,0,0.3)"/>
        <rect x="58" y="57" width="5" height="7" rx="1" fill="rgba(0,0,0,0.3)"/>
      </g>
    )
    case 'losangeles': return (
      // Hollywood Sign on hills
      <g fill="white">
        {/* Hills */}
        <path d="M 15,72 Q 25,55 35,60 Q 42,50 50,58 Q 58,46 68,56 Q 76,50 85,62 L 85,78 L 15,78 Z" opacity="0.6"/>
        {/* H */}
        <rect x="20" y="36" width="3" height="16"/>
        <rect x="29" y="36" width="3" height="16"/>
        <rect x="20" y="43" width="12" height="3"/>
        {/* O */}
        <rect x="35" y="36" width="3" height="16"/>
        <rect x="44" y="36" width="3" height="16"/>
        <rect x="35" y="36" width="12" height="3"/>
        <rect x="35" y="49" width="12" height="3"/>
        {/* L */}
        <rect x="51" y="36" width="3" height="16"/>
        <rect x="51" y="49" width="10" height="3"/>
        {/* Star */}
        <circle cx="75" cy="28" r="3" opacity="0.9"/>
        <circle cx="82" cy="22" r="2" opacity="0.7"/>
        <circle cx="68" cy="24" r="2" opacity="0.7"/>
      </g>
    )
    case 'singapore': return (
      // Marina Bay Sands — three towers with boat roof
      <g fill="white">
        {/* Left tower */}
        <rect x="26" y="38" width="12" height="36"/>
        {/* Center tower */}
        <rect x="44" y="32" width="12" height="42"/>
        {/* Right tower */}
        <rect x="62" y="38" width="12" height="36"/>
        {/* Sky Park boat */}
        <path d="M 22,32 Q 50,22 78,32 L 76,38 L 24,38 Z"/>
        {/* Pool shimmer */}
        <rect x="58" y="25" width="16" height="3" rx="1.5" opacity="0.6"/>
        {/* Base */}
        <rect x="22" y="74" width="56" height="4" rx="1"/>
        {/* Connectors */}
        <rect x="38" y="55" width="6" height="3"/>
        <rect x="56" y="55" width="6" height="3"/>
        {/* Lotus flower / helix */}
        <circle cx="50" cy="15" r="5" opacity="0.8"/>
        <rect x="49" y="10" width="2" height="8"/>
      </g>
    )
    case 'rome': return (
      // Colosseum
      <g fill="white">
        {/* Outer ellipse */}
        <ellipse cx="50" cy="52" rx="30" ry="22" fill="none" stroke="white" strokeWidth="3"/>
        {/* Inner ellipse */}
        <ellipse cx="50" cy="52" rx="22" ry="15" fill="none" stroke="white" strokeWidth="2"/>
        {/* Arches - top row */}
        <path d="M 24,46 L 24,58" stroke="white" strokeWidth="1.5"/>
        <path d="M 32,41 L 32,58" stroke="white" strokeWidth="1.5"/>
        <path d="M 40,39 L 40,58" stroke="white" strokeWidth="1.5"/>
        <path d="M 50,38 L 50,58" stroke="white" strokeWidth="1.5"/>
        <path d="M 60,39 L 60,58" stroke="white" strokeWidth="1.5"/>
        <path d="M 68,41 L 68,58" stroke="white" strokeWidth="1.5"/>
        <path d="M 76,46 L 76,58" stroke="white" strokeWidth="1.5"/>
        {/* Ground */}
        <rect x="20" y="73" width="60" height="3" rx="1"/>
        {/* Broken wall section */}
        <rect x="20" y="58" width="60" height="15" fill="white" opacity="0"/>
        <path d="M 20,58 L 76,58" stroke="white" strokeWidth="2"/>
        <path d="M 20,64 L 40,64 M 60,64 L 76,64" stroke="white" strokeWidth="1.5"/>
      </g>
    )
    case 'barcelona': return (
      // Sagrada Família
      <g fill="white">
        {/* Main central tower */}
        <polygon points="50,8 53,16 47,16"/>
        <rect x="47" y="16" width="6" height="38"/>
        {/* Left tower */}
        <polygon points="36,16 38,22 34,22"/>
        <rect x="34" y="22" width="4" height="28"/>
        {/* Right tower */}
        <polygon points="64,16 66,22 62,22"/>
        <rect x="62" y="22" width="4" height="28"/>
        {/* Far left tower */}
        <polygon points="26,22 28,27 24,27"/>
        <rect x="24" y="27" width="4" height="23"/>
        {/* Far right tower */}
        <polygon points="74,22 76,27 72,27"/>
        <rect x="72" y="27" width="4" height="23"/>
        {/* Facade */}
        <rect x="28" y="50" width="44" height="10"/>
        {/* Windows */}
        <ellipse cx="40" cy="55" rx="4" ry="5" fill="rgba(0,0,0,0.3)"/>
        <ellipse cx="50" cy="55" rx="4" ry="5" fill="rgba(0,0,0,0.3)"/>
        <ellipse cx="60" cy="55" rx="4" ry="5" fill="rgba(0,0,0,0.3)"/>
        {/* Base */}
        <rect x="24" y="60" width="52" height="4"/>
        <rect x="22" y="64" width="56" height="3" rx="1"/>
      </g>
    )
    case 'seoul': return (
      // N Seoul Tower
      <g fill="white">
        <rect x="49" y="10" width="2" height="8"/>
        <polygon points="47,18 53,18 54,28 46,28"/>
        <rect x="44" y="26" width="12" height="3" rx="1"/>
        <polygon points="46,29 54,29 55,40 45,40"/>
        <rect x="41" y="38" width="18" height="5" rx="2"/>
        <rect x="47" y="43" width="6" height="12"/>
        <ellipse cx="50" cy="59" rx="9" ry="6"/>
        <rect x="48" y="65" width="4" height="12"/>
        <rect x="40" y="76" width="20" height="3" rx="1"/>
        {/* City lights on hill */}
        <circle cx="32" cy="70" r="1.5" opacity="0.7"/>
        <circle cx="68" cy="70" r="1.5" opacity="0.7"/>
        <circle cx="25" cy="74" r="1" opacity="0.5"/>
        <circle cx="75" cy="74" r="1" opacity="0.5"/>
      </g>
    )
    case 'amsterdam': return (
      // Canal House with stepped gable
      <g fill="white">
        {/* Stepped gable top */}
        <polygon points="45,14 55,14 55,20 58,20 58,26 62,26 62,32 38,32 38,26 42,26 42,20 45,20"/>
        {/* Windows in gable */}
        <rect x="48" y="16" width="4" height="5" rx="1" fill="rgba(0,0,0,0.3)"/>
        {/* Main facade */}
        <rect x="36" y="32" width="28" height="42"/>
        {/* Windows row 1 */}
        <rect x="40" y="36" width="6" height="8" rx="1" fill="rgba(0,0,0,0.25)"/>
        <rect x="54" y="36" width="6" height="8" rx="1" fill="rgba(0,0,0,0.25)"/>
        {/* Windows row 2 */}
        <rect x="40" y="48" width="6" height="8" rx="1" fill="rgba(0,0,0,0.25)"/>
        <rect x="54" y="48" width="6" height="8" rx="1" fill="rgba(0,0,0,0.25)"/>
        {/* Door */}
        <rect x="46" y="62" width="8" height="12" rx="1" fill="rgba(0,0,0,0.3)"/>
        {/* Canal water */}
        <rect x="20" y="76" width="60" height="3" rx="1" opacity="0.5"/>
        <path d="M 20,79 Q 30,83 40,79 Q 50,83 60,79 Q 70,83 80,79" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4"/>
      </g>
    )
    case 'moscow': return (
      // St. Basil's Cathedral - onion domes
      <g fill="white">
        {/* Center main dome */}
        <path d="M 50,10 Q 58,18 56,28 L 44,28 Q 42,18 50,10 Z"/>
        <rect x="44" y="28" width="12" height="22"/>
        {/* Left dome */}
        <path d="M 36,18 Q 42,24 40,32 L 32,32 Q 30,24 36,18 Z"/>
        <rect x="32" y="32" width="8" height="18"/>
        {/* Right dome */}
        <path d="M 64,18 Q 70,24 68,32 L 60,32 Q 58,24 64,18 Z"/>
        <rect x="60" y="32" width="8" height="18"/>
        {/* Far left dome (small) */}
        <path d="M 26,26 Q 30,31 28,37 L 22,37 Q 20,31 26,26 Z"/>
        <rect x="22" y="37" width="6" height="13"/>
        {/* Far right dome (small) */}
        <path d="M 74,26 Q 78,31 76,37 L 70,37 Q 68,31 74,26 Z"/>
        <rect x="70" y="37" width="6" height="13"/>
        {/* Base platform */}
        <rect x="20" y="50" width="60" height="6" rx="1"/>
        <rect x="24" y="56" width="52" height="4"/>
        {/* Arch */}
        <path d="M 40,72 L 40,63 Q 50,58 60,63 L 60,72 Z" fill="rgba(0,0,0,0.3)"/>
        <rect x="20" y="72" width="60" height="5" rx="1"/>
      </g>
    )
    case 'rio': return (
      // Christ the Redeemer
      <g fill="white">
        {/* Mountain */}
        <path d="M 20,78 Q 35,58 50,52 Q 65,58 80,78 Z" opacity="0.7"/>
        {/* Body */}
        <polygon points="50,18 53,32 47,32"/>
        <rect x="47" y="32" width="6" height="22"/>
        {/* Outstretched arms */}
        <rect x="20" y="36" width="30" height="4" rx="2"/>
        <rect x="50" y="36" width="30" height="4" rx="2"/>
        {/* Head */}
        <circle cx="50" cy="15" r="5"/>
        {/* Hands */}
        <circle cx="20" cy="38" r="3"/>
        <circle cx="80" cy="38" r="3"/>
        {/* Robe detail */}
        <line x1="50" y1="32" x2="45" y2="52" stroke="white" strokeWidth="1" opacity="0.5"/>
        <line x1="50" y1="32" x2="55" y2="52" stroke="white" strokeWidth="1" opacity="0.5"/>
      </g>
    )
    case 'mumbai': return (
      // Gateway of India
      <g fill="white">
        {/* Main arch */}
        <path d="M 35,72 L 35,48 Q 35,30 50,28 Q 65,30 65,48 L 65,72 Z" fill="none" stroke="white" strokeWidth="3"/>
        {/* Fill the arch opening */}
        <path d="M 38,72 L 38,50 Q 38,35 50,33 Q 62,35 62,50 L 62,72 Z" fill="rgba(0,0,0,0.3)"/>
        {/* Towers */}
        <rect x="27" y="40" width="8" height="32"/>
        <polygon points="27,40 35,40 31,32"/>
        <rect x="65" y="40" width="8" height="32"/>
        <polygon points="65,40 73,40 69,32"/>
        {/* Decorative band */}
        <rect x="27" y="50" width="46" height="3" opacity="0.6"/>
        {/* Merlons on top */}
        <rect x="29" y="36" width="2" height="4"/>
        <rect x="33" y="36" width="2" height="4"/>
        <rect x="65" y="36" width="2" height="4"/>
        <rect x="69" y="36" width="2" height="4"/>
        {/* Base */}
        <rect x="22" y="72" width="56" height="4" rx="1"/>
        {/* Water */}
        <path d="M 15,80 Q 25,77 35,80 Q 45,77 55,80 Q 65,77 75,80 Q 82,77 90,80" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4"/>
      </g>
    )
    case 'istanbul': return (
      // Hagia Sophia
      <g fill="white">
        {/* Main dome */}
        <path d="M 30,46 Q 30,22 50,20 Q 70,22 70,46 Z"/>
        <rect x="30" y="46" width="40" height="8"/>
        {/* Half domes */}
        <path d="M 22,54 Q 22,46 30,44 Q 30,54 22,54 Z"/>
        <path d="M 78,54 Q 78,46 70,44 Q 70,54 78,54 Z"/>
        {/* Left minaret */}
        <rect x="17" y="28" width="5" height="30"/>
        <polygon points="17,28 22,28 19.5,20"/>
        {/* Right minaret */}
        <rect x="78" y="28" width="5" height="30"/>
        <polygon points="78,28 83,28 80.5,20"/>
        {/* Minaret balcony */}
        <rect x="15" y="40" width="9" height="2" rx="1"/>
        <rect x="76" y="40" width="9" height="2" rx="1"/>
        {/* Base */}
        <rect x="22" y="58" width="56" height="5"/>
        <rect x="18" y="63" width="64" height="4" rx="1"/>
        {/* Dome lantern */}
        <rect x="48" y="14" width="4" height="6"/>
        <circle cx="50" cy="12" r="2.5"/>
      </g>
    )
    case 'berlin': return (
      // Brandenburg Gate
      <g fill="white">
        {/* Quadriga (chariot on top) */}
        <ellipse cx="50" cy="18" rx="12" ry="4" opacity="0.8"/>
        <rect x="46" y="14" width="3" height="8" opacity="0.8"/>
        <rect x="51" y="14" width="3" height="8" opacity="0.8"/>
        {/* Attic */}
        <rect x="28" y="22" width="44" height="8"/>
        {/* 5 columns */}
        <rect x="30" y="30" width="5" height="36"/>
        <rect x="39" y="30" width="5" height="36"/>
        <rect x="48" y="30" width="4" height="36"/>
        <rect x="56" y="30" width="5" height="36"/>
        <rect x="65" y="30" width="5" height="36"/>
        {/* Gate openings between columns */}
        <rect x="35" y="48" width="4" height="18" fill="rgba(0,0,0,0.3)"/>
        <rect x="44" y="48" width="4" height="18" fill="rgba(0,0,0,0.3)"/>
        <rect x="53" y="48" width="3" height="18" fill="rgba(0,0,0,0.3)"/>
        <rect x="61" y="48" width="4" height="18" fill="rgba(0,0,0,0.3)"/>
        {/* Base platform */}
        <rect x="26" y="66" width="48" height="5" rx="1"/>
        <rect x="22" y="71" width="56" height="3" rx="1"/>
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
