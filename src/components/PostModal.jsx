import { useEffect, useState } from 'react'
import { FORMATS, PILLARS, STATUSES } from '../lib/constants'

const emptyDraft = (date) => ({
  title: '',
  description: '',
  cta: '',
  pillar: 'pilar_a',
  format: 'reel_broll',
  status: 'idea',
  scheduled_date: date ?? new Date().toISOString().slice(0, 10),
})

export default function PostModal({ open, onClose, onSave, onDelete, post, defaultDate }) {
  const [draft, setDraft] = useState(emptyDraft(defaultDate))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (post) {
      setDraft({
        title: post.title ?? '',
        description: post.description ?? '',
        cta: post.cta ?? '',
        pillar: post.pillar ?? 'pilar_a',
        format: post.format ?? 'reel_broll',
        status: post.status ?? 'idea',
        scheduled_date: post.scheduled_date ?? emptyDraft().scheduled_date,
      })
    } else {
      setDraft(emptyDraft(defaultDate))
    }
  }, [post, defaultDate, open])

  if (!open) return null

  const handleChange = (field) => (e) => {
    setDraft((d) => ({ ...d, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const platform = draft.format === 'email' ? 'newsletter' : 'instagram'
      await onSave({ ...draft, platform })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{post ? 'Editar publicación' : 'Nueva publicación'}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="field">
            <span>Título / idea</span>
            <input
              required
              type="text"
              value={draft.title}
              onChange={handleChange('title')}
              placeholder="Ej. Reel: plato keto de la semana"
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Fecha</span>
              <input type="date" required value={draft.scheduled_date} onChange={handleChange('scheduled_date')} />
            </label>

            <label className="field">
              <span>Pilar</span>
              <select value={draft.pillar} onChange={handleChange('pillar')}>
                {PILLARS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.short}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Formato</span>
              <select value={draft.format} onChange={handleChange('format')}>
                {FORMATS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Estatus</span>
              <select value={draft.status} onChange={handleChange('status')}>
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Descripción / guion</span>
            <textarea rows={4} value={draft.description} onChange={handleChange('description')} placeholder="Detalle del contenido, hook, texto en cámara..." />
          </label>

          <label className="field">
            <span>CTA</span>
            <input type="text" value={draft.cta} onChange={handleChange('cta')} placeholder="Ej. Realiza el test de hábitos en el link de perfil" />
          </label>

          <div className="modal-actions">
            {post && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => onDelete(post.id)}
              >
                Eliminar
              </button>
            )}
            <div className="spacer" />
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
