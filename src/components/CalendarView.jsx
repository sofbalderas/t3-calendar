import { useMemo, useState } from 'react'
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { MONTH_LABELS, PILLAR_MAP, WEEKDAY_LABELS } from '../lib/constants'

export default function CalendarView({ posts, onDayClick, onPostClick }) {
  // Abre directamente en el mes más próximo que tenga contenido cargado
  // (hoy o el más cercano hacia adelante), en vez de siempre el mes actual.
  const [cursor, setCursor] = useState(() => {
    if (posts && posts.length) {
      const todayStr = format(new Date(), 'yyyy-MM-dd')
      const sorted = [...posts].sort((a, b) => (a.scheduled_date > b.scheduled_date ? 1 : -1))
      const upcoming = sorted.find((p) => p.scheduled_date >= todayStr)
      const target = upcoming ?? sorted[sorted.length - 1]
      if (target?.scheduled_date) return new Date(target.scheduled_date + 'T00:00:00')
    }
    return new Date()
  })

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 })
    const result = []
    let d = start
    while (d <= end) {
      result.push(d)
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
    }
    return result
  }, [cursor])

  const postsByDay = useMemo(() => {
    const map = {}
    for (const p of posts) {
      if (!p.scheduled_date) continue
      const key = p.scheduled_date
      if (!map[key]) map[key] = []
      map[key].push(p)
    }
    return map
  }, [posts])

  const today = new Date()

  return (
    <div className="calendar-view">
      <div className="calendar-toolbar">
        <button className="icon-btn" onClick={() => setCursor((c) => subMonths(c, 1))} aria-label="Mes anterior">
          ‹
        </button>
        <h2>
          {MONTH_LABELS[cursor.getMonth()]} {cursor.getFullYear()}
        </h2>
        <button className="icon-btn" onClick={() => setCursor((c) => addMonths(c, 1))} aria-label="Mes siguiente">
          ›
        </button>
        <button className="btn btn-ghost btn-small" onClick={() => setCursor(new Date())}>
          Hoy
        </button>
      </div>

      <div className="calendar-grid calendar-weekday-row">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} className="calendar-weekday">
            {w}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const dayPosts = postsByDay[key] ?? []
          const inMonth = isSameMonth(day, cursor)
          const isToday = isSameDay(day, today)
          return (
            <div
              key={key}
              className={`calendar-cell ${inMonth ? '' : 'calendar-cell-muted'} ${isToday ? 'calendar-cell-today' : ''}`}
              onClick={() => onDayClick(key)}
            >
              <span className="calendar-date">{format(day, 'd', { locale: es })}</span>
              <div className="calendar-chips">
                {dayPosts.map((p) => {
                  const pillar = PILLAR_MAP[p.pillar]
                  return (
                    <button
                      key={p.id}
                      className="calendar-chip"
                      style={{ '--chip-color': pillar?.color ?? '#999' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onPostClick(p)
                      }}
                      title={p.title}
                    >
                      {p.title}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
