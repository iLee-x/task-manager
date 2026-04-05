'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Heatmap from '@/components/Heatmap'
import BadgeSVG from '@/components/BadgeSVG'
import { loadGameData, saveGameData } from '@/lib/gameData'
import { BADGES } from '@/lib/badges'
import type { GameData } from '@/types'

export default function StatsPage() {
  const [game, setGame] = useState<GameData | null>(null)
  const [buyMessage, setBuyMessage] = useState('')

  useEffect(() => {
    setGame(loadGameData())
  }, [])

  function buyBadge(id: string, price: number) {
    if (!game) return
    if (game.badges.includes(id)) return
    if (game.coins < price) { setBuyMessage("Not enough coins!"); setTimeout(() => setBuyMessage(''), 2000); return }
    const next = { ...game, coins: game.coins - price, badges: [...game.badges, id] }
    setGame(next)
    saveGameData(next)
  }

  if (!game) return null

  const streak = game.currentStreak

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to tasks
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Stats & Achievements</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Coins', value: game.coins, icon: '🪙', color: 'from-amber-400 to-yellow-500' },
            { label: 'Current Streak', value: `${streak}d`, icon: '🔥', color: 'from-orange-400 to-red-500' },
            { label: 'Best Streak', value: `${game.longestStreak}d`, icon: '⚡', color: 'from-violet-400 to-indigo-500' },
            { label: 'Tasks Done', value: game.totalCompleted, icon: '✅', color: 'from-emerald-400 to-green-500' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-lg`}>
                {icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Streak info */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">Streak Bonuses</h2>
          <p className="text-xs text-gray-400 mb-4">Archive tasks daily to build your streak and earn bonus coins.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className={`flex-1 rounded-xl p-4 border ${streak >= 3 ? 'border-orange-200 bg-orange-50' : 'border-gray-100 bg-gray-50'}`}>
              <p className="text-sm font-semibold text-gray-700">🔥 3-Day Streak</p>
              <p className="text-xs text-gray-400 mt-0.5">+5 to +10 bonus coins</p>
            </div>
            <div className={`flex-1 rounded-xl p-4 border ${streak >= 7 ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
              <p className="text-sm font-semibold text-gray-700">🔥 7-Day Streak</p>
              <p className="text-xs text-gray-400 mt-0.5">+20 to +30 bonus coins</p>
            </div>
            <div className={`flex-1 rounded-xl p-4 border ${streak >= 14 ? 'border-violet-200 bg-violet-50' : 'border-gray-100 bg-gray-50'}`}>
              <p className="text-sm font-semibold text-gray-700">🔥 14-Day Streak</p>
              <p className="text-xs text-gray-400 mt-0.5">+20 to +30 bonus coins</p>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Activity</h2>
          <Heatmap activityLog={game.activityLog} />
        </div>

        {/* Owned badges */}
        {game.badges.length > 0 && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              My Badges
              <span className="ml-2 text-xs font-normal text-gray-400">{game.badges.length} collected</span>
            </h2>
            <div className="flex flex-wrap gap-4">
              {BADGES.filter((b) => game.badges.includes(b.id)).map((badge) => (
                <div key={badge.id} className="flex flex-col items-center gap-1.5">
                  <BadgeSVG badge={badge} owned size={80} />
                  <p className="text-xs text-gray-500 font-medium">{badge.landmark}</p>
                </div>
              ))}
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
          <p className="text-xs text-gray-400 mb-6">Earn coins by archiving tasks. Each archive gives 1–5 coins.</p>

          {buyMessage && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600 font-medium">
              {buyMessage}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {BADGES.map((badge) => {
              const owned = game.badges.includes(badge.id)
              const canAfford = game.coins >= badge.price
              return (
                <div key={badge.id} className="flex flex-col items-center gap-3">
                  <BadgeSVG badge={badge} owned={owned} size={90} />
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
                      onClick={() => buyBadge(badge.id, badge.price)}
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
