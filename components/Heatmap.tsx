'use client'

const WEEKS = 52
const DAYS = 7

function getColor(count: number): string {
  if (count === 0) return '#eef0f3'
  if (count === 1) return '#c7d2fe'
  if (count === 2) return '#818cf8'
  if (count <= 4) return '#6366f1'
  return '#4338ca'
}

function getTooltip(dateStr: string, count: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return count === 0 ? `No tasks on ${label}` : `${count} task${count > 1 ? 's' : ''} on ${label}`
}

interface Props {
  activityLog: Record<string, number>
}

export default function Heatmap({ activityLog }: Props) {
  // Build grid: WEEKS columns × 7 rows, starting from Sunday
  const today = new Date()
  today.setHours(12, 0, 0, 0)

  // Find the start date (Sunday of 52 weeks ago)
  const start = new Date(today)
  start.setDate(today.getDate() - (WEEKS * DAYS - 1) - today.getDay())

  const grid: { date: string; count: number }[][] = []
  let cur = new Date(start)

  for (let w = 0; w < WEEKS; w++) {
    const week: { date: string; count: number }[] = []
    for (let d = 0; d < DAYS; d++) {
      const dateStr = cur.toISOString().split('T')[0]
      week.push({ date: dateStr, count: activityLog[dateStr] ?? 0 })
      cur.setDate(cur.getDate() + 1)
    }
    grid.push(week)
  }

  // Month labels
  const monthLabels: { label: string; col: number }[] = []
  for (let w = 0; w < WEEKS; w++) {
    const firstDay = grid[w][0].date
    const d = new Date(firstDay + 'T12:00:00')
    if (d.getDate() <= 7 || w === 0) {
      monthLabels.push({
        label: d.toLocaleString('en-US', { month: 'short' }),
        col: w,
      })
    }
  }

  const cellSize = 12
  const gap = 3
  const step = cellSize + gap
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: WEEKS * step + 36 }}>
        {/* Month labels */}
        <div className="flex mb-1" style={{ paddingLeft: 36 }}>
          {monthLabels.map(({ label, col }, i) => (
            <span
              key={i}
              className="text-xs text-gray-400 absolute"
              style={{ left: 36 + col * step }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="relative mt-5 flex gap-0" style={{ height: DAYS * step + 4 }}>
          {/* Day labels */}
          <div className="flex flex-col justify-between pr-2" style={{ width: 32 }}>
            {dayLabels.map((l, i) => (
              <span key={i} className="text-xs text-gray-400 leading-none" style={{ height: step }}>
                {l}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[3px]">
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((cell) => (
                  <div
                    key={cell.date}
                    title={getTooltip(cell.date, cell.count)}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: getColor(cell.count),
                      borderRadius: 2,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-3 justify-end">
          <span className="text-xs text-gray-400">Less</span>
          {[0, 1, 2, 3, 5].map((n) => (
            <div
              key={n}
              style={{ width: cellSize, height: cellSize, backgroundColor: getColor(n), borderRadius: 2 }}
            />
          ))}
          <span className="text-xs text-gray-400">More</span>
        </div>
      </div>
    </div>
  )
}
