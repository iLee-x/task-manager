import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'
import { buyBadge } from '@/store/gameSlice'
import { BADGES } from '@/lib/badges'
import Heatmap from '@/components/Heatmap'
import Badge3D from '@/components/Badge3D'
import CountryMap from '@/components/CountryMap'

export default function Stats() {
  const game = useSelector((s: RootState) => s.game)
  const dispatch = useDispatch<AppDispatch>()
  const [buyMsg, setBuyMsg] = useState('')
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)

  const streak = game.currentStreak

  function handleBuy(id: string, price: number) {
    if (game.badges.includes(id)) return
    if (game.coins < price) {
      setBuyMsg('Not enough coins!')
      setTimeout(() => setBuyMsg(''), 2000)
      return
    }
    dispatch(buyBadge({ id, price }))
  }

  const previewBadge = BADGES.find((b) => b.id === selectedBadge) ?? null

  return (
    <main className="flex-1 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">

        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to tasks
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Stats & Achievements</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Coins',          value: game.coins,          icon: '🪙', color: 'from-amber-400 to-yellow-500' },
            { label: 'Current Streak', value: `${streak}d`,        icon: '🔥', color: 'from-orange-400 to-red-500' },
            { label: 'Best Streak',    value: `${game.longestStreak}d`, icon: '⚡', color: 'from-violet-400 to-indigo-500' },
            { label: 'Tasks Done',     value: game.totalCompleted,  icon: '✅', color: 'from-emerald-400 to-green-500' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-lg`}>{icon}</div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Streak bonuses */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">Streak Bonuses</h2>
          <p className="text-xs text-gray-400 mb-4">Archive tasks daily to build your streak and earn bonus coins.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { label: '🔥 3-Day Streak',  desc: '+5 to +10 bonus coins',  threshold: 3  },
              { label: '🔥 7-Day Streak',  desc: '+20 to +30 bonus coins', threshold: 7  },
              { label: '🔥 14-Day Streak', desc: '+20 to +30 bonus coins', threshold: 14 },
            ].map(({ label, desc, threshold }) => (
              <div
                key={threshold}
                className={`flex-1 rounded-xl p-4 border ${
                  streak >= threshold ? 'border-orange-200 bg-orange-50' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <p className="text-sm font-semibold text-gray-700">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity heatmap */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Activity</h2>
          <Heatmap activityLog={game.activityLog} />
        </div>

        {/* World Map */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">World Map</h2>
          <p className="text-xs text-gray-400 mb-5">
            Gold countries = badges you own. Hover to explore famous cities.
          </p>
          <CountryMap ownedBadges={game.badges} />
        </div>

        {/* My Badges — 3D rotating */}
        {game.badges.length > 0 && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-1">
              My Badges
              <span className="ml-2 text-xs font-normal text-gray-400">{game.badges.length} collected</span>
            </h2>
            <p className="text-xs text-gray-400 mb-6">Hover to pause rotation. Click to preview enlarged.</p>
            <div className="flex flex-wrap gap-8 justify-center sm:justify-start">
              {BADGES.filter((b) => game.badges.includes(b.id)).map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-3 cursor-pointer"
                  onClick={() => setSelectedBadge(selectedBadge === badge.id ? null : badge.id)}
                >
                  <Badge3D badge={badge} owned size={110} />
                  <p className="text-xs text-gray-500 font-medium">{badge.landmark}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badge preview modal */}
        {previewBadge && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedBadge(null)}
          >
            <div
              className="bg-white rounded-3xl p-10 shadow-2xl flex flex-col items-center gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <Badge3D badge={previewBadge} owned={game.badges.includes(previewBadge.id)} size={220} />
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{previewBadge.name}</p>
                <p className="text-sm text-gray-400">{previewBadge.landmark}</p>
              </div>
              <button
                onClick={() => setSelectedBadge(null)}
                className="mt-2 rounded-xl border border-gray-200 px-5 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Badge shop */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-semibold text-gray-800">Badge Shop</h2>
            <span className="flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-sm font-semibold text-amber-700">
              🪙 {game.coins} coins
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-6">Earn coins by archiving tasks. Badges feature 3D rotation — front shows the landmark, back shows details.</p>

          {buyMsg && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600 font-medium">
              {buyMsg}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {BADGES.map((badge) => {
              const owned = game.badges.includes(badge.id)
              const canAfford = game.coins >= badge.price
              return (
                <div key={badge.id} className="flex flex-col items-center gap-3">
                  <Badge3D badge={badge} owned={owned} size={100} />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">{badge.name}</p>
                    <p className="text-xs text-gray-400">{badge.landmark}</p>
                  </div>
                  {owned ? (
                    <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600">
                      Owned ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuy(badge.id, badge.price)}
                      disabled={!canAfford}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        canAfford
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      🪙 {badge.price}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </main>
  )
}
