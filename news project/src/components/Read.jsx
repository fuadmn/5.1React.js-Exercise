import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiMessageCircle, FiSend } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { createComment, getCommentsByArticle } from '../lib/comments'

const formatDate = (date) => new Date(date).toLocaleString('en', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const Read = ({ articleId }) => {
  const { user, profile } = useAuth()
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [loadError, setLoadError] = useState('')

  const loadComments = useCallback(async () => {
    try {
      const results = await getCommentsByArticle(articleId)
      setComments(results)
    } catch (error) {
      console.error('Error loading article comments:', error)
      setLoadError('Faallooyinka lama soo rari karin. Fadlan mar kale isku day.')
    } finally {
      setLoading(false)
    }
  }, [articleId])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedContent = content.trim()

    if (!trimmedContent) {
      toast.error('Fadlan qor faallo ka hor intaadan dirin.')
      return
    }
    if (trimmedContent.length > 2000) {
      toast.error('Faalladu kama badnaan karto 2,000 xaraf.')
      return
    }
    if (!user) return

    setSubmitting(true)
    try {
      const comment = await createComment({
        articleId,
        content: trimmedContent,
      })
      setComments((current) => [...current, comment])
      setContent('')
      toast.success('Faalladaada waa la diray.')
    } catch (error) {
      console.error('Error posting article comment:', error)
      toast.error(error.message || 'Faallada lama diri karin. Fadlan mar kale isku day.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="news-comments" aria-labelledby="comments-heading">
      <div className="news-comments-heading">
        <h2 id="comments-heading">Faallooyinka</h2>
        <span>{comments.length}</span>
      </div>

      {user ? (
        <form className="news-comment-form" onSubmit={handleSubmit}>
          <label htmlFor="article-comment" className="sr-only">Qor faalladaada</label>
          <textarea
            id="article-comment"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={`Faallo ku qor magaca ${profile?.username || 'akhriste'}...`}
            maxLength={2000}
            rows={4}
            required
          />
          <div className="news-comment-form-footer">
            <span>{content.length}/2000</span>
            <button type="submit" disabled={submitting || !content.trim()}>
              <FiSend aria-hidden="true" />
              {submitting ? 'Waa la dirayaa…' : 'Dir faallada'}
            </button>
          </div>
        </form>
      ) : (
        <p className="news-comments-signin">
          Faallo qorista waxay u baahan tahay inaad
          {' '}<Link to="/signin">gasho akoonkaaga</Link>.
        </p>
      )}

      {loading ? (
        <p className="news-comments-status" role="status">Faallooyinka waa la soo rarayaa…</p>
      ) : loadError ? (
        <div className="news-comments-error" role="alert">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={() => {
              setLoadError('')
              setLoading(true)
              loadComments()
            }}
          >
            Mar kale isku day
          </button>
        </div>
      ) : comments.length === 0 ? (
        <p className="news-comments-status">
          <FiMessageCircle aria-hidden="true" /> Weli faallo lama qorin. Noqo qofka ugu horreeya!
        </p>
      ) : (
        <ol className="news-comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="news-comment">
              <div className="news-comment-avatar" aria-hidden="true">
                A
              </div>
              <div className="news-comment-content">
                <div className="news-comment-byline">
                  <strong>Akhriste</strong>
                  <time dateTime={comment.created_at}>{formatDate(comment.created_at)}</time>
                </div>
                <p>{comment.content}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default Read
