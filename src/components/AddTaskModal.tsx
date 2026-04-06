import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import { addTask } from '@/store/tasksSlice'

interface Props {
  onClose: () => void
}

export default function AddTaskModal({ onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>()
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const title = (data.get('title') as string).trim()
    if (!title) { setError('Title is required'); return }
    const description = (data.get('description') as string).trim()
    const subtaskLines = (data.get('subtasks') as string).split('\n').map((s) => s.trim()).filter(Boolean)
    dispatch(addTask({
      _id: crypto.randomUUID(),
      title,
      description,
      subtasks: subtaskLines.map((t) => ({ _id: crypto.randomUUID(), title: t, done: false })),
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
    onClose()
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.65)',
    border: '1px solid rgba(255,255,255,0.75)',
    backdropFilter: 'blur(8px)',
  }
  const inputFocusClass = 'outline-none focus:ring-2 focus:ring-indigo-300/40 focus:border-indigo-300/60'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}>
      <div className="glass-modal w-full max-w-md rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.85), rgba(139,92,246,0.85))', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">New Task</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              name="title"
              type="text"
              autoFocus
              placeholder="What needs to be done?"
              onChange={() => setError('')}
              style={inputStyle}
              className={`w-full rounded-xl px-4 py-2.5 text-sm text-gray-900 transition-all ${inputFocusClass}`}
            />
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">Description</label>
            <textarea
              name="description"
              rows={2}
              placeholder="Optional notes..."
              style={inputStyle}
              className={`w-full rounded-xl px-4 py-2.5 text-sm text-gray-900 transition-all resize-none ${inputFocusClass}`}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Subtasks <span className="normal-case font-normal text-gray-300">(one per line)</span>
            </label>
            <textarea
              name="subtasks"
              rows={4}
              placeholder={'Design mockup\nWrite the API\nDeploy to production'}
              style={inputStyle}
              className={`w-full rounded-xl px-4 py-2.5 text-sm text-gray-900 transition-all resize-none font-mono ${inputFocusClass}`}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-gray-500 transition-all hover:bg-white/50"
              style={{ background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.65)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
