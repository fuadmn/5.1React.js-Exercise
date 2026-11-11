import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FiAlertTriangle,
  FiEdit2,
  FiEye,
  FiFileText,
  FiLoader,
  FiMessageCircle,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { deleteArticle, getArticleByAuthor } from '../lib/articles'

const formatDate = (dateString) => {
  if (!dateString) return 'Taariikh lama hayo'
  return new Date(dateString).toLocaleDateString('so-SO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const Manage = () => {
  const { user, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [articleToDelete, setArticleToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const fetchUserArticles = useCallback(async () => {
    if (!user) return

    try {
      const { articles: authorArticles } = await getArticleByAuthor(user.id, {
        includeUnPublished: true,
        limit: 100,
      })
      setArticles(authorArticles || [])
    } catch (fetchError) {
      console.error('Error fetching articles:', fetchError)
      setError('Maqaalada lama soo rari karin. Fadlan mar kale isku day.')
      toast.error('Maqaalada lama soo rari karin.')
    } finally {
      setLoading(false)
    }
  }, [user])

  const handleRetry = () => {
    setError('')
    setLoading(true)
    fetchUserArticles()
  }

  useEffect(() => {
    if (isAuthLoading) return
    if (!user) {
      navigate('/signin', { replace: true })
      return
    }
    fetchUserArticles()
  }, [fetchUserArticles, isAuthLoading, navigate, user])

  const handleDelete = async () => {
    if (!articleToDelete || !user) return

    try {
      setIsDeleting(true)
      setDeleteError('')
      await deleteArticle(articleToDelete.id, user.id)
      setArticles((current) => current.filter((article) => article.id !== articleToDelete.id))
      setArticleToDelete(null)
      toast.success('Maqaalka waa la tirtiray.')
    } catch (deleteError) {
      console.error('Error deleting article:', deleteError)
      const message = deleteError.code === '23503'
        ? 'Maqaalka waxaa weli ku xiran faallooyin. Hubi in tirtirka faallooyinka loo oggol yahay Supabase.'
        : deleteError.message || 'Maqaalka lama tirtiri karin.'
      setDeleteError(message)
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const publishedArticles = articles.filter((article) => article.published)
  const draftArticles = articles.filter((article) => !article.published)

  const renderArticleList = (items, isDraft = false) => {
    if (!items.length) {
      return (
        <div className="manage-empty">
          <FiFileText aria-hidden="true" />
          <p>{isDraft ? 'Ma jiraan qoraallo qabyo ah.' : 'Weli maqaal lama daabicin.'}</p>
        </div>
      )
    }

    return (
      <div className="manage-article-list">
        {items.map((article) => (
          <article className="manage-article-row" key={article.id}>
            <div className="manage-article-thumb">
              {article.featured_image
                ? <img src={article.featured_image} alt="" loading="lazy" />
                : <FiFileText aria-hidden="true" />}
            </div>

            <div className="manage-article-info">
              <div className="manage-article-meta">
                <span className={`manage-status ${isDraft ? 'manage-status-draft' : 'manage-status-published'}`}>
                  {isDraft ? 'Qabyo' : 'La daabacay'}
                </span>
                <time dateTime={article.created_at}>{formatDate(article.created_at)}</time>
              </div>
              <h3>{article.title || 'Maqaal aan cinwaan lahayn'}</h3>
              {article.tags?.length > 0 && (
                <div className="manage-article-tags">
                  {article.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              )}
            </div>

            {!isDraft && (
              <span className="manage-comment-count" title="Tirada faallooyinka">
                <FiMessageCircle aria-hidden="true" />
                {article.comments?.[0]?.count || 0}
              </span>
            )}

            <div className="manage-article-actions">
              {!isDraft && (
                <Link
                  to={`/article/${article.id}`}
                  className="manage-action manage-action-view"
                  title="Eeg maqaalka"
                  aria-label={`Eeg ${article.title || 'maqaalka'}`}
                >
                  <FiEye aria-hidden="true" />
                </Link>
              )}
              <Link
                to={`/create/${article.id}`}
                className="manage-action manage-action-edit"
                title="Wax ka beddel"
                aria-label={`Wax ka beddel ${article.title || 'maqaalka'}`}
              >
                <FiEdit2 aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => setArticleToDelete(article)}
                className="manage-action manage-action-delete"
                title="Tirtir"
                aria-label={`Tirtir ${article.title || 'maqaalka'}`}
              >
                <FiTrash2 aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>
    )
  }

  return (
    <div className="manage-page">
      <header className="manage-hero">
        <div className="news-container manage-hero-inner">
          <div>
            <p className="manage-eyebrow">THE DAILY · QORAAGA</p>
            <h1>Maamulka maqaalada</h1>
            <p>Maamul wararka aad daabacday iyo qoraallada kuu qabyo ah.</p>
          </div>
          <Link to="/create" className="manage-create-button">
            <FiPlus aria-hidden="true" />
            Maqaal cusub
          </Link>
        </div>
      </header>

      <main className="news-container manage-main">
        {loading ? (
          <div className="manage-loading" role="status">
            <FiLoader className="manage-spinner" aria-hidden="true" />
            <span>Maqaalada waa la soo rarayaa…</span>
          </div>
        ) : error ? (
          <div className="manage-error" role="alert">
            <FiAlertTriangle aria-hidden="true" />
            <p>{error}</p>
            <button type="button" onClick={handleRetry}>Mar kale isku day</button>
          </div>
        ) : (
          <>
            <section className="manage-stats" aria-label="Tirada maqaalada">
              <div className="manage-stat-card">
                <span className="manage-stat-icon"><FiFileText aria-hidden="true" /></span>
                <div><strong>{articles.length}</strong><span>Dhammaan maqaalada</span></div>
              </div>
              <div className="manage-stat-card">
                <span className="manage-stat-icon manage-stat-published"><FiEye aria-hidden="true" /></span>
                <div><strong>{publishedArticles.length}</strong><span>La daabacay</span></div>
              </div>
              <div className="manage-stat-card">
                <span className="manage-stat-icon manage-stat-draft"><FiEdit2 aria-hidden="true" /></span>
                <div><strong>{draftArticles.length}</strong><span>Qabyo</span></div>
              </div>
            </section>

            {!articles.length ? (
              <section className="manage-first-article">
                <span className="manage-first-icon"><FiFileText aria-hidden="true" /></span>
                <p className="manage-eyebrow">BILOW QORAALKAAGA</p>
                <h2>Weli maqaal ma aadan qorin</h2>
                <p>Qor maqaalkaaga koowaad, kadibna la wadaag akhristayaasha.</p>
                <Link to="/create" className="manage-create-button">
                  <FiPlus aria-hidden="true" /> Qor maqaalka koowaad
                </Link>
              </section>
            ) : (
              <div className="manage-sections">
                <section className="manage-section">
                  <div className="manage-section-heading">
                    <div>
                      <p className="manage-eyebrow">AKHRISTAYAASHA WAA ARKI KARAAN</p>
                      <h2>Maqaalada la daabacay</h2>
                    </div>
                    <span className="manage-section-count">{publishedArticles.length}</span>
                  </div>
                  {renderArticleList(publishedArticles)}
                </section>

                <section className="manage-section">
                  <div className="manage-section-heading">
                    <div>
                      <p className="manage-eyebrow">ADIGA KELIYA AYAAD ARKI KARTAA</p>
                      <h2>Qoraallada qabyo ah</h2>
                    </div>
                    <span className="manage-section-count">{draftArticles.length}</span>
                  </div>
                  {renderArticleList(draftArticles, true)}
                </section>
              </div>
            )}
          </>
        )}
      </main>

      {articleToDelete && (
        <div className="manage-modal-backdrop" role="presentation">
          <section className="manage-delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <span className="manage-delete-icon"><FiTrash2 aria-hidden="true" /></span>
            <h2 id="delete-title">Ma tirtiraysaa maqaalka?</h2>
            <p>
              “{articleToDelete.title || 'Maqaal aan cinwaan lahayn'}” si joogto ah ayaa loo tirtirayaa.
              Ficilkan dib looma celin karo.
            </p>
            {deleteError && <p className="manage-delete-error" role="alert">{deleteError}</p>}
            <div className="manage-modal-actions">
              <button
                type="button"
                onClick={() => setArticleToDelete(null)}
                disabled={isDeleting}
                className="manage-modal-cancel"
              >
                Ka noqo
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="manage-modal-confirm"
              >
                {isDeleting
                  ? <><FiLoader className="manage-spinner" aria-hidden="true" /> Waa la tirtirayaa…</>
                  : <><FiTrash2 aria-hidden="true" /> Haa, tirtir</>}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Manage
