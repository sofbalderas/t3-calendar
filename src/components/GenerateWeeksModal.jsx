import { useState } from 'react'
import { WEEKLY_CADENCE } from '../lib/constants'

function nextWeekdayOnOrAfter(date, weekday) {
  const d = new Date(date)
  const diff = (weekday - d.getDay() + 7) % 7
  d.setDate(d.getDate() + diff)
  return d
}

export function buildCadencePosts(startDateStr, weeks) {
  const start = new Date(startDateStr + 'T00:00:00')
  const posts = []
  for (let w = 0; w < weeks; w++) {
    const weekAnchor = new Date(start)
    weekAnchor.setDate(start.getDate() + w * 7)
    for (const item of WEEKLY_CADENCE) {
      const d = nextWeekdayOnOrAfter(weekAnchor, item.weekday)
      posts.push({
        title: item.title,
        description: '',
        cta: '',
        pillar: item.pillar,
        format: item.format,
        platform: item.format === 'email' ? 'newsletter' : 'instagram',
        status: 'idea',
        scheduled_date: d.toISOString().slice(0, 10),
      })
    }
  }
  return posts
}

export default function GenerateWeeksModal({ open, onClose, onGenerate }) {
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [weeks, setWeeks] = useState(4)
  const [busy, setBusy] = useState(false)

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const posts = buildCadencePosts(startDate, Number(weeks))
      await onGenerate(posts)
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Generar ritmo semanal</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <p className="muted-text">
            Crea automáticamente martes (Pilar A · Reel), jueves (Pilar B · Carrusel) y domingo (Newsletter) para
            las semanas que elijas, siguiendo el ritmo sostenible del plan de estrategia.
          </p>
          <label className="field">
            <span>Semana de inicio</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </label>
          <label className="field">
            <span>Número de semanas</span>
            <input type="number" min="1" max="12" value={weeks} onChange={(e) => setWeeks(e.target.value)} required />
          </label>
          <div className="modal-actions">
            <div className="spacer" />
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Generando…' : 'Generar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
