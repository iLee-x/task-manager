import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import type { RootState, AppDispatch } from '@/store'
import { clearToday } from '@/store/todaySlice'
import SubtaskRow from '@/components/SubtaskRow'
import CoinToast from '@/components/CoinToast'
import type { ToastData } from '@/components/CoinToast'
import { useState } from 'react'
import type { Task, Subtask } from '@/types'

export default function Today() {
  const tasks = useSelector((s: RootState) => s.tasks)
  const todaySubtaskIds = useSelector((s: RootState) => s.today.subtaskIds)
  const dispatch = useDispatch<AppDispatch>()
  const [toast, setToast] = useState<ToastData | null>(null)

  // Group subtasks by task
  const tasksWithTodaySubtasks = tasks
    .filter(t => !t.archived)
    .map(t => ({
      ...t,
      subtasks: t.subtasks.filter(st => todaySubtaskIds.includes(st._id))
    }))
    .filter(t => t.subtasks.length > 0)

  const flatTodaySubtasks = tasksWithTodaySubtasks.flatMap(t => t.subtasks)
  const totalSubtasks = flatTodaySubtasks.length
  const doneSubtasks = flatTodaySubtasks.filter((st) => st.done).length
  const progress = totalSubtasks === 0 ? 0 : Math.round((doneSubtasks / totalSubtasks) * 100)

  const now = new Date()
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  function getGreeting() {
    const hour = now.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  function getMotivation() {
    if (totalSubtasks === 0) return "Add some priority subtasks to your focus for today!"
    if (progress === 100) return "🎉 All focused tasks complete! You're amazing!"
    if (progress >= 75) return "Almost there! Keep pushing! 💪"
    if (progress >= 50) return "Halfway done — great momentum! 🚀"
    if (progress > 0) return "Great start! Keep the flow going ✨"
    return "Let's make today count! ⚡"
  }

  return (
    <main className="flex-1 px-4 py-8">
      <div className="mx-auto max-w-4xl">

        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 transition-colors mb-6">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to all tasks
        </Link>

        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-indigo-500 mb-1">{formattedDate}</p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                {getGreeting()} <span className="inline-block animate-[wave_1.5s_ease-in-out_infinite]">👋</span>
              </h1>
              <p className="mt-2 text-sm text-gray-400">{getMotivation()}</p>
            </div>

            {totalSubtasks > 0 && (
              <button
                onClick={() => dispatch(clearToday())}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-gray-400 transition-all hover:text-red-500 hover:bg-red-50/50"
                style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)' }}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Clear all
              </button>
            )}
          </div>

          {totalSubtasks > 0 && (
            <div className="glass-panel mt-5 rounded-2xl p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400">Today's progress</span>
                  <span className={`font-semibold ${progress === 100 ? 'text-emerald-500' : 'text-indigo-600'}`}>{progress}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${progress}%`,
                      background: progress === 100
                        ? 'linear-gradient(90deg, #34d399, #10b981)'
                        : 'linear-gradient(90deg, #818cf8, #a78bfa)',
                    }}
                  />
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-2xl font-bold text-gray-800">
                  {doneSubtasks}<span className="text-sm font-normal text-gray-400">/{totalSubtasks}</span>
                </p>
                <p className="text-xs text-gray-400">subtasks done</p>
              </div>
            </div>
          )}

          {totalSubtasks > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#4f46e5' }}
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {totalSubtasks} subtask{totalSubtasks !== 1 ? 's' : ''} for today
              </span>
              {progress === 100 && (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', color: '#059669' }}
                >
                  ✓ All complete!
                </span>
              )}
            </div>
          )}
        </div>

        {totalSubtasks === 0 ? (
          <div className="glass-panel flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/80 py-24 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <svg className="h-10 w-10 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-400">No subtasks selected for today</p>
            <p className="mt-1 text-xs text-gray-300 max-w-xs">
              Go to your task list and tap the ... menu on any subtask to add it to today's focus
            </p>
            <Link
              to="/"
              className="mt-6 flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              Browse tasks
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {tasksWithTodaySubtasks.map((task) => (
              <div key={task._id} className="glass-card rounded-2xl p-5 group">
                <div className="mb-3 border-b border-gray-100/60 pb-3">
                  <h3 className="text-base font-semibold text-gray-800">{task.title}</h3>
                  {task.description && (
                    <p className="mt-0.5 text-sm text-gray-400 line-clamp-1">{task.description}</p>
                  )}
                </div>
                <ul className="space-y-1">
                   {task.subtasks.map(st => (
                     <SubtaskRow key={st._id} taskId={task._id} subtask={st} />
                   ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <CoinToast toast={toast} />
      </div>
    </main>
  )
}
