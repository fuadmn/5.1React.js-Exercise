import supabase from './supabase'

export const createArticle = async( article ) => {
    const articleData = {
        title: article.title,
        content: article.content,
        tags: article.tags,
        author_id: article.author_id,
        published: article.published || false,
        featured_image: article.featuredImageUrl || null,
    }

     const { data, error } = await supabase
         .from('articles')
         .insert(articleData)
         .select()
         .single()

    if (error) throw error
    return data
}

export const updateArticle = async (id, authorId, article) => {
    const articleData = {
        title: article.title,
        content: article.content,
        tags: article.tags,
        published: article.published,
        featured_image: article.featuredImageUrl || null,
    }

    const { data, error } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', id)
        .eq('author_id', authorId)
        .select()
        .single()

    if (error) throw error
    return data
}

export const getPublishedArticles = async ({ limit = 10, offset = 0 } = {}) => {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) throw error
    return data || []
}

export const getArticleExcerpt = (content, limit = 180) => {
    if (!content) return ''

    const text = new DOMParser()
        .parseFromString(content, 'text/html')
        .body.textContent
        .replace(/\s+/g, ' ')
        .trim()

    return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text
}

export const getArticleByAuthor = async(author_id, {includeUnPublished = false, limit = 10, offset = 0 } ) => {

    let query = supabase 
                  .from('articles')
                  .select(`
                    *, 
                    comments:comments(count)`)
                    .eq('author_id', author_id)
                    .order('created_at',{ascending: false})
                    .range(offset, offset + limit -1 )


        if(!includeUnPublished){
            query = query.eq('published', true)
        }


        const {data , error, count } = await query

        if(error) throw error

        return{
            articles : data,
            count
        }



}

export const deleteArticle = async (id, authorId) => {
    const { data: article, error: lookupError } = await supabase
        .from('articles')
        .select('id')
        .eq('id', id)
        .eq('author_id', authorId)
        .maybeSingle()

    if (lookupError) throw lookupError
    if (!article) throw new Error('Maqaalka lama helin ama oggolaansho uma lihid inaad tirtirto.')

    const { error: commentError } = await supabase
        .from('comments')
        .delete()
        .eq('author_id', id)

    if (commentError) throw commentError

    const { error: deleteError } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)
        .eq('author_id', authorId)

    if (deleteError) throw deleteError

    const { data: remainingArticle, error: verifyError } = await supabase
        .from('articles')
        .select('id')
        .eq('id', id)
        .eq('author_id', authorId)
        .maybeSingle()

    if (verifyError) throw verifyError
    if (remainingArticle) {
        throw new Error(
            'Supabase wuu xannibay tirtirka. Ku orod supabase/migrations/20261111000100_allow_authors_to_delete_articles.sql gudaha Supabase SQL Editor, kadib mar kale isku day.',
        )
    }

    return true
}

export const getArticleById = async (id, { includeUnpublished = false } = {}) => {

    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if ( error ) throw error
    if (!data || (!includeUnpublished && !data.published)) return null
    return data
}