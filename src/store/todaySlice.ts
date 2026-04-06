import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

function todayKey() {
  return new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'
}

interface TodayState {
  date: string
  taskIds: string[]
}

function loadInitial(): TodayState {
  try {
    const raw = localStorage.getItem('task-manager-today')
    if (raw) {
      const parsed = JSON.parse(raw) as TodayState
      // Auto-reset if the stored date is not today
      if (parsed.date === todayKey()) return parsed
    }
  } catch { /* ignore */ }
  return { date: todayKey(), taskIds: [] }
}

const todaySlice = createSlice({
  name: 'today',
  initialState: loadInitial(),
  reducers: {
    toggleToday(state, action: PayloadAction<string>) {
      // Reset if date changed
      if (state.date !== todayKey()) {
        state.date = todayKey()
        state.taskIds = []
      }
      const id = action.payload
      const idx = state.taskIds.indexOf(id)
      if (idx >= 0) {
        state.taskIds.splice(idx, 1)
      } else {
        state.taskIds.push(id)
      }
    },
    removeFromToday(state, action: PayloadAction<string>) {
      state.taskIds = state.taskIds.filter((id) => id !== action.payload)
    },
    clearToday(state) {
      state.taskIds = []
      state.date = todayKey()
    },
  },
})

export const { toggleToday, removeFromToday, clearToday } = todaySlice.actions
export default todaySlice.reducer
