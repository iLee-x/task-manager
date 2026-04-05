import type { BadgeDef } from '@/lib/badges'

interface Props {
  badge: BadgeDef
  owned?: boolean
  size?: number
}

function Landmark({ id }: { id: string }) {
  switch (id) {
    case 'toronto': return (
      <g fill="white">
        {/* Antenna */}
        <rect x="49" y="11" width="2" height="10"/>
        {/* Upper shaft */}
        <rect x="48" y="21" width="4" height="14"/>
        {/* Pod */}
        <rect x="36" y="33" width="28" height="6" rx="3"/>
        {/* Lower shaft */}
        <rect x="48.5" y="39" width="3" height="16"/>
        {/* Left leg */}
        <polygon points="48.5,55 32,75 36,75 50,57"/>
        {/* Right leg */}
        <polygon points="51.5,55 68,75 64,75 50,57"/>
        {/* Center leg */}
        <rect x="48.5" y="55" width="3" height="20"/>
        {/* Crossbar */}
        <rect x="32" y="67" width="36" height="2"/>
      </g>
    )
    case 'newyork': return (
      <g fill="white">
        {/* Crown spikes */}
        <polygon points="43,32 45,22 47,32 49,20 51,32 53,22 55,32"/>
        {/* Head */}
        <ellipse cx="49" cy="38" rx="8" ry="7"/>
        {/* Torch arm (right) */}
        <rect x="53" y="30" width="12" height="3" rx="1.5" transform="rotate(-30 59 31.5)"/>
        {/* Torch */}
        <rect x="66" y="18" width="3" height="12" rx="1"/>
        <ellipse cx="67.5" cy="17" rx="3.5" ry="4.5" opacity="0.9"/>
        {/* Robe body */}
        <polygon points="42,45 38,74 60,74 56,45"/>
        {/* Pedestal */}
        <rect x="36" y="74" width="26" height="5"/>
        <rect x="34" y="79" width="30" height="2"/>
      </g>
    )
    case 'paris': return (
      <g fill="white">
        {/* Tip */}
        <polygon points="50,12 52,28 48,28"/>
        {/* Upper tower */}
        <polygon points="48,28 52,28 54,40 46,40"/>
        {/* First floor */}
        <rect x="43" y="38" width="14" height="4" rx="1"/>
        {/* Mid section */}
        <polygon points="43,42 57,42 60,58 40,58"/>
        {/* Second floor */}
        <rect x="38" y="56" width="24" height="4" rx="1"/>
        {/* Arch legs */}
        <path d="M 38,60 Q 34,72 32,78 L 38,78 Q 40,72 44,64 Z" />
        <path d="M 62,60 Q 66,72 68,78 L 62,78 Q 60,72 56,64 Z" />
        {/* Bottom cross */}
        <rect x="32" y="73" width="36" height="2.5"/>
      </g>
    )
    case 'london': return (
      <g fill="white">
        {/* Gothic spire top */}
        <polygon points="50,10 53,22 47,22"/>
        {/* Top floor */}
        <rect x="43" y="22" width="14" height="5"/>
        {/* Belfry windows */}
        <rect x="44" y="27" width="4" height="6" rx="2"/>
        <rect x="52" y="27" width="4" height="6" rx="2"/>
        {/* Tower body */}
        <rect x="42" y="33" width="16" height="20"/>
        {/* Clock face */}
        <circle cx="50" cy="43" r="7" fill="none" stroke="white" strokeWidth="1.5"/>
        <line x1="50" y1="43" x2="50" y2="38" stroke="white" strokeWidth="1.5"/>
        <line x1="50" y1="43" x2="54" y2="43" stroke="white" strokeWidth="1.5"/>
        {/* Lower tower */}
        <rect x="44" y="53" width="12" height="22"/>
        {/* Base */}
        <rect x="38" y="75" width="24" height="4"/>
      </g>
    )
    case 'sydney': return (
      <g fill="white">
        {/* Platform base */}
        <rect x="20" y="74" width="60" height="4" rx="1"/>
        {/* Large left shell */}
        <path d="M 28,74 Q 28,50 42,38 Q 48,34 50,38 Q 44,50 44,74 Z"/>
        {/* Large right shell */}
        <path d="M 44,74 Q 44,46 54,34 Q 58,30 62,34 Q 58,46 58,74 Z"/>
        {/* Small right shell */}
        <path d="M 56,74 Q 56,56 63,46 Q 66,42 68,46 Q 66,56 66,74 Z"/>
        {/* Reflection line */}
        <rect x="20" y="78" width="60" height="1.5" opacity="0.5"/>
      </g>
    )
    case 'tokyo': return (
      <g fill="white">
        {/* Antenna */}
        <rect x="49" y="10" width="2" height="10"/>
        {/* Upper shaft */}
        <polygon points="47,20 53,20 54,34 46,34"/>
        {/* Upper observation deck */}
        <rect x="42" y="32" width="16" height="4" rx="1"/>
        {/* Mid section */}
        <polygon points="44,36 56,36 58,52 42,52"/>
        {/* Lower observation deck */}
        <rect x="38" y="50" width="24" height="4" rx="1"/>
        {/* Lower section */}
        <polygon points="40,54 60,54 64,72 36,72"/>
        {/* Cross struts */}
        <line x1="40" y1="63" x2="60" y2="63" stroke="white" strokeWidth="1.5"/>
        <line x1="40" y1="58" x2="60" y2="58" stroke="white" strokeWidth="1" opacity="0.6"/>
        {/* Base */}
        <rect x="34" y="72" width="32" height="3"/>
      </g>
    )
    case 'dubai': return (
      <g fill="white">
        {/* Antenna spike */}
        <rect x="49.2" y="8" width="1.6" height="12"/>
        {/* Shaft top */}
        <polygon points="47,20 53,20 52,32 48,32"/>
        {/* Tier 1 */}
        <polygon points="46,32 54,32 56,44 44,44"/>
        {/* Tier 1 setback */}
        <rect x="44" y="42" width="12" height="3"/>
        {/* Tier 2 */}
        <polygon points="44,45 56,45 59,57 41,57"/>
        {/* Tier 2 setback */}
        <rect x="41" y="55" width="18" height="3"/>
        {/* Tier 3 */}
        <polygon points="41,58 59,58 63,70 37,70"/>
        {/* Tier 3 setback */}
        <rect x="37" y="68" width="26" height="3"/>
        {/* Base */}
        <polygon points="37,71 63,71 67,78 33,78"/>
      </g>
    )
    case 'shanghai': return (
      <g fill="white">
        {/* Antenna */}
        <rect x="49" y="9" width="2" height="12"/>
        {/* Small top sphere */}
        <circle cx="50" cy="24" r="4"/>
        {/* Upper shaft */}
        <rect x="48.5" y="28" width="3" height="8"/>
        {/* Large upper sphere */}
        <circle cx="50" cy="42" r="11"/>
        {/* Mid shaft */}
        <rect x="48" y="53" width="4" height="8"/>
        {/* Lower sphere */}
        <circle cx="50" cy="66" r="8"/>
        {/* Base shaft */}
        <rect x="47" y="74" width="6" height="6"/>
        {/* Base platform */}
        <rect x="34" y="79" width="32" height="3" rx="1"/>
      </g>
    )
    default: return null
  }
}

