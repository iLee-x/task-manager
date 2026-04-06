import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { BADGES } from '@/lib/badges'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// ── Country view config ────────────────────────────────────────────────────────

type ViewKey =
  | 'global' | 'china' | 'usa' | 'canada' | 'uk' | 'france'
  | 'japan' | 'australia' | 'uae' | 'russia' | 'brazil' | 'india'
  | 'germany' | 'italy' | 'spain' | 'south-korea' | 'netherlands'

interface ViewConfig {
  label: string
  emoji: string
  scale: number
  center: [number, number]
  isoIds: string[]
}

const VIEWS: Record<ViewKey, ViewConfig> = {
  global:       { label: 'World',       emoji: '🌍', scale: 147,   center: [0, 20],      isoIds: [] },
  china:        { label: 'China',       emoji: '🇨🇳', scale: 550,   center: [105, 35],    isoIds: ['156'] },
  usa:          { label: 'USA',         emoji: '🇺🇸', scale: 360,   center: [-97, 38],    isoIds: ['840'] },
  canada:       { label: 'Canada',      emoji: '🇨🇦', scale: 275,   center: [-96, 58],    isoIds: ['124'] },
  uk:           { label: 'UK',          emoji: '🇬🇧', scale: 2400,  center: [-2, 54],     isoIds: ['826'] },
  france:       { label: 'France',      emoji: '🇫🇷', scale: 2400,  center: [2.5, 46.5],  isoIds: ['250'] },
  japan:        { label: 'Japan',       emoji: '🇯🇵', scale: 1400,  center: [137, 36],    isoIds: ['392'] },
  australia:    { label: 'Australia',   emoji: '🇦🇺', scale: 390,   center: [134, -26],   isoIds: ['36'] },
  uae:          { label: 'UAE',         emoji: '🇦🇪', scale: 6000,  center: [54, 24.5],   isoIds: ['784'] },
  russia:       { label: 'Russia',      emoji: '🇷🇺', scale: 200,   center: [60, 60],     isoIds: ['643'] },
  brazil:       { label: 'Brazil',      emoji: '🇧🇷', scale: 310,   center: [-52, -10],   isoIds: ['76'] },
  india:        { label: 'India',       emoji: '🇮🇳', scale: 600,   center: [80, 22],     isoIds: ['356'] },
  germany:      { label: 'Germany',     emoji: '🇩🇪', scale: 2600,  center: [10, 51],     isoIds: ['276'] },
  italy:        { label: 'Italy',       emoji: '🇮🇹', scale: 2000,  center: [12.5, 42],   isoIds: ['380'] },
  spain:        { label: 'Spain',       emoji: '🇪🇸', scale: 2000,  center: [-3.5, 40],   isoIds: ['724'] },
  'south-korea':{ label: 'S. Korea',    emoji: '🇰🇷', scale: 4200,  center: [127.5, 36],  isoIds: ['410'] },
  netherlands:  { label: 'Netherlands', emoji: '🇳🇱', scale: 5500,  center: [5.3, 52.3],  isoIds: ['528'] },
}

// ── City data ─────────────────────────────────────────────────────────────────

interface City {
  name: string
  coordinates: [number, number]
  capital?: boolean
  badge?: boolean
}

