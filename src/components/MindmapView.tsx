import { useRef, useLayoutEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import { renameTask, renameSubtask, toggleSubtask, addSubtask, archiveTask, deleteTask } from '@/store/tasksSlice'
import { applyCoins } from '@/store/gameSlice'
import { calcCoins } from '@/lib/gameData'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import type { Task } from '@/types'
import type { ToastData } from './CoinToast'

interface Props {
  tasks: Task[]
  onToast: (t: ToastData) => void
}

function MindmapNode({ task, onToast }: { task: Task; onToast: (t: ToastData) => void }) {
  const dispatch = useDispatch<AppDispatch>()
  const game = useSelector((s: RootState) => s.game)
  const containerRef = useRef<HTMLDivElement>(null)
  const taskNodeRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const subtaskRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(task.title)
  const [editingSubtask, setEditingSubtask] = useState<string | null>(null)
  const [subtaskDraft, setSubtaskDraft] = useState('')
  const [showAddInput, setShowAddInput] = useState(false)
  const [newSubtask, setNewSubtask] = useState('')

  const total = task.subtasks.length
  const done = task.subtasks.filter((s) => s.done).length
  const progress = total === 0 ? 0 : Math.round((done / total) * 100)
  const isComplete = total > 0 && done === total

  useLayoutEffect(() => {
    const svg = svgRef.current
    const container = containerRef.current
    const taskNode = taskNodeRef.current
    if (!svg || !container || !taskNode) return

    svg.innerHTML = ''
    if (subtaskRefs.current.size === 0) return

    const box = container.getBoundingClientRect()
    const tr = taskNode.getBoundingClientRect()
    const ns = 'http://www.w3.org/2000/svg'

    subtaskRefs.current.forEach((el, subtaskId) => {
      if (!el) return
      const sr = el.getBoundingClientRect()
      const x1 = tr.right - box.left
      const y1 = tr.top + tr.height / 2 - box.top
      const x2 = sr.left - box.left
      const y2 = sr.top + sr.height / 2 - box.top
      const cx = x1 + (x2 - x1) * 0.5
      const subtask = task.subtasks.find((s) => s._id === subtaskId)
      const color = subtask?.done ? '#6ee7b7' : '#a5b4fc'
      const path = document.createElementNS(ns, 'path')
      path.setAttribute('d', `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`)
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', color)
      path.setAttribute('stroke-width', '2')
      path.setAttribute('stroke-linecap', 'round')
      svg.appendChild(path)
    })
  })

  function commitTitle() {
    const trimmed = titleDraft.trim()
    if (trimmed && trimmed !== task.title) dispatch(renameTask({ taskId: task._id, title: trimmed }))
    else setTitleDraft(task.title)
    setEditingTitle(false)
  }

  function commitSubtask(subtaskId: string) {
    const trimmed = subtaskDraft.trim()
    const original = task.subtasks.find((s) => s._id === subtaskId)?.title ?? ''
    if (trimmed && trimmed !== original) dispatch(renameSubtask({ taskId: task._id, subtaskId, title: trimmed }))
    setEditingSubtask(null)
  }

  function handleAddSubtask() {
    const title = newSubtask.trim()
    if (!title) return
    dispatch(addSubtask({ taskId: task._id, subtask: { _id: crypto.randomUUID(), title, done: false } }))
    setNewSubtask('')
    setShowAddInput(false)
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

  return (
    <div ref={containerRef} className="relative flex items-center py-3">
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      />

      <div
        ref={taskNodeRef}
        className={`relative z-10 w-52 shrink-0 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
          isComplete ? 'border-emerald-200 bg-emerald-50/30' : 'border-indigo-100'
        }`}
      >
        {editingTitle ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitTitle()
              if (e.key === 'Escape') { setTitleDraft(task.title); setEditingTitle(false) }
            }}
            className="w-full rounded-lg border border-indigo-300 bg-white px-2 py-0.5 text-sm font-semibold text-gray-800 outline-none ring-2 ring-indigo-100"
          />
        ) : (
          <div className="group/title flex items-center gap-1">
            <h3
              onClick={() => setEditingTitle(true)}
              className="truncate text-sm font-semibold text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors"
            >
              {task.title}
            </h3>
            <button
              onClick={() => setEditingTitle(true)}
              className="shrink-0 opacity-0 group-hover/title:opacity-100 transition-opacity text-gray-300 hover:text-indigo-400"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        )}

        {total > 0 && (
          <div className="mt-2.5">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{done}/{total} done</span>
              <span className={`font-semibold ${isComplete ? 'text-emerald-500' : 'text-indigo-500'}`}>{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-400' : 'bg-gradient-to-r from-indigo-400 to-violet-400'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-2.5 flex gap-1.5">
          {isComplete && (
            <button
              onClick={handleArchive}
              className="flex-1 rounded-lg bg-emerald-100 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-200 transition-colors"
            >
              Archive
            </button>
          )}
          <button
            onClick={() => { if (confirm('Delete this task?')) dispatch(deleteTask(task._id)) }}
            className="rounded-lg border border-gray-200 px-2 py-1 text-gray-300 hover:border-red-200 hover:text-red-400 transition-colors"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="w-20 shrink-0" />

      <div className="relative z-10 flex flex-col gap-2">
        {task.subtasks.map((subtask) => (
          <div
            key={subtask._id}
            ref={(el) => {
              if (el) subtaskRefs.current.set(subtask._id, el)
              else subtaskRefs.current.delete(subtask._id)
            }}
            className={`flex items-center gap-2.5 rounded-xl border bg-white px-3 py-2.5 shadow-sm min-w-[170px] transition-all hover:shadow-md ${
              subtask.done ? 'border-emerald-100 bg-emerald-50/40' : 'border-gray-100'
            }`}
          >
            <button
              onClick={() => dispatch(toggleSubtask({ taskId: task._id, subtaskId: subtask._id }))}
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                subtask.done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-200 hover:border-indigo-400'
              }`}
            >
              {subtask.done && (
                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {editingSubtask === subtask._id ? (
              <input
                autoFocus
                value={subtaskDraft}
                onChange={(e) => setSubtaskDraft(e.target.value)}
                onBlur={() => commitSubtask(subtask._id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitSubtask(subtask._id)
                  if (e.key === 'Escape') setEditingSubtask(null)
                }}
                className="flex-1 min-w-0 rounded border border-indigo-300 bg-white px-1 py-0 text-sm outline-none ring-1 ring-indigo-100"
              />
            ) : (
              <span
                onClick={() => !subtask.done && (setEditingSubtask(subtask._id), setSubtaskDraft(subtask.title))}
                className={`text-sm truncate transition-colors ${
                  subtask.done ? 'text-gray-300 line-through' : 'text-gray-600 cursor-pointer hover:text-indigo-600'
                }`}
              >
                {subtask.title}
              </span>
            )}
          </div>
        ))}

        {showAddInput ? (
          <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-3 py-2 shadow-sm min-w-[170px]">
            <input
              autoFocus
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddSubtask()
                if (e.key === 'Escape') { setShowAddInput(false); setNewSubtask('') }
              }}
              placeholder="New subtask..."
              className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-300"
            />
            <button onClick={handleAddSubtask} className="shrink-0 text-xs font-semibold text-indigo-500 hover:text-indigo-700">Add</button>
            <button onClick={() => { setShowAddInput(false); setNewSubtask('') }} className="shrink-0 text-gray-300 hover:text-gray-500 text-xs">✕</button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddInput(true)}
            className="flex items-center gap-1.5 rounded-xl border border-dashed border-gray-200 px-3 py-2 text-xs font-medium text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors min-w-[170px]"
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

export default function MindmapView({ tasks, onToast }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl">
      <div className="min-w-max space-y-2 pb-4">
        {tasks.map((task) => (
          <MindmapNode key={task._id} task={task} onToast={onToast} />
        ))}
      </div>
    </div>
  )
}
