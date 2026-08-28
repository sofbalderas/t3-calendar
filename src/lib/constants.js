// Paleta de marca Transforma 3 — tomada del material de campaña y del deck de estrategia
export const BRAND = {
  charcoal: '#474544',
  charcoalDark: '#2f2d2c',
  mustard: '#FFCD4E',
  mustardDeep: '#E6A93A',
  cream: '#F1F0EE',
  maroon: '#8B4A57',
  sage: '#9CA88C',
  sageDeep: '#7C8A72',
  ink: '#2A2827',
}

// Pilares de comunicación (Estrategia Digital Transforma 3)
export const PILLARS = [
  {
    id: 'pilar_a',
    label: 'Pilar A · Vida real & 40+',
    short: 'Pilar A',
    description: 'Atracción y conexión: estilo de vida, platos diarios, cuerpo y energía.',
    color: '#E6A93A',
  },
  {
    id: 'pilar_b',
    label: 'Pilar B · Tribu, programa y testimonios',
    short: 'Pilar B',
    description: 'Conversión: casos de éxito, dinámica de grupos y llamados a inscripción.',
    color: '#8B4A57',
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    short: 'Newsletter',
    description: 'Contenido reflexivo y educativo de mayor profundidad, 1x/semana.',
    color: '#7C8A72',
  },
]

export const PILLAR_MAP = Object.fromEntries(PILLARS.map((p) => [p.id, p]))

export const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', enabled: true },
  { id: 'tiktok', label: 'TikTok', enabled: false },
  { id: 'facebook', label: 'Facebook', enabled: false },
]

export const FORMATS = [
  { id: 'reel_broll', label: 'Reel / B-roll', platform: 'instagram' },
  { id: 'carrusel', label: 'Carrusel', platform: 'instagram' },
  { id: 'posteo', label: 'Posteo estático', platform: 'instagram' },
  { id: 'story', label: 'Story', platform: 'instagram' },
  { id: 'email', label: 'Email', platform: 'newsletter' },
]

export const STATUSES = [
  { id: 'idea', label: 'Idea', color: '#B9B6B3' },
  { id: 'para_grabar', label: 'Para grabar', color: '#E6A93A' },
  { id: 'grabado', label: 'Grabado', color: '#D9A441' },
  { id: 'editado', label: 'Editado', color: '#7C8A72' },
  { id: 'programado', label: 'Programado', color: '#5B7AA6' },
  { id: 'publicado', label: 'Publicado', color: '#4A8B5C' },
]

export const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.id, s]))

// Cadencia semanal sostenible propuesta en el deck de estrategia:
// martes = Pilar A (reel b-roll) · jueves = Pilar B (carrusel) · domingo = Newsletter
export const WEEKLY_CADENCE = [
  { weekday: 2, pillar: 'pilar_a', format: 'reel_broll', title: 'Reel: un plato de la semana + reflexión del día' },
  { weekday: 4, pillar: 'pilar_b', format: 'carrusel', title: 'Carrusel: frases con las que se identifican las 40+' },
  { weekday: 0, pillar: 'newsletter', format: 'email', title: 'Newsletter: anécdota cercana + hábitos de bienestar' },
]

export const WEEKDAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
export const MONTH_LABELS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
