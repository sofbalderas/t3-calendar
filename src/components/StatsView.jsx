import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format, startOfWeek } from 'date-fns'
import { FORMATS, PILLARS, PILLAR_MAP } from '../lib/constants'

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <span className="stat-card-label">{label}</span>
      <span className="stat-card-value">{value}</span>
      {sub && <span className="stat-card-sub">{sub}</span>}
    </div>
  )
}

export default function StatsView({ posts }) {
  const igPosts = useMemo(() => posts.filter((p) => (p.platform ?? 'instagram') === 'instagram'), [posts])

  const pillarData = useMemo(() => {
    return PILLARS.map((p) => ({
      name: p.short,
      value: posts.filter((post) => post.pillar === p.id).length,
      color: p.color,
    }))
  }, [posts])

  const formatData = useMemo(() => {
    return FORMATS.map((f) => ({
      name: f.label,
      value: posts.filter((post) => post.format === f.id).length,
    })).filter((d) => d.value > 0)
  }, [posts])


  const weeklyCadence = useMemo(() => {
    const map = new Map()
    for (const p of igPosts) {
      if (!p.scheduled_date) continue
      const weekStart = format(startOfWeek(new Date(p.scheduled_date + 'T00:00:00'), { weekStartsOn: 1 }), 'd MMM')
      if (!map.has(weekStart)) map.set(weekStart, { week: weekStart, 'Pilar A': 0, 'Pilar B': 0 })
      const entry = map.get(weekStart)
      if (p.pillar === 'pilar_a') entry['Pilar A'] += 1
      if (p.pillar === 'pilar_b') entry['Pilar B'] += 1
    }
    return Array.from(map.values())
  }, [igPosts])

  const total = posts.length
  const pilarACount = posts.filter((p) => p.pillar === 'pilar_a').length
  const pilarBCount = posts.filter((p) => p.pillar === 'pilar_b').length
  const balanceDiff = Math.abs(pilarACount - pilarBCount)

  return (
    <div className="stats-view">
      <div className="stat-cards">
        <StatCard label="Piezas totales" value={total} />
        <StatCard
          label="Balance Pilar A / B"
          value={`${pilarACount} / ${pilarBCount}`}
          sub={balanceDiff <= 1 ? 'Balanceado ✓' : `Diferencia de ${balanceDiff}`}
        />
        <StatCard label="Newsletter programado" value={posts.filter((p) => p.pillar === 'newsletter').length} />
      </div>

      <div className="stats-grid">
        <div className="stats-panel">
          <h3>Balance de pilares</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pillarData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {pillarData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="stats-panel">
          <h3>Cadencia semanal (Pilar A vs Pilar B)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyCadence}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e1dc" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Pilar A" fill={PILLAR_MAP.pilar_a.color} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pilar B" fill={PILLAR_MAP.pilar_b.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stats-panel">
          <h3>Formatos producidos</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={formatData} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e1dc" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#E6A93A" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
