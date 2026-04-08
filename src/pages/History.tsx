import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

type ViewMode = 'day' | 'week' | 'month'

interface ArchivedTask {
  _id: string
  title: string
  archivedAt: string
  coinsEarned?: number
}

interface Group {
  key: string
  label: string
  sublabel?: string
  tasks: ArchivedTask[]
  totalCoins: number
}

function localDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00')
}

function dayLabel(dateStr: string) {
  const d = localDate(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (dateStr === today.toLocaleDateString('en-CA')) return 'Today'
  if (dateStr === yesterday.toLocaleDateString('en-CA')) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function weekKey(dateStr: string) {
  const d = localDate(dateStr)
  const dow = d.getDay() // 0=Sun
  const mon = new Date(d)
  mon.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1))
  return mon.toLocaleDateString('en-CA')
}

function weekLabel(monKey: string) {
  const mon = localDate(monKey)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(mon)} – ${fmt(sun)}, ${sun.getFullYear()}`
}

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7)
}

function monthLabel(mk: string) {
  return localDate(mk + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function buildGroups(tasks: ArchivedTask[], mode: ViewMode): Group[] {
  const map = new Map<string, ArchivedTask[]>()
  for (const t of tasks) {
    const k = mode === 'day' ? t.archivedAt : mode === 'week' ? weekKey(t.archivedAt) : monthKey(t.archivedAt)
    if (!map.has(k)) map.set(k, [])
    map.get(k)!.push(t)
  }

  return [...map.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, ts]) => {
      const label =
        mode === 'day' ? dayLabel(key) :
        mode === 'week' ? weekLabel(key) :
        monthLabel(key)
      const sublabel =
        mode === 'day'
          ? localDate(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : undefined
      return {
        key,
        label,
        sublabel,
        tasks: ts.slice().sort((a, b) => (a.archivedAt < b.archivedAt ? 1 : -1)),
        totalCoins: ts.reduce((sum, t) => sum + (t.coinsEarned ?? 0), 0),
      }
    })
}

const VIEW_MODES: { id: ViewMode; label: string }[] = [
  { id: 'day',   label: 'Day'   },
  { id: 'week',  label: 'Week'  },
  { id: 'month', label: 'Month' },
]

export default function History() {
  const tasks = useSelector((s: RootState) => s.tasks)
  const [mode, setMode] = useState<ViewMode>('day')

  const archivedTasks: ArchivedTask[] = useMemo(
    () =>
      tasks
        .filter((t) => t.archived && t.archivedAt)
        .map((t) => ({ _id: t._id, title: t.title, archivedAt: t.archivedAt!, coinsEarned: t.coinsEarned })),
    [tasks],
  )

  const groups = useMemo(() => buildGroups(archivedTasks, mode), [archivedTasks, mode])

  const totalTasks = archivedTasks.length
  const totalCoins = archivedTasks.reduce((s, t) => s + (t.coinsEarned ?? 0), 0)

  return (
    <main className="flex-1 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-6">

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to tasks
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">History</h1>
            <p className="mt-1 text-sm text-gray-400">
              {totalTasks} task{totalTasks !== 1 ? 's' : ''} completed · {totalCoins} coins earned
            </p>
          </div>

          {/* View mode segmented control */}
          <div
            className="flex rounded-2xl p-1 gap-1"
            style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)' }}
          >
            {VIEW_MODES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className="rounded-xl px-4 py-1.5 text-sm font-semibold transition-all"
                style={
                  mode === id
                    ? {
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
                      }
                    : { color: '#6b7280' }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {groups.length === 0 && (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/80 py-24 text-center"
            style={{ background: 'rgba(255,255,255,0.35)' }}
          >
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.5)' }}
            >
              <svg className="h-8 w-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-400">No history yet</p>
            <p className="mt-1 text-xs text-gray-300 max-w-xs">
              Complete and archive tasks to start building your history.
            </p>
          </div>
        )}

        {/* Groups */}
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group.key}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
            >
              {/* Group header */}
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{ background: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.6)' }}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-700">{group.label}</p>
                  {group.sublabel && mode !== 'day' && (
                    <p className="text-xs text-gray-400 mt-0.5">{group.sublabel}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {group.tasks.length} task{group.tasks.length !== 1 ? 's' : ''}
                  </span>
                  {group.totalCoins > 0 && (
                    <span
                      className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#b45309' }}
                    >
                      🪙 {group.totalCoins}
                    </span>
                  )}
                </div>
              </div>

              {/* Task rows */}
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.5)' }}>
                {group.tasks.map((task) => (
                  <div key={task._id} className="flex items-center gap-3 px-5 py-3">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                      style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', color: '#059669' }}
                    >
                      ✓
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{task.title}</p>
                      {mode !== 'day' && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {localDate(task.archivedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                    </div>

                    {task.coinsEarned != null ? (
                      <span
                        className="shrink-0 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#b45309' }}
                      >
                        🪙 {task.coinsEarned}
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs text-gray-300">—</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
