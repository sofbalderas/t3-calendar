import { useMemo, useState } from 'react'
import { format, startOfWeek } from 'date-fns'
import { FORMATS, PILLAR_MAP, PLATFORMS } from '../lib/constants'

export default function PlatformView({ posts, onPostClick }) {
  const [activePlatform, setActivePlatform] = useState('instagram')
  const [pillarFilter, setPillarFilter] = useState('all')

  const filtered = useMemo(() => {
    return posts
      .filter((p) => (p.platform ?? 'instagram') === activePlatform)
      .filter((p) => pillarFilter === 'all' || p.pillar === pillarFilter)
      .sort((a, b) => (a.scheduled_date > b.scheduled_date ? 1 : -1))
  }, [posts, activePlatform, pillarFilter])

  const grouped = useMemo(() => {
    const map = new Map()
    for (const p of filtered) {
      if (!p.scheduled_date) continue
      const weekStart = format(startOfWeek(new Date(p.scheduled_date + 'T00:00:00'), { weekStartsOn: 1 }), 'yyyy-MM-dd')
      if (!map.has(weekStart)) map.set(weekStart, [])
      map.get(weekStart).push(p)
    }
    return Array.from(map.entries()).sort((a, b) => (a[0] > b[0] ? 1 : -1))
  }, [filtered])

  return (
    <div className="platform-view">
      <div className="platform-tabs">
        {PLATFORMS.map((pl) => (
          <button
            key={pl.id}
            className={`platform-tab ${activePlatform === pl.id ? 'platform-tab-active' : ''}`}
            disabled={!pl.enabled}
            onClick={() => pl.enabled && setActivePlatform(pl.id)}
            title={pl.enabled ? undefined : 'Próximamente'}
          >
            {pl.label}
            {!pl.enabled && <span className="badge-soon">pronto</span>}
          </button>
        ))}
      </div>

      <div className="platform-filters">
        <select value={pillarFilter} onChange={(e) => setPillarFilter(e.target.value)}>
          <option value="all">Todos los pilares</option>
          {Object.values(PILLAR_MAP).map((p) => (
            <option key={p.id} value={p.id}>
              {p.short}
            </option>
          ))}
        </select>
        <span className="platform-count">{filtered.length} piezas</span>
      </div>

      {grouped.length === 0 && (
        <div className="empty-state">
          <p>No hay contenido de Instagram con estos filtros todavía.</p>
        </div>
      )}

      <div className="platform-weeks">
        {grouped.map(([weekStart, items]) => (
          <div key={weekStart} className="platform-week">
            <h4>Semana del {format(new Date(weekStart + 'T00:00:00'), 'd MMM')}</h4>
            <div className="platform-cards">
              {items.map((p) => {
                const pillar = PILLAR_MAP[p.pillar]
                const fmt = FORMATS.find((f) => f.id === p.format)
                return (
                  <div key={p.id} className="content-card" style={{ '--pillar-color': pillar?.color ?? '#999' }}>
                    <div className="content-card-top">
                      <span className="pillar-dot" />
                      <span className="content-card-format">{fmt?.label ?? p.format}</span>
                      <span className="content-card-date">
                        {format(new Date(p.scheduled_date + 'T00:00:00'), 'EEE d MMM')}
                      </span>
                    </div>
                    <button className="content-card-title" onClick={() => onPostClick(p)}>
                      {p.title}
                    </button>
                    {p.description && <p className="content-card-desc">{p.description}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