const CITIES: Record<ViewKey, City[]> = {
  global: [
    { name: 'Toronto',      coordinates: [-79.38,  43.65], badge: true },
    { name: 'New York',     coordinates: [-74.01,  40.71], badge: true },
    { name: 'Los Angeles',  coordinates: [-118.24, 34.05], badge: true },
    { name: 'Paris',        coordinates: [  2.35,  48.85], badge: true },
    { name: 'London',       coordinates: [ -0.13,  51.51], badge: true },
    { name: 'Amsterdam',    coordinates: [  4.90,  52.37], badge: true },
    { name: 'Berlin',       coordinates: [ 13.40,  52.52], badge: true },
    { name: 'Rome',         coordinates: [ 12.49,  41.89], badge: true },
    { name: 'Barcelona',    coordinates: [  2.15,  41.39], badge: true },
    { name: 'Istanbul',     coordinates: [ 28.98,  41.01], badge: true },
    { name: 'Moscow',       coordinates: [ 37.62,  55.75], badge: true },
    { name: 'Mumbai',       coordinates: [ 72.88,  19.07], badge: true },
    { name: 'Singapore',    coordinates: [103.82,   1.35], badge: true },
    { name: 'Seoul',        coordinates: [126.98,  37.57], badge: true },
    { name: 'Tokyo',        coordinates: [139.69,  35.69], badge: true },
    { name: 'Beijing',      coordinates: [116.41,  39.90], badge: true },
    { name: 'Shanghai',     coordinates: [121.47,  31.23], badge: true },
    { name: 'Sydney',       coordinates: [151.21, -33.87], badge: true },
    { name: 'Rio',          coordinates: [ -43.17, -22.91], badge: true },
    { name: 'Dubai',        coordinates: [ 55.27,  25.20], badge: true },
    { name: 'Delhi',        coordinates: [ 77.21,  28.63], capital: true },
    { name: 'São Paulo',    coordinates: [-46.63, -23.55] },
    { name: 'Cairo',        coordinates: [ 31.25,  30.06], capital: true },
  ],
  china: [
    { name: 'Beijing',   coordinates: [116.41, 39.90], capital: true, badge: true },
    { name: 'Shanghai',  coordinates: [121.47, 31.23], badge: true },
    { name: 'Guangzhou', coordinates: [113.26, 23.13] },
    { name: 'Shenzhen',  coordinates: [114.06, 22.54] },
    { name: 'Chengdu',   coordinates: [104.07, 30.66] },
    { name: "Xi'an",     coordinates: [108.95, 34.27] },
    { name: 'Hangzhou',  coordinates: [120.15, 30.28] },
    { name: 'Wuhan',     coordinates: [114.31, 30.59] },
    { name: 'Chongqing', coordinates: [106.55, 29.56] },
    { name: 'Nanjing',   coordinates: [118.80, 32.06] },
  ],
  usa: [
    { name: 'Washington D.C.', coordinates: [-77.04,  38.91], capital: true },
    { name: 'New York',        coordinates: [-74.01,  40.71], badge: true },
    { name: 'Los Angeles',     coordinates: [-118.24, 34.05], badge: true },
    { name: 'Chicago',         coordinates: [ -87.63, 41.88] },
    { name: 'Houston',         coordinates: [ -95.37, 29.76] },
    { name: 'Phoenix',         coordinates: [-112.07, 33.45] },
    { name: 'San Francisco',   coordinates: [-122.42, 37.77] },
    { name: 'Seattle',         coordinates: [-122.33, 47.61] },
    { name: 'Miami',           coordinates: [ -80.19, 25.77] },
    { name: 'Las Vegas',       coordinates: [-115.14, 36.17] },
  ],
  canada: [
    { name: 'Ottawa',      coordinates: [-75.70,  45.42], capital: true },
    { name: 'Toronto',     coordinates: [-79.38,  43.65], badge: true },
    { name: 'Vancouver',   coordinates: [-123.12, 49.28] },
    { name: 'Montreal',    coordinates: [ -73.57, 45.50] },
    { name: 'Calgary',     coordinates: [-114.07, 51.05] },
    { name: 'Edmonton',    coordinates: [-113.49, 53.55] },
    { name: 'Quebec City', coordinates: [ -71.21, 46.81] },
    { name: 'Winnipeg',    coordinates: [ -97.14, 49.90] },
  ],
  uk: [
    { name: 'London',     coordinates: [ -0.13, 51.51], capital: true, badge: true },
    { name: 'Manchester', coordinates: [ -2.24, 53.48] },
    { name: 'Birmingham', coordinates: [ -1.90, 52.49] },
    { name: 'Edinburgh',  coordinates: [ -3.19, 55.95] },
    { name: 'Bristol',    coordinates: [ -2.60, 51.45] },
    { name: 'Liverpool',  coordinates: [ -2.99, 53.41] },
    { name: 'Leeds',      coordinates: [ -1.55, 53.80] },
    { name: 'Glasgow',    coordinates: [ -4.25, 55.86] },
  ],
  france: [
    { name: 'Paris',      coordinates: [ 2.35, 48.85], capital: true, badge: true },
    { name: 'Lyon',       coordinates: [ 4.83, 45.75] },
    { name: 'Marseille',  coordinates: [ 5.37, 43.30] },
    { name: 'Nice',       coordinates: [ 7.27, 43.71] },
    { name: 'Bordeaux',   coordinates: [-0.58, 44.84] },
    { name: 'Toulouse',   coordinates: [ 1.44, 43.60] },
    { name: 'Strasbourg', coordinates: [ 7.75, 48.58] },
    { name: 'Nantes',     coordinates: [-1.56, 47.22] },
  ],
  japan: [
    { name: 'Tokyo',     coordinates: [139.69, 35.69], capital: true, badge: true },
    { name: 'Osaka',     coordinates: [135.50, 34.69] },
    { name: 'Kyoto',     coordinates: [135.77, 35.01] },
    { name: 'Hiroshima', coordinates: [132.46, 34.39] },
    { name: 'Sapporo',   coordinates: [141.35, 43.06] },
    { name: 'Fukuoka',   coordinates: [130.41, 33.59] },
    { name: 'Nagoya',    coordinates: [136.91, 35.18] },
    { name: 'Yokohama',  coordinates: [139.64, 35.44] },
  ],
  australia: [
    { name: 'Canberra',  coordinates: [149.13, -35.28], capital: true },
    { name: 'Sydney',    coordinates: [151.21, -33.87], badge: true },
    { name: 'Melbourne', coordinates: [144.96, -37.81] },
    { name: 'Brisbane',  coordinates: [153.03, -27.47] },
    { name: 'Perth',     coordinates: [115.86, -31.95] },
    { name: 'Adelaide',  coordinates: [138.60, -34.93] },
    { name: 'Darwin',    coordinates: [130.84, -12.46] },
    { name: 'Cairns',    coordinates: [145.77, -16.92] },
  ],
  uae: [
    { name: 'Abu Dhabi',      coordinates: [54.37, 24.47], capital: true },
    { name: 'Dubai',          coordinates: [55.27, 25.20], badge: true },
    { name: 'Sharjah',        coordinates: [55.41, 25.34] },
    { name: 'Ajman',          coordinates: [55.43, 25.41] },
    { name: 'Ras Al Khaimah', coordinates: [55.94, 25.79] },
  ],
  russia: [
    { name: 'Moscow',          coordinates: [ 37.62,  55.75], capital: true, badge: true },
    { name: 'St. Petersburg',  coordinates: [ 30.32,  59.94] },
    { name: 'Novosibirsk',     coordinates: [ 82.92,  55.02] },
    { name: 'Vladivostok',     coordinates: [131.87,  43.12] },
    { name: 'Yekaterinburg',   coordinates: [ 60.60,  56.83] },
    { name: 'Kazan',           coordinates: [ 49.12,  55.79] },
    { name: 'Sochi',           coordinates: [ 39.72,  43.58] },
  ],
  brazil: [
    { name: 'Brasília',        coordinates: [-47.93, -15.78], capital: true },
    { name: 'Rio de Janeiro',  coordinates: [-43.17, -22.91], badge: true },
    { name: 'São Paulo',       coordinates: [-46.63, -23.55] },
    { name: 'Salvador',        coordinates: [-38.51,  -12.97] },
    { name: 'Fortaleza',       coordinates: [-38.54,  -3.72] },
    { name: 'Manaus',          coordinates: [-60.02,  -3.10] },
    { name: 'Recife',          coordinates: [-34.87,  -8.05] },
    { name: 'Porto Alegre',    coordinates: [-51.23, -30.03] },
  ],
  india: [
    { name: 'New Delhi',   coordinates: [ 77.21,  28.63], capital: true },
    { name: 'Mumbai',      coordinates: [ 72.88,  19.07], badge: true },
    { name: 'Bangalore',   coordinates: [ 77.59,  12.97] },
    { name: 'Hyderabad',   coordinates: [ 78.47,  17.38] },
    { name: 'Chennai',     coordinates: [ 80.28,  13.09] },
    { name: 'Kolkata',     coordinates: [ 88.36,  22.57] },
    { name: 'Jaipur',      coordinates: [ 75.79,  26.91] },
    { name: 'Ahmedabad',   coordinates: [ 72.58,  23.03] },
    { name: 'Agra',        coordinates: [ 78.01,  27.18] },
  ],
  germany: [
    { name: 'Berlin',      coordinates: [ 13.40, 52.52], capital: true, badge: true },
    { name: 'Munich',      coordinates: [ 11.58, 48.14] },
    { name: 'Hamburg',     coordinates: [  9.99, 53.55] },
    { name: 'Frankfurt',   coordinates: [  8.68, 50.11] },
    { name: 'Cologne',     coordinates: [  6.96, 50.94] },
    { name: 'Stuttgart',   coordinates: [  9.18, 48.78] },
    { name: 'Düsseldorf',  coordinates: [  6.78, 51.23] },
    { name: 'Dresden',     coordinates: [ 13.74, 51.05] },
  ],
  italy: [
    { name: 'Rome',    coordinates: [ 12.49, 41.89], capital: true, badge: true },
    { name: 'Milan',   coordinates: [  9.19, 45.46] },
    { name: 'Naples',  coordinates: [ 14.27, 40.84] },
    { name: 'Venice',  coordinates: [ 12.34, 45.44] },
    { name: 'Florence',coordinates: [ 11.26, 43.78] },
    { name: 'Turin',   coordinates: [  7.68, 45.07] },
    { name: 'Bologna', coordinates: [ 11.34, 44.49] },
    { name: 'Palermo', coordinates: [ 13.36, 38.12] },
  ],
  spain: [
    { name: 'Madrid',     coordinates: [ -3.70, 40.42], capital: true },
    { name: 'Barcelona',  coordinates: [  2.15, 41.39], badge: true },
    { name: 'Valencia',   coordinates: [ -0.37, 39.47] },
    { name: 'Seville',    coordinates: [ -5.99, 37.39] },
    { name: 'Bilbao',     coordinates: [ -2.92, 43.26] },
    { name: 'Granada',    coordinates: [ -3.60, 37.18] },
    { name: 'Málaga',     coordinates: [ -4.42, 36.72] },
    { name: 'Zaragoza',   coordinates: [ -0.88, 41.65] },
  ],
  'south-korea': [
    { name: 'Seoul',    coordinates: [126.98, 37.57], capital: true, badge: true },
    { name: 'Busan',    coordinates: [129.04, 35.10] },
    { name: 'Incheon',  coordinates: [126.71, 37.46] },
    { name: 'Daegu',    coordinates: [128.60, 35.87] },
    { name: 'Daejeon',  coordinates: [127.38, 36.35] },
    { name: 'Gwangju',  coordinates: [126.85, 35.16] },
    { name: 'Jeju',     coordinates: [126.56, 33.50] },
  ],
  netherlands: [
    { name: 'Amsterdam', coordinates: [ 4.90, 52.37], capital: true, badge: true },
    { name: 'Rotterdam', coordinates: [ 4.48, 51.92] },
    { name: 'The Hague', coordinates: [ 4.30, 52.08] },
    { name: 'Utrecht',   coordinates: [ 5.12, 52.09] },
    { name: 'Eindhoven', coordinates: [ 5.48, 51.44] },
    { name: 'Delft',     coordinates: [ 4.35, 52.01] },
  ],
}