export default function BadgeSVG({ badge, owned = true, size = 100 }: Props) {
  const gradId = `g-${badge.id}`
  const opacity = owned ? 1 : 0.4

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: owned ? `drop-shadow(0 0 8px ${badge.glow}66)` : 'grayscale(1)' }}
    >
      <defs>
        <linearGradient id={gradId} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={badge.from}/>
          <stop offset="100%" stopColor={badge.to}/>
        </linearGradient>
        <clipPath id={`clip-${badge.id}`}>
          <polygon points="50,2 95,26 95,74 50,98 5,74 5,26"/>
        </clipPath>
      </defs>

      {/* Outer hex rim */}
      <polygon
        points="50,2 95,26 95,74 50,98 5,74 5,26"
        fill={owned ? badge.to : '#94a3b8'}
        opacity={0.3}
        strokeWidth="0"
      />
      {/* Inner filled hex */}
      <polygon
        points="50,4 93,27 93,73 50,96 7,73 7,27"
        fill={`url(#${gradId})`}
        opacity={opacity}
      />

      {/* Shine overlay */}
      {owned && (
        <polygon
          points="50,4 93,27 72,27 50,4"
          fill="white"
          opacity={0.15}
        />
      )}

      {/* Landmark */}
      <g opacity={owned ? 1 : 0.5}>
        <Landmark id={badge.id}/>
      </g>

      {/* City name */}
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
  )
}
