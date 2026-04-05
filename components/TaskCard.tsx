'use client'

import { useState, useRef, useEffect } from 'react'
import type { Task } from '@/types'

interface Props {
  task: Task
  onRenameTask: (taskId: string, title: string) => void
  onRenameSubtask: (taskId: string, subtaskId: string, title: string) => void
  onToggleSubtask: (taskId: string, subtaskId: string) => void
  onAddSubtask: (taskId: string, title: string) => void
  onArchive: (taskId: string) => void
  onDelete: (taskId: string) => void
}

export default function TaskCard({ task, onRenameTask, onRenameSubtask, onToggleSubtask, onAddSubtask, onArchive, onDelete }: Props) {
  const [newSubtask, setNewSubtask] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(task.title)
  const [editingSubtask, setEditingSubtask] = useState<string | null>(null)
  const [subtaskDraft, setSubtaskDraft] = useState('')
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
    if (trimmed && trimmed !== task.title) onRenameTask(task._id, trimmed)
    else setTitleDraft(task.title)
    setEditingTitle(false)
  }

  function startEditSubtask(subtaskId: string, currentTitle: string) {
    setEditingSubtask(subtaskId)
    setSubtaskDraft(currentTitle)
  }

  function commitSubtask(subtaskId: string) {
    const trimmed = subtaskDraft.trim()
    const original = task.subtasks.find((s) => s._id === subtaskId)?.title ?? ''
    if (trimmed && trimmed !== original) onRenameSubtask(task._id, subtaskId, trimmed)
    setEditingSubtask(null)
  }

  function handleAddSubtask() {
    const title = newSubtask.trim()
    if (!title) return
    onAddSubtask(task._id, title)
    setNewSubtask('')
    setShowInput(false)
  }

  const progressColor = isComplete
    ? 'from-emerald-400 to-green-500'
    : progress > 50
    ? 'from-indigo-400 to-violet-500'
    : 'from-indigo-400 to-blue-500'

  return (
    <div className={`group rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${isComplete ? 'border-emerald-100' : 'border-gray-100'}`}>
      {/* Header */}
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
              className="w-full rounded-lg border border-indigo-300 bg-indigo-50 px-2 py-0.5 text-base font-semibold text-gray-900 outline-none ring-2 ring-indigo-200"
            />
          ) : (
            <div className="flex items-center gap-1.5 group/title">
              <h3
                className="truncate text-base font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
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
              onClick={() => onArchive(task._id)}
              className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-100"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Archive
            </button>
          )}
          <button
            onClick={() => { if (confirm('Delete this task?')) onDelete(task._id) }}
            className="rounded-lg border border-gray-200 p-1 text-gray-300 hover:border-red-200 hover:text-red-400 transition-colors"
            title="Delete task"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-400">{done}/{total} subtasks</span>
          <span className={`font-semibold ${isComplete ? 'text-emerald-500' : 'text-indigo-500'}`}>{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Subtasks */}
      {task.subtasks.length > 0 && (
        <ul className="mt-4 space-y-1">
          {task.subtasks.map((subtask) => (
            <li
              key={subtask._id}
              className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <button
                onClick={() => onToggleSubtask(task._id, subtask._id)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  subtask.done
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-gray-200 hover:border-indigo-400'
                }`}
              >
                {subtask.done && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
                  className="flex-1 min-w-0 rounded-lg border border-indigo-300 bg-indigo-50 px-2 py-0.5 text-sm outline-none ring-1 ring-indigo-100"
                />
              ) : (
                <span
                  onClick={() => !subtask.done && startEditSubtask(subtask._id, subtask.title)}
                  className={`flex-1 text-sm select-none transition-colors ${
                    subtask.done
                      ? 'text-gray-300 line-through'
                      : 'text-gray-600 cursor-pointer hover:text-indigo-600'
                  }`}
                >
                  {subtask.title}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Add subtask */}
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
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:bg-white"
            />
            <button onClick={handleAddSubtask} className="rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">Add</button>
            <button onClick={() => { setShowInput(false); setNewSubtask('') }} className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50">✕</button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
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
