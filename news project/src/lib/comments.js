import supabase from './supabase'

export const getCommentsByArticle = async (articleId) => {
  const { data: comments, error } = await supabase
    .from('comments')
    .select('id, author_id, content, created_at')
    .eq('author_id', articleId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return comments || []
}

export const createComment = async ({ articleId, content }) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({ author_id: articleId, content })
    .select('id, author_id, content, created_at')
    .single()

  if (error) throw error
  return data
}
