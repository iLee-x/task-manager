import type { GameData } from '@/types'

const GAME_KEY = 'task-manager-game'

export const DEFAULT_GAME: GameData = {
  coins: 0,
  badges: [],
  activityLog: {},
  currentStreak: 0,
  longestStreak: 0,
  totalCompleted: 0,
  totalCoinsEarned: 0,
  lastStreakBonus: 0,
}

export function loadGameData(): GameData {
  try {
    const raw = localStorage.getItem(GAME_KEY)
    if (!raw) return DEFAULT_GAME
    return { ...DEFAULT_GAME, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_GAME
  }
}

/** Format using LOCAL calendar date (not UTC) to match user's timezone */
export function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function today(): string {
  return formatDate(new Date())
}

export function calculateStreak(log: Record<string, number>): number {
  const d = new Date()
  if (!log[formatDate(d)]) {
    d.setDate(d.getDate() - 1)
  }
  let streak = 0
  while (log[formatDate(d)] > 0) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export interface CoinResult {
  baseCoins: number
  bonusCoins: number
  bonusReason: string
  streak: number
  todayKey: string
}

export function calcCoins(game: GameData): CoinResult {
  const base = randInt(1, 5)
  const todayKey = today()
  const newLog = { ...game.activityLog, [todayKey]: (game.activityLog[todayKey] ?? 0) + 1 }
  const streak = calculateStreak(newLog)

  let bonusCoins = 0
  let bonusReason = ''

  const bonusMilestone = streak >= 7 && streak % 7 === 0 ? streak : streak === 3 ? 3 : 0

  if (bonusMilestone > 0 && bonusMilestone !== game.lastStreakBonus) {
    if (bonusMilestone >= 7) {
      bonusCoins = randInt(20, 30)
      bonusReason = `🔥 ${streak}-day streak!`
    } else {
      bonusCoins = randInt(5, 10)
      bonusReason = `🔥 3-day streak!`
    }
  }

  return { baseCoins: base, bonusCoins, bonusReason, streak, todayKey }
}
