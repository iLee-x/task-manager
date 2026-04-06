import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { renameTask, addSubtask, archiveTask, deleteTask } from '@/store/tasksSlice'
import { applyCoins } from '@/store/gameSlice'
import { calcCoins } from '@/lib/gameData'
import type { Task } from '@/types'
import type { ToastData } from './CoinToast'
import SubtaskRow from './SubtaskRow'

interface Props {
  task: Task
  onToast: (t: ToastData) => void
}

export default function TaskCard({ task, onToast }: Props) {
  const dispatch = useDispatch<AppDispatch>()
  const game = useSelector((s: RootState) => s.game)

  const [newSubtask, setNewSubtask] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(task.title)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const total = task.subtasks.length
  const done = task.subtasks.filter((s) => s.done).length
  const progress = total === 0 ? 0 : Math.round((done / total) * 100)
  const isComplete = total > 0 && done === total

  useEffect(() => {
    if (editingTitle) titleInputRef.current?.select()
  }, [editingTitle])

  function commitTitle() {
    const trimmed = titleDraft.trim()
    if (trimmed && trimmed !== task.title) dispatch(renameTask({ taskId: task._id, title: trimmed }))
    else setTitleDraft(task.title)
    setEditingTitle(false)
  }

  function handleAddSubtask() {
    const title = newSubtask.trim()
    if (!title) return
    dispatch(addSubtask({ taskId: task._id, subtask: { _id: crypto.randomUUID(), title, done: false } }))
    setNewSubtask('')
    setShowInput(false)
  }

  function handleArchive() {
    const result = calcCoins(game)
    dispatch(applyCoins({
      baseCoins: result.baseCoins,
      bonusCoins: result.bonusCoins,
      streak: result.streak,
      todayKey: result.todayKey,
      lastStreakBonus: result.bonusCoins > 0 ? result.streak : game.lastStreakBonus,
    }))
    dispatch(archiveTask(task._id))
    onToast({ baseCoins: result.baseCoins, bonusCoins: result.bonusCoins, bonusReason: result.bonusReason, key: Date.now() })
  }

  const progressGradient = isComplete
    ? 'linear-gradient(90deg, #34d399, #10b981)'
    : progress > 50
    ? 'linear-gradient(90deg, #818cf8, #a78bfa)'
    : 'linear-gradient(90deg, #60a5fa, #818cf8)'

  return (
    <div className={`glass-card group rounded-2xl p-5 transition-all has-[.subtask-menu-open]:z-50 has-[.subtask-menu-open]:relative ${isComplete ? 'ring-1 ring-emerald-200/60' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <input
              ref={titleInputRef}
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitTitle()
                if (e.key === 'Escape') { setTitleDraft(task.title); setEditingTitle(false) }
              }}
              className="w-full rounded-xl border border-indigo-300/50 bg-indigo-50/60 px-2 py-0.5 text-base font-semibold text-gray-900 outline-none ring-2 ring-indigo-200/60 backdrop-blur-sm"
            />
          ) : (
            <div className="flex items-center gap-1.5 group/title">
              <h3
                className="truncate text-base font-semibold text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => setEditingTitle(true)}
                title="Click to edit"
              >
                {task.title}
              </h3>
              <button
                onClick={() => setEditingTitle(true)}
                className="opacity-0 group-hover/title:opacity-100 transition-opacity text-gray-300 hover:text-indigo-400"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          )}
          {task.description && (
            <p className="mt-0.5 text-sm text-gray-400 line-clamp-2">{task.description}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {isComplete && (
            <button
              onClick={handleArchive}
              className="flex items-center gap-1 rounded-xl px-3 py-1 text-xs font-semibold transition-all hover:scale-105"
              style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', color: '#059669' }}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Archive
            </button>
          )}
          <button
            onClick={() => { if (confirm('Delete this task?')) dispatch(deleteTask(task._id)) }}
            className="rounded-xl border border-gray-200/60 p-1 text-gray-300 hover:border-red-200 hover:text-red-400 transition-colors bg-white/30"
            title="Delete task"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-400">{done}/{total} subtasks</span>
          <span className={`font-semibold ${isComplete ? 'text-emerald-500' : 'text-indigo-500'}`}>{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: progressGradient }}
          />
        </div>
      </div>

      {task.subtasks.length > 0 && (
        <ul className="mt-4 space-y-1">
          {task.subtasks.map((subtask) => (
            <SubtaskRow key={subtask._id} taskId={task._id} subtask={subtask} />
          ))}
        </ul>
      )}

      <div className="mt-3">
        {showInput ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddSubtask()
                if (e.key === 'Escape') { setShowInput(false); setNewSubtask('') }
              }}
              placeholder="New subtask..."
              className="flex-1 rounded-xl px-3 py-1.5 text-sm outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}
            />
            <button onClick={handleAddSubtask} className="rounded-xl px-3 py-1.5 text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>Add</button>
            <button onClick={() => { setShowInput(false); setNewSubtask('') }} className="rounded-xl border border-gray-200/60 px-3 py-1.5 text-sm text-gray-500 hover:bg-white/40 bg-white/30">✕</button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add subtask
          </button>
        )}
      </div>
    </div>
  )
}
