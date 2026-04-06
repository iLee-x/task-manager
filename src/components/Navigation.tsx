import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

export default function Navigation() {
  const coins = useSelector((s: RootState) => s.game.coins)
  const { pathname } = useLocation()

  return (
    <nav className="glass-nav sticky top-0 z-40">
      <div className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-3">
        <Link to="/" className="text-sm font-bold tracking-tight" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          TaskFlow
        </Link>
        <div className="flex gap-1">
          <Link
            to="/"
            className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-all ${
              pathname === '/'
                ? 'bg-indigo-500/15 text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:bg-white/60 hover:text-gray-800'
            }`}
          >
            Tasks
          </Link>
          <Link
            to="/stats"
            className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-all ${
              pathname === '/stats'
                ? 'bg-indigo-500/15 text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:bg-white/60 hover:text-gray-800'
            }`}
          >
            Stats & Shop
          </Link>
        </div>
        <div className="ml-auto">
          <Link
            to="/stats"
            className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(251,191,36,0.18)', border: '1px solid rgba(251,191,36,0.35)', color: '#b45309' }}
          >
            🪙 {coins}
          </Link>
        </div>
      </div>
    </nav>
  )
}
