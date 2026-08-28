import { useState } from 'react'
import CalendarView from './components/CalendarView'
import PlatformView from './components/PlatformView'
import StatsView from './components/StatsView'
import PostModal from './components/PostModal'
import GenerateWeeksModal from './components/GenerateWeeksModal'
import { usePosts } from './lib/usePosts'

const TABS = [
  { id: 'calendar', label: 'Calendario' },
  { id: 'platform', label: 'Instagram' },
  { id: 'stats', label: 'Estadísticas' },
]

export default function App() {
  const { posts, loading, error, createPost, updatePost, deletePost, createMany } = usePosts()
  const [tab, setTab] = useState('calendar')
  const [modalOpen, setModalOpen] = useState(false)
  const [genModalOpen, setGenModalOpen] = useState(false)
  const [activePost, setActivePost] = useState(null)
  const [defaultDate, setDefaultDate] = useState(null)

  const openNewPost = (date) => {
    setActivePost(null)
    setDefaultDate(date ?? new Date().toISOString().slice(0, 10))
    setModalOpen(true)
  }

  const openEditPost = (post) => {
    setActivePost(post)
    setModalOpen(true)
  }

  const handleSave = async (draft) => {
    if (activePost) {
      await updatePost(activePost.id, draft)
    } else {
      await createPost(draft)
    }
    setModalOpen(false)
  }

  const handleDelete = async (id) => {
    await deletePost(id)
    setModalOpen(false)
  }

  const handleStatusChange = async (id, status) => {
    await updatePost(id, { status })
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-logo">T3</span>
          <div>
            <h1>Transforma 3</h1>
            <p>Calendario de contenido</p>
          </div>
        </div>

        <nav className="app-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`app-tab ${tab === t.id ? 'app-tab-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="app-actions">
          <button className="btn btn-ghost" onClick={() => setGenModalOpen(true)}>
            Generar ritmo
          </button>
          <button className="btn btn-primary" onClick={() => openNewPost()}>
            + Nueva publicación
          </button>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="banner banner-error">
            No se pudo conectar con Supabase: {error}. Revisa tus variables de entorno (VITE_SUPABASE_URL /
            VITE_SUPABASE_ANON_KEY) y que la tabla &quot;posts&quot; exista.
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            <p>Cargando calendario…</p>
          </div>
        ) : (
          <>
            {tab === 'calendar' && (
              <CalendarView posts={posts} onDayClick={openNewPost} onPostClick={openEditPost} />
            )}
            {tab === 'platform' && (
              <PlatformView posts={posts} onPostClick={openEditPost} onStatusChange={handleStatusChange} />
            )}
            {tab === 'stats' && <StatsView posts={posts} />}
          </>
        )}
      </main>

      <PostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        post={activePost}
        defaultDate={defaultDate}
      />

      <GenerateWeeksModal
        open={genModalOpen}
        onClose={() => setGenModalOpen(false)}
        onGenerate={createMany}
      />
    </div>
  )
}
