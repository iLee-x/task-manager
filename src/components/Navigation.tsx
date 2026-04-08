import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

export default function Navigation() {
  const coins = useSelector((s: RootState) => s.game.coins)
  const todayCount = useSelector((s: RootState) => s.today.subtaskIds.length)
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
            to="/today"
            className={`relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all ${
              pathname === '/today'
                ? 'bg-amber-500/15 text-amber-700 shadow-sm'
                : 'text-gray-500 hover:bg-white/60 hover:text-gray-800'
            }`}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={pathname === '/today' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Today
            {todayCount > 0 && (
              <span
                className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none text-white"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 2px 6px rgba(245,158,11,0.4)' }}
              >
                {todayCount}
              </span>
            )}
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
          <Link
            to="/history"
            className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-all ${
              pathname === '/history'
                ? 'bg-indigo-500/15 text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:bg-white/60 hover:text-gray-800'
            }`}
          >
            History
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
