import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { useT } from '@/i18n/LanguageContext'
import { LOCALE_MAP } from '@/i18n/translations'

type ViewMode = 'day' | 'week' | 'month'
type ItemType = 'task' | 'subtask'

interface HistoryItem {
  type: ItemType
  _id: string
  title: string
  parentTitle?: string
  date: string
  coinsEarned?: number
}

interface Group {
  key: string
  label: string
  items: HistoryItem[]
  totalCoins: number
}

function localDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00')
}

function todayStr() {
  return new Date().toLocaleDateString('en-CA')
}

function weekKey(dateStr: string) {
  const d = localDate(dateStr)
  const mon = new Date(d)
  const dow = d.getDay()
  mon.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1))
  return mon.toLocaleDateString('en-CA')
}

function monthKey(dateStr: string) { return dateStr.slice(0, 7) }

function buildGroups(items: HistoryItem[], mode: ViewMode, locale: string, todayLabel: string, yesterdayLabel: string): Group[] {
  const yest = new Date()
  yest.setDate(yest.getDate() - 1)
  const yesterdayStr = yest.toLocaleDateString('en-CA')

  function dayLabel(dateStr: string) {
    if (dateStr === todayStr()) return todayLabel
    if (dateStr === yesterdayStr) return yesterdayLabel
    return localDate(dateStr).toLocaleDateString(locale, {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    })
  }

  function weekLabel(monKey: string) {
    const mon = localDate(monKey)
    const sun = new Date(mon)
    sun.setDate(mon.getDate() + 6)
    const fmt = (d: Date) => d.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
    return `${fmt(mon)} – ${fmt(sun)}, ${sun.getFullYear()}`
  }

  function monthLabel(mk: string) {
    return localDate(mk + '-01').toLocaleDateString(locale, { month: 'long', year: 'numeric' })
  }

  const map = new Map<string, HistoryItem[]>()
  for (const item of items) {
    const k =
      mode === 'day' ? item.date :
      mode === 'week' ? weekKey(item.date) :
      monthKey(item.date)
    if (!map.has(k)) map.set(k, [])
    map.get(k)!.push(item)
  }

  return [...map.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, its]) => ({
      key,
      label: mode === 'day' ? dayLabel(key) : mode === 'week' ? weekLabel(key) : monthLabel(key),
      items: its.slice().sort((a, b) => (a.date < b.date ? 1 : -1)),
      totalCoins: its.reduce((s, i) => s + (i.coinsEarned ?? 0), 0),
    }))
}

export default function History() {
  const tasks = useSelector((s: RootState) => s.tasks)
  const [mode, setMode] = useState<ViewMode>('day')
  const { t, lang } = useT()
  const locale = LOCALE_MAP[lang]

  const VIEW_MODES: { id: ViewMode; label: string }[] = [
    { id: 'day',   label: t.history.day   },
    { id: 'week',  label: t.history.week  },
    { id: 'month', label: t.history.month },
  ]

  const allItems: HistoryItem[] = useMemo(() => {
    const items: HistoryItem[] = []

    for (const task of tasks) {
      if (task.archived && task.archivedAt) {
        items.push({
          type: 'task',
          _id: task._id,
          title: task.title,
          date: task.archivedAt,
          coinsEarned: task.coinsEarned,
        })
      }

      for (const sub of task.subtasks) {
        if (sub.done && sub.completedAt) {
          items.push({
            type: 'subtask',
            _id: sub._id,
            title: sub.title,
            parentTitle: task.title,
            date: sub.completedAt,
          })
        }
      }
    }

    return items
  }, [tasks])

  const groups = useMemo(
    () => buildGroups(allItems, mode, locale, t.history.todayLabel, t.history.yesterdayLabel),
    [allItems, mode, locale, t.history.todayLabel, t.history.yesterdayLabel]
  )

  const taskCount = allItems.filter((i) => i.type === 'task').length
  const subtaskCount = allItems.filter((i) => i.type === 'subtask').length
  const totalCoins = allItems.reduce((s, i) => s + (i.coinsEarned ?? 0), 0)

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
          {t.history.backToTasks}
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">{t.history.title}</h1>
            <p className="mt-1 text-sm text-gray-400">
              {t.history.tasks(taskCount)}
              {subtaskCount > 0 && ` · ${t.history.subtasksCount(subtaskCount)}`}
              {totalCoins > 0 && ` · 🪙 ${totalCoins} ${t.history.coinsEarned}`}
            </p>
          </div>

          {/* Segmented control */}
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
                    ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', boxShadow: '0 2px 8px rgba(99,102,241,0.35)' }
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
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <svg className="h-8 w-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-400">{t.history.noHistory}</p>
            <p className="mt-1 text-xs text-gray-300 max-w-xs">{t.history.noHistoryHint}</p>
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
                <p className="text-sm font-semibold text-gray-700">{group.label}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {t.history.items(group.items.length)}
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

              {/* Items */}
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.5)' }}>
                {group.items.map((item) => (
                  <div key={item.type + item._id} className="flex items-center gap-3 px-5 py-3">

                    {/* Icon: task vs subtask */}
                    {item.type === 'task' ? (
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                        style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.28)', color: '#059669' }}
                      >
                        ✓
                      </div>
                    ) : (
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                        style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.25)' }}
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* Title + parent */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{item.title}</p>
                      {item.type === 'subtask' && item.parentTitle && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {t.history.inParent(item.parentTitle)}
                        </p>
                      )}
                      {mode !== 'day' && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {localDate(item.date).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                    </div>

                    {/* Type badge */}
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={
                        item.type === 'task'
                          ? { background: 'rgba(52,211,153,0.1)', color: '#059669' }
                          : { background: 'rgba(99,102,241,0.1)', color: '#4f46e5' }
                      }
                    >
                      {item.type === 'task' ? t.history.taskLabel : t.history.subtaskLabel}
                    </span>

                    {/* Coins (tasks only) */}
                    {item.coinsEarned != null ? (
                      <span
                        className="shrink-0 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#b45309' }}
                      >
                        🪙 {item.coinsEarned}
                      </span>
                    ) : item.type === 'task' ? (
                      <span className="shrink-0 text-xs text-gray-300">—</span>
                    ) : null}
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
