const WEEKS = 52
const DAYS = 7

function localDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

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
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - (WEEKS * DAYS - 1) - today.getDay())

  const grid: { date: string; count: number }[][] = []
  const cur = new Date(start)

  for (let w = 0; w < WEEKS; w++) {
    const week: { date: string; count: number }[] = []
    for (let d = 0; d < DAYS; d++) {
      const dateStr = localDateStr(cur)
      week.push({ date: dateStr, count: activityLog[dateStr] ?? 0 })
      cur.setDate(cur.getDate() + 1)
    }
    grid.push(week)
  }

  const monthLabels: { label: string; col: number }[] = []
  for (let w = 0; w < WEEKS; w++) {
    const d = new Date(grid[w][0].date + 'T12:00:00')
    if (d.getDate() <= 7 || w === 0) {
      monthLabels.push({ label: d.toLocaleString('en-US', { month: 'short' }), col: w })
    }
  }

  const cellSize = 12
  const gap = 3
  const step = cellSize + gap
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: WEEKS * step + 36 }}>
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

        <div className="flex items-center gap-1.5 mt-3 justify-end">
          <span className="text-xs text-gray-400">Less</span>
          {[0, 1, 2, 3, 5].map((n) => (
            <div key={n} style={{ width: cellSize, height: cellSize, backgroundColor: getColor(n), borderRadius: 2 }} />
          ))}
          <span className="text-xs text-gray-400">More</span>
        </div>
      </div>
    </div>
  )
}
