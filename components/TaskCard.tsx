'use client'

import { useState, useTransition } from 'react'
import { toggleSubtask, addSubtask, archiveTask } from '@/app/actions'
import type { Task } from '@/types'

interface Props {
  task: Task
}

export default function TaskCard({ task }: Props) {
  const [isPending, startTransition] = useTransition()
  const [newSubtask, setNewSubtask] = useState('')
  const [showInput, setShowInput] = useState(false)

  const total = task.subtasks.length
  const done = task.subtasks.filter((s) => s.done).length
  const progress = total === 0 ? 0 : Math.round((done / total) * 100)

  const isComplete = total > 0 && done === total

  function handleToggle(subtaskId: string, currentDone: boolean) {
    startTransition(() => toggleSubtask(task._id, subtaskId, !currentDone))
  }

  function handleAddSubtask() {
    const title = newSubtask.trim()
    if (!title) return
    startTransition(async () => {
      await addSubtask(task._id, title)
      setNewSubtask('')
      setShowInput(false)
    })
  }

  function handleArchive() {
    startTransition(() => archiveTask(task._id))
  }

  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm transition-opacity ${isPending ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">{task.description}</p>
          )}
        </div>
        {isComplete && (
          <button
            onClick={handleArchive}
            title="Archive task"
            className="shrink-0 rounded-lg bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
          >
            Archive
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{done}/{total} subtasks</span>
          <span className={`font-medium ${isComplete ? 'text-green-600' : 'text-blue-600'}`}>
            {progress}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Subtasks */}
      {task.subtasks.length > 0 && (
        <ul className="mt-4 space-y-2">
          {task.subtasks.map((subtask) => (
            <li key={subtask._id} className="flex items-center gap-3">
              <button
                onClick={() => handleToggle(subtask._id, subtask.done)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  subtask.done
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                {subtask.done && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className={`text-sm ${subtask.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                {subtask.title}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Add subtask */}
      <div className="mt-4">
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
              placeholder="Subtask title..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button
              onClick={handleAddSubtask}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add
            </button>
            <button
              onClick={() => { setShowInput(false); setNewSubtask('') }}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add subtask
          </button>
        )}
      </div>
    </div>
  )
}
