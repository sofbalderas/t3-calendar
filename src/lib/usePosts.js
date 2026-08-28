import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const TABLE = 'posts'

export function usePosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from(TABLE)
      .select('*')
      .order('scheduled_date', { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setError(null)
      setPosts(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPosts()

    // Sincronización en tiempo real: si editas desde otro dispositivo, se refleja aquí.
    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, () => {
        fetchPosts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchPosts])

  const createPost = useCallback(async (post) => {
    const { data, error: insertError } = await supabase.from(TABLE).insert(post).select()
    if (insertError) throw insertError
    return data?.[0]
  }, [])

  const updatePost = useCallback(async (id, patch) => {
    const { data, error: updateError } = await supabase
      .from(TABLE)
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
    if (updateError) throw updateError
    return data?.[0]
  }, [])

  const deletePost = useCallback(async (id) => {
    const { error: deleteError } = await supabase.from(TABLE).delete().eq('id', id)
    if (deleteError) throw deleteError
  }, [])

  const createMany = useCallback(async (postsArray) => {
    if (!postsArray.length) return []
    const { data, error: insertError } = await supabase.from(TABLE).insert(postsArray).select()
    if (insertError) throw insertError
    return data ?? []
  }, [])

  return { posts, loading, error, fetchPosts, createPost, updatePost, deletePost, createMany }
}
