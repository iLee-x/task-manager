import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './tasksSlice'
import gameReducer from './gameSlice'
import type { Middleware } from '@reduxjs/toolkit'

const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action)
  const state = store.getState() as { tasks: unknown; game: unknown }
  localStorage.setItem('task-manager-tasks', JSON.stringify(state.tasks))
  localStorage.setItem('task-manager-game', JSON.stringify(state.game))
  return result
}

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
