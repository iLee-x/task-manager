export interface GameData {
  coins: number
  badges: string[]
  activityLog: Record<string, number> // 'YYYY-MM-DD' -> tasks archived that day
  currentStreak: number
  longestStreak: number
  totalCompleted: number
  totalCoinsEarned: number
  lastStreakBonus: number
}

export interface Subtask {
  _id: string
  title: string
  done: boolean
  priority?: 'high' | 'medium' | 'low'
}

export interface Task {
  _id: string
  title: string
  description?: string
  subtasks: Subtask[]
  archived: boolean
  archivedAt?: string
  coinsEarned?: number
  createdAt: string
  updatedAt: string
}
