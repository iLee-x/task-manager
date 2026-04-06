import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { GameData } from '@/types'
import { DEFAULT_GAME, loadGameData } from '@/lib/gameData'

const gameSlice = createSlice({
  name: 'game',
  initialState: loadGameData() as GameData,
  reducers: {
    applyCoins(
      state,
      action: PayloadAction<{
        baseCoins: number
        bonusCoins: number
        streak: number
        todayKey: string
        lastStreakBonus: number
      }>,
    ) {
      const { baseCoins, bonusCoins, streak, todayKey, lastStreakBonus } = action.payload
      const total = baseCoins + bonusCoins
      state.coins += total
      state.activityLog[todayKey] = (state.activityLog[todayKey] ?? 0) + 1
      state.currentStreak = streak
      state.longestStreak = Math.max(state.longestStreak, streak)
      state.totalCompleted += 1
      state.totalCoinsEarned += total
      state.lastStreakBonus = lastStreakBonus
    },
    buyBadge(state, action: PayloadAction<{ id: string; price: number }>) {
      if (!state.badges.includes(action.payload.id) && state.coins >= action.payload.price) {
        state.coins -= action.payload.price
        state.badges.push(action.payload.id)
      }
    },
  },
})

export const { applyCoins, buyBadge } = gameSlice.actions
export { DEFAULT_GAME }
export default gameSlice.reducer