// ── Badge country ISO map ──────────────────────────────────────────────────────

function isoForBadge(badgeId: string): string | null {
  return BADGES.find((b) => b.id === badgeId)?.countryIso ?? null
}

function normaliseId(id: unknown): string {
  return String(Math.round(Number(id ?? 0)))
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  ownedBadges: string[]
}

// Group view keys for display in rows
const VIEW_GROUPS: ViewKey[][] = [
  ['global'],
  ['china', 'usa', 'canada', 'uk', 'france', 'japan', 'australia', 'uae'],
  ['russia', 'brazil', 'india', 'germany', 'italy', 'spain', 'south-korea', 'netherlands'],
]

export default function CountryMap({ ownedBadges }: Props) {
  const [activeView, setActiveView] = useState<ViewKey>('global')
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const view = VIEWS[activeView]
  const cities = CITIES[activeView]

  const ownedIso = new Set(
    ownedBadges.map((id) => isoForBadge(id)).filter(Boolean) as string[]
  )
  const allBadgeIso = new Set(BADGES.map((b) => b.countryIso))

  function getCountryFill(geoId: string): string {
    const iso = normaliseId(geoId)
    if (activeView === 'global') {
      if (ownedIso.has(iso)) return '#d4af37'
      if (allBadgeIso.has(iso)) return '#2d5a9e'
      return '#1a3760'
    }
    if (view.isoIds.includes(iso)) {
      return ownedIso.has(iso) ? '#d4af37' : '#3b82f6'
    }
    return '#0c1524'
  }

  function getCountryStroke(geoId: string): string {
    const iso = normaliseId(geoId)
    if (activeView === 'global') {
      if (ownedIso.has(iso) || allBadgeIso.has(iso)) return '#334155'
      return '#0f2137'
    }
    return view.isoIds.includes(iso) ? '#1e3a5f' : '#0a0f1a'
  }

  return (
    <div>
      {/* Country tabs — global first, then grouped rows */}
      <div className="space-y-2 mb-5">
        {VIEW_GROUPS.map((group, gi) => (
          <div key={gi} className="flex flex-wrap gap-1.5">
            {group.map((key) => {
              const v = VIEWS[key]
              const badgeForCountry = BADGES.find((b) => v.isoIds.includes(b.countryIso))
              const isOwned = badgeForCountry ? ownedBadges.includes(badgeForCountry.id) : false
              return (
                <button
                  key={key}
                  onClick={() => setActiveView(key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={
                    activeView === key
                      ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }
                      : isOwned
                      ? { background: 'rgba(251,191,36,0.18)', border: '1px solid rgba(251,191,36,0.35)', color: '#b45309' }
                      : { background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)', color: '#6b7280', backdropFilter: 'blur(8px)' }
                  }
                >
                  <span>{v.emoji}</span>
                  {v.label}
                  {isOwned && activeView !== key && <span style={{ color: '#f59e0b' }}>✦</span>}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Map container */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #060d1a 0%, #0a1628 50%, #060d1a 100%)' }}
      >
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            zIndex: 1,
          }}
        />

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: view.scale, center: view.center }}
          width={800}
          height={460}
          style={{ width: '100%', height: 'auto', position: 'relative', zIndex: 2 }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso = normaliseId(geo.id)
                const fill = getCountryFill(String(geo.id))
                const stroke = getCountryStroke(String(geo.id))
                const isHighlight = view.isoIds.includes(iso) || (activeView === 'global' && (ownedIso.has(iso) || allBadgeIso.has(iso)))
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isHighlight ? 0.6 : 0.3}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: isHighlight ? '#e8c84a' : fill, cursor: isHighlight ? 'pointer' : 'default' },
                      pressed: { outline: 'none' },
                    }}
                  />
                )
              })
            }
          </Geographies>

          {cities.map((city) => {
            const isHovered = hoveredCity === city.name
            const markerColor = city.badge ? '#fbbf24' : city.capital ? '#38bdf8' : '#a78bfa'
            const r = city.badge ? 5 : city.capital ? 4 : 3
            return (
              <Marker
                key={city.name}
                coordinates={city.coordinates}
                onMouseEnter={() => setHoveredCity(city.name)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                <circle
                  r={r + 4}
                  fill="none"
                  stroke={markerColor}
                  strokeWidth={1}
                  opacity={isHovered ? 0.6 : 0.25}
                  style={{ animation: 'city-pulse 2s ease-in-out infinite' }}
                />
                <circle
                  r={isHovered ? r + 1 : r}
                  fill={markerColor}
                  stroke="white"
                  strokeWidth={0.8}
                  opacity={isHovered ? 1 : 0.85}
                  style={{ transition: 'r 0.2s' }}
                />
                {(isHovered || city.badge) && (
                  <text
                    textAnchor="middle"
                    y={-(r + 6)}
                    style={{
                      fontSize: city.badge ? 8 : 7,
                      fill: isHovered ? 'white' : markerColor,
                      fontFamily: 'system-ui, sans-serif',
                      fontWeight: city.badge ? '700' : '500',
                      pointerEvents: 'none',
                      textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                    }}
                  >
                    {city.name}
                  </text>
                )}
              </Marker>
            )
          })}
        </ComposableMap>

        <div className="absolute top-3 left-4 z-10">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            {view.emoji} {view.label}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" />
          Badge city
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400" />
          Capital
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-violet-400" />
          Major city
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: '#d4af37' }} />
          Owned badge country
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" />
          Locked badge country
        </span>
      </div>
    </div>
  )
}
