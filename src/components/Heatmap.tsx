import { useState, useMemo } from 'react'
import type { Task } from '@/types'

const DAYS = 7

function localDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getColor(count: number, inYear: boolean): string {
  if (!inYear) return 'transparent'
  if (count === 0) return '#eef0f3'
  if (count === 1) return '#c7d2fe'
  if (count === 2) return '#818cf8'
  if (count <= 4) return '#6366f1'
  return '#4338ca'
}

interface TooltipState {
  date: string
  count: number
  taskTitles: string[]
  x: number
  y: number
}

interface Props {
  activityLog: Record<string, number>
  tasks: Task[]
}

export default function Heatmap({ activityLog, tasks }: Props) {
  const currentYear = new Date().getFullYear()

  const years = useMemo(() => {
    const fromLog = Object.keys(activityLog).map((k) => parseInt(k.slice(0, 4)))
    return [...new Set([...fromLog, currentYear])].sort((a, b) => b - a)
  }, [activityLog, currentYear])

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const tasksByDate = useMemo(() => {
    const map: Record<string, string[]> = {}
    for (const task of tasks) {
      if (task.archived && task.archivedAt) {
        if (!map[task.archivedAt]) map[task.archivedAt] = []
        map[task.archivedAt].push(task.title)
      }
    }
    return map
  }, [tasks])

  const { grid, weekCount } = useMemo(() => {
    const jan1 = new Date(selectedYear, 0, 1)
    const dec31 = new Date(selectedYear, 11, 31)

    const start = new Date(jan1)
    start.setDate(jan1.getDate() - jan1.getDay())

    const end = new Date(dec31)
    end.setDate(dec31.getDate() + (6 - dec31.getDay()))

    const totalDays = Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1
    const wc = Math.ceil(totalDays / 7)

    const g: { date: string; count: number; inYear: boolean }[][] = []
    const cur = new Date(start)

    for (let w = 0; w < wc; w++) {
      const week: { date: string; count: number; inYear: boolean }[] = []
      for (let d = 0; d < DAYS; d++) {
        const dateStr = localDateStr(cur)
        week.push({
          date: dateStr,
          count: activityLog[dateStr] ?? 0,
          inYear: cur.getFullYear() === selectedYear,
        })
        cur.setDate(cur.getDate() + 1)
      }
      g.push(week)
    }

    return { grid: g, weekCount: wc }
  }, [selectedYear, activityLog])

  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = []
    for (let w = 0; w < weekCount; w++) {
      const d = new Date(grid[w][0].date + 'T12:00:00')
      if (d.getFullYear() === selectedYear && d.getDate() <= 7) {
        labels.push({ label: d.toLocaleString('en-US', { month: 'short' }), col: w })
      }
    }
    return labels
  }, [grid, weekCount, selectedYear])

  const cellSize = 12
  const gap = 3
  const step = cellSize + gap
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>, cell: { date: string; count: number; inYear: boolean }) {
    if (!cell.inYear) return
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({
      date: cell.date,
      count: cell.count,
      taskTitles: tasksByDate[cell.date] ?? [],
      x: rect.left + rect.width / 2,
      y: rect.top,
    })
  }

  const tooltipLabel = tooltip
    ? new Date(tooltip.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div className="overflow-x-auto" onMouseLeave={() => setTooltip(null)}>
      <div className="flex items-center justify-between mb-3">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="text-sm text-gray-600 rounded-lg px-2.5 py-1.5 border border-gray-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div style={{ minWidth: weekCount * step + 36 }}>
        <div className="relative h-5" style={{ paddingLeft: 36 }}>
          {monthLabels.map(({ label, col }, i) => (
            <span key={i} className="absolute text-xs text-gray-400" style={{ left: 36 + col * step }}>
              {label}
            </span>
          ))}
        </div>

        <div className="flex gap-0">
          <div className="flex flex-col pr-2 pt-0.5" style={{ width: 32, gap }}>
            {dayLabels.map((l, i) => (
              <div key={i} className="flex items-center" style={{ height: cellSize, marginBottom: gap }}>
                <span className="text-xs text-gray-400 leading-none">{l}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((cell) => (
                  <div
                    key={cell.date}
                    onMouseEnter={(e) => handleMouseEnter(e, cell)}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: getColor(cell.count, cell.inYear),
                      borderRadius: 2,
                      cursor: cell.inYear && cell.count > 0 ? 'pointer' : 'default',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-3 justify-end">
          <span className="text-xs text-gray-400">Less</span>
          {[0, 1, 2, 3, 5].map((n) => (
            <div key={n} style={{ width: cellSize, height: cellSize, backgroundColor: getColor(n, true), borderRadius: 2 }} />
          ))}
          <span className="text-xs text-gray-400">More</span>
        </div>
      </div>

      {tooltip && (
        <div
          className="bg-gray-900/95 text-white text-xs rounded-xl px-3 py-2 shadow-xl backdrop-blur-sm"
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 9999,
            maxWidth: 220,
          }}
        >
          <p className="font-semibold text-gray-200 mb-1">{tooltipLabel}</p>
          {tooltip.count === 0 ? (
            <p className="text-gray-400">No tasks completed</p>
          ) : tooltip.taskTitles.length > 0 ? (
            <ul className="space-y-0.5">
              {tooltip.taskTitles.map((title, i) => (
                <li key={i} className="text-indigo-300 flex items-start gap-1">
                  <span className="shrink-0 mt-0.5">•</span>
                  <span>{title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300">{tooltip.count} task{tooltip.count > 1 ? 's' : ''} completed</p>
          )}
        </div>
      )}
    </div>
  )
}
