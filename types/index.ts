export interface GameData {
  coins: number
  badges: string[]
  activityLog: Record<string, number> // 'YYYY-MM-DD' -> tasks archived that day
  currentStreak: number
  longestStreak: number
  totalCompleted: number
  totalCoinsEarned: number
  lastStreakBonus: number // streak level at last bonus to avoid re-triggering
}

export interface Subtask {
  _id: string
  title: string
  done: boolean
}

export interface Task {
  _id: string
  title: string
  description?: string
  subtasks: Subtask[]
  archived: boolean
  createdAt: string
  updatedAt: string
}
