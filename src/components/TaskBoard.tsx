import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import type { RootState } from '@/store'
import TaskCard from './TaskCard'
import MindmapView from './MindmapView'
import AddTaskModal from './AddTaskModal'
import ArchivedSection from './ArchivedSection'
import CoinToast from './CoinToast'
import type { ToastData } from './CoinToast'
import { useT } from '@/i18n/LanguageContext'

type View = 'list' | 'mindmap'

export default function TaskBoard() {
  const tasks = useSelector((s: RootState) => s.tasks)
  const coins = useSelector((s: RootState) => s.game.coins)
  const [showModal, setShowModal] = useState(false)
  const [view, setView] = useState<View>(() => {
    return (localStorage.getItem('task-manager-view') as View) || 'list'
  })
  const [toast, setToast] = useState<ToastData | null>(null)
  const { t } = useT()

  useEffect(() => {
    localStorage.setItem('task-manager-view', view)
  }, [view])

  const active = tasks.filter((t) => !t.archived)
  const archived = tasks.filter((t) => t.archived)

  const totalSubtasks = active.reduce((s, t) => s + t.subtasks.length, 0)
  const doneSubtasks = active.reduce((s, t) => s + t.subtasks.filter((st) => st.done).length, 0)
  const overallProgress = totalSubtasks === 0 ? 0 : Math.round((doneSubtasks / totalSubtasks) * 100)

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">{t.taskBoard.title}</h1>
            <p className="mt-1 text-sm text-gray-400">
              {totalSubtasks === 0 ? t.taskBoard.noSubtasksYet : t.taskBoard.subtasksComplete(doneSubtasks, totalSubtasks)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/stats"
              className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'rgba(251,191,36,0.18)', border: '1px solid rgba(251,191,36,0.35)', color: '#b45309' }}
            >
              🪙 {coins}
            </Link>

            <div className="flex items-center rounded-2xl p-1" style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)' }}>
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${view === 'list' ? 'text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                style={view === 'list' ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
                {t.taskBoard.list}
              </button>
              <button
                onClick={() => setView('mindmap')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${view === 'mindmap' ? 'text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                style={view === 'mindmap' ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="19" cy="18" r="2"/>
                  <path strokeLinecap="round" d="M7 12h4m2-6h2m-2 6h2m-2 6h2M11 12c0-3 2-5 4-5.5M11 12c0 3 2 5 4 5.5"/>
                </svg>
                {t.taskBoard.map}
              </button>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              {t.taskBoard.newTask}
            </button>
          </div>
        </div>

        {totalSubtasks > 0 && (
          <div className="glass-panel mt-5 rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-400">{t.taskBoard.overallProgress}</span>
                <span className="font-semibold text-indigo-600">{overallProgress}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${overallProgress}%`, background: 'linear-gradient(90deg, #818cf8, #a78bfa)' }}
                />
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-2xl font-bold text-gray-800">{doneSubtasks}<span className="text-sm font-normal text-gray-400">/{totalSubtasks}</span></p>
              <p className="text-xs text-gray-400">{t.taskBoard.subtasksDone}</p>
            </div>
          </div>
        )}
      </div>

      {active.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/80 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'rgba(255,255,255,0.5)' }}>
            <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-400">{t.taskBoard.noTasksYet}</p>
          <p className="mt-1 text-xs text-gray-300">{t.taskBoard.getStarted}</p>
        </div>
      ) : view === 'list' ? (
        <div className="space-y-3">
          {active.map((task) => <TaskCard key={task._id} task={task} onToast={setToast} />)}
        </div>
      ) : (
        <MindmapView tasks={active} onToast={setToast} />
      )}

      <ArchivedSection tasks={archived} />

      {showModal && <AddTaskModal onClose={() => setShowModal(false)} />}
      <CoinToast toast={toast} />
    </>
  )
}
