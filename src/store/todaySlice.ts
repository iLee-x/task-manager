import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

function todayKey() {
  return new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'
}

interface TodayState {
  date: string
  subtaskIds: string[]
}

function loadInitial(): TodayState {
  try {
    const raw = localStorage.getItem('task-manager-today')
    if (raw) {
      // Support old shape: if 'taskIds' is present but no 'subtaskIds', we'll reset.
      const parsed = JSON.parse(raw) as any
      if (parsed.date === todayKey() && Array.isArray(parsed.subtaskIds)) {
        return { date: parsed.date, subtaskIds: parsed.subtaskIds }
      }
    }
  } catch { /* ignore */ }
  return { date: todayKey(), subtaskIds: [] }
}

const todaySlice = createSlice({
  name: 'today',
  initialState: loadInitial(),
  reducers: {
    toggleToday(state, action: PayloadAction<string>) {
      // Reset if date changed
      if (state.date !== todayKey()) {
        state.date = todayKey()
        state.subtaskIds = []
      }
      const id = action.payload
      const idx = state.subtaskIds.indexOf(id)
      if (idx >= 0) {
        state.subtaskIds.splice(idx, 1)
      } else {
        state.subtaskIds.push(id)
      }
    },
    removeFromToday(state, action: PayloadAction<string>) {
      state.subtaskIds = state.subtaskIds.filter((id) => id !== action.payload)
    },
    clearToday(state) {
      state.subtaskIds = []
      state.date = todayKey()
    },
  },
})

export const { toggleToday, removeFromToday, clearToday } = todaySlice.actions
export default todaySlice.reducer
