import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'
import { buyBadge } from '@/store/gameSlice'
import { BADGES } from '@/lib/badges'
import Heatmap from '@/components/Heatmap'
import Badge3D from '@/components/Badge3D'
import CountryMap from '@/components/CountryMap'
import { useT } from '@/i18n/LanguageContext'
import { LOCALE_MAP } from '@/i18n/translations'

export default function Stats() {
  const game = useSelector((s: RootState) => s.game)
  const tasks = useSelector((s: RootState) => s.tasks)
  const dispatch = useDispatch<AppDispatch>()
  const [buyMsg, setBuyMsg] = useState('')
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const { t, lang } = useT()

  const streak = game.currentStreak

  function handleBuy(id: string, price: number) {
    if (game.badges.includes(id)) return
    if (game.coins < price) {
      setBuyMsg(t.stats.notEnoughCoins)
      setTimeout(() => setBuyMsg(''), 2000)
      return
    }
    dispatch(buyBadge({ id, price }))
  }

  const previewBadge = BADGES.find((b) => b.id === selectedBadge) ?? null

  const statCards = [
    { label: t.stats.coins,         value: game.coins,              icon: '🪙', from: 'rgba(251,191,36,0.2)',  to: 'rgba(245,158,11,0.2)',  border: 'rgba(251,191,36,0.4)' },
    { label: t.stats.currentStreak, value: `${streak}d`,            icon: '🔥', from: 'rgba(251,113,44,0.2)',  to: 'rgba(239,68,68,0.2)',   border: 'rgba(251,113,44,0.4)' },
    { label: t.stats.bestStreak,    value: `${game.longestStreak}d`,icon: '⚡', from: 'rgba(139,92,246,0.2)',  to: 'rgba(99,102,241,0.2)',  border: 'rgba(139,92,246,0.4)' },
    { label: t.stats.subtasksDone,  value: game.totalCompleted,     icon: '✅', from: 'rgba(52,211,153,0.2)',  to: 'rgba(16,185,129,0.2)',  border: 'rgba(52,211,153,0.4)' },
  ]

  return (
    <main className="flex-1 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-6">

        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          {t.stats.backToTasks}
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-gray-800">{t.stats.title}</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon, from, to, border }) => (
            <div
              key={label}
              className="rounded-2xl p-5"
              style={{ background: `linear-gradient(135deg, ${from}, ${to})`, border: `1px solid ${border}`, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{ background: 'rgba(255,255,255,0.5)' }}>{icon}</div>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Streak bonuses */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-1">{t.stats.streakBonuses}</h2>
          <p className="text-xs text-gray-400 mb-4">{t.stats.streakBonusesHint}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { label: t.stats.streak3,  desc: t.stats.bonus5to10,  threshold: 3  },
              { label: t.stats.streak7,  desc: t.stats.bonus20to30, threshold: 7  },
              { label: t.stats.streak14, desc: t.stats.bonus20to30, threshold: 14 },
            ].map(({ label, desc, threshold }) => (
              <div
                key={threshold}
                className="flex-1 rounded-xl p-4"
                style={
                  streak >= threshold
                    ? { background: 'rgba(251,113,44,0.12)', border: '1px solid rgba(251,113,44,0.3)' }
                    : { background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.6)' }
                }
              >
                <p className="text-sm font-semibold text-gray-700">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity heatmap */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">{t.stats.activity}</h2>
          <Heatmap activityLog={game.activityLog} tasks={tasks} />
        </div>

        {/* Completion history */}
        {(() => {
          const history = tasks
            .filter((tk) => tk.archived && tk.archivedAt)
            .slice()
            .sort((a, b) => (b.archivedAt! > a.archivedAt! ? 1 : -1))
          if (history.length === 0) return null
          return (
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-base font-semibold text-gray-700 mb-1">{t.stats.completionHistory}</h2>
              <p className="text-xs text-gray-400 mb-4">{t.stats.tasksCompletedTotal(history.length)}</p>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {history.map((tk) => {
                  const label = new Date(tk.archivedAt! + 'T12:00:00').toLocaleDateString(LOCALE_MAP[lang], { month: 'short', day: 'numeric', year: 'numeric' })
                  return (
                    <div
                      key={tk._id}
                      className="flex items-center gap-3 rounded-xl px-4 py-2.5"
                      style={{ background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.7)' }}
                    >
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm"
                        style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.25)' }}
                      >
                        ✓
                      </div>
                      <span className="flex-1 text-sm font-medium text-gray-700 truncate">{tk.title}</span>
                      <span className="shrink-0 text-xs text-gray-400">{label}</span>
                      {tk.coinsEarned != null && (
                        <span
                          className="shrink-0 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#b45309' }}
                        >
                          🪙 {tk.coinsEarned}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* World Map */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-1">{t.stats.worldMap}</h2>
          <p className="text-xs text-gray-400 mb-5">{t.stats.worldMapHint}</p>
          <CountryMap ownedBadges={game.badges} />
        </div>

        {/* My Badges — 3D rotating */}
        {game.badges.length > 0 && (
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-base font-semibold text-gray-700 mb-1">
              {t.stats.myBadges}
              <span className="ml-2 text-xs font-normal text-gray-400">{t.stats.collected(game.badges.length)}</span>
            </h2>
            <p className="text-xs text-gray-400 mb-6">{t.stats.badgesHint}</p>
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
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)' }}
            onClick={() => setSelectedBadge(null)}
          >
            <div
              className="glass-modal rounded-3xl p-10 flex flex-col items-center gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <Badge3D badge={previewBadge} owned={game.badges.includes(previewBadge.id)} size={220} />
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{previewBadge.name}</p>
                <p className="text-sm text-gray-400">{previewBadge.landmark}</p>
              </div>
              <button
                onClick={() => setSelectedBadge(null)}
                className="mt-2 rounded-xl px-5 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-white/50"
                style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.7)' }}
              >
                {t.stats.close}
              </button>
            </div>
          </div>
        )}

        {/* Badge shop */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-semibold text-gray-700">{t.stats.badgeShop}</h2>
            <span
              className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-sm font-semibold"
              style={{ background: 'rgba(251,191,36,0.18)', border: '1px solid rgba(251,191,36,0.35)', color: '#b45309' }}
            >
              🪙 {game.coins} {t.stats.coinsSuffix}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-6">{t.stats.badgeShopHint}</p>

          {buyMsg && (
            <div
              className="mb-4 rounded-xl px-4 py-2.5 text-sm font-medium"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626' }}
            >
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
                    <p className="text-sm font-semibold text-gray-700">{badge.name}</p>
                    <p className="text-xs text-gray-400">{badge.landmark}</p>
                  </div>
                  {owned ? (
                    <span
                      className="rounded-lg px-3 py-1 text-xs font-semibold"
                      style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', color: '#059669' }}
                    >
                      {t.stats.owned}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuy(badge.id, badge.price)}
                      disabled={!canAfford}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
                      style={
                        canAfford
                          ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }
                          : { background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.08)', color: '#9ca3af', cursor: 'not-allowed' }
                      }
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
