import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

export default function Navigation() {
  const coins = useSelector((s: RootState) => s.game.coins)
  const { pathname } = useLocation()

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-3">
        <Link to="/" className="text-sm font-bold text-indigo-600 tracking-tight">TaskFlow</Link>
        <div className="flex gap-1">
          <Link
            to="/"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              pathname === '/' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            Tasks
          </Link>
          <Link
            to="/stats"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              pathname === '/stats' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            Stats & Shop
          </Link>
        </div>
        <div className="ml-auto">
          <Link
            to="/stats"
            className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
          >
            🪙 {coins}
          </Link>
        </div>
      </div>
    </nav>
  )
}
