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
  if (typeof window === 'undefined') return DEFAULT_GAME
  try {
    const raw = localStorage.getItem(GAME_KEY)
    if (!raw) return DEFAULT_GAME
    return { ...DEFAULT_GAME, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_GAME
  }
}

export function saveGameData(data: GameData) {
  localStorage.setItem(GAME_KEY, JSON.stringify(data))
}

/** Format using LOCAL calendar date (not UTC) to match the user's timezone */
export function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function today(): string {
  return formatDate(new Date())
}

/** Calculate current streak (consecutive days with activity ending today or yesterday) */
export function calculateStreak(log: Record<string, number>): number {
  const d = new Date()
  // If today has no activity yet, allow streak to still count from yesterday
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

/** Random int between min and max inclusive */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export interface CoinResult {
  baseCoins: number
  bonusCoins: number
  bonusReason: string
  streak: number
}

/** Calculate coins earned when archiving a task */
export function calcCoins(game: GameData): CoinResult {
  const base = randInt(1, 5)

  // Update activity log for today
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

  return { baseCoins: base, bonusCoins, bonusReason, streak }
}

/** Apply a coin result to game data (also logs the activity) */
export function applyCoins(game: GameData, result: CoinResult): GameData {
  const todayKey = today()
  const newLog = { ...game.activityLog, [todayKey]: (game.activityLog[todayKey] ?? 0) + 1 }
  const total = result.baseCoins + result.bonusCoins
  return {
    ...game,
    coins: game.coins + total,
    activityLog: newLog,
    currentStreak: result.streak,
    longestStreak: Math.max(game.longestStreak, result.streak),
    totalCompleted: game.totalCompleted + 1,
    totalCoinsEarned: game.totalCoinsEarned + total,
    lastStreakBonus: result.bonusCoins > 0 ? result.streak : game.lastStreakBonus,
  }
}
