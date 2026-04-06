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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
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
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-colors"
            />
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">Description</label>
            <textarea
              name="description"
              rows={2}
              placeholder="Optional notes..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-colors resize-none"
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
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-colors resize-none font-mono"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-md shadow-indigo-200"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
