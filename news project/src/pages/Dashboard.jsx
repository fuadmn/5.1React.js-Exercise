import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiAlertTriangle,
  FiArrowRight,
  FiEdit2,
  FiEye,
  FiFileText,
  FiLoader,
  FiMessageCircle,
  FiPlus,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { getArticleByAuthor } from '../lib/articles'

const formatDate = (dateString) => {
  if (!dateString) return 'Taariikh lama hayo'
  return new Date(dateString).toLocaleDateString('so-SO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const Dashboard = () => {
  const { user, profile } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getArticleByAuthor(user.id, {
      includeUnPublished: true,
      limit: 100,
    })
      .then(({ articles: authorArticles }) => {
        if (active) setArticles(authorArticles || [])
      })
      .catch((fetchError) => {
        console.error('Error fetching dashboard articles:', fetchError)
        if (active) setError('Xogta dashboard-ka lama soo rari karin. Fadlan mar kale isku day.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [user])

  const handleRetry = async () => {
    setLoading(true)
    setError('')
    try {
      const { articles: authorArticles } = await getArticleByAuthor(user.id, {
        includeUnPublished: true,
        limit: 100,
      })
      setArticles(authorArticles || [])
    } catch (fetchError) {
      console.error('Error fetching dashboard articles:', fetchError)
      setError('Xogta dashboard-ka lama soo rari karin. Fadlan mar kale isku day.')
    } finally {
      setLoading(false)
    }
  }

  const publishedArticles = articles.filter((article) => article.published)
  const draftArticles = articles.filter((article) => !article.published)
  const commentCount = publishedArticles.reduce(
    (total, article) => total + (article.comments?.[0]?.count || 0),
    0,
  )

  return (
    <div className="manage-page dashboard-page">
      <header className="manage-hero">
        <div className="news-container manage-hero-inner">
          <div>
            <p className="manage-eyebrow">THE DAILY · DASHBOARD</p>
            <h1>Ku soo dhowow, {profile?.username || 'Qoraa'}</h1>
            <p>Halkan ka eeg maqaaladaada iyo hawlaha qoraaga.</p>
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
            <span>Dashboard-ka waa la soo rarayaa…</span>
          </div>
        ) : error ? (
          <div className="manage-error" role="alert">
            <FiAlertTriangle aria-hidden="true" />
            <p>{error}</p>
            <button type="button" onClick={handleRetry}>Mar kale isku day</button>
          </div>
        ) : (
          <>
            <section className="manage-stats" aria-label="Soo koobidda maqaalada">
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
              <div className="manage-stat-card">
                <span className="manage-stat-icon"><FiMessageCircle aria-hidden="true" /></span>
                <div><strong>{commentCount}</strong><span>Faallooyinka</span></div>
              </div>
            </section>

            <section className="manage-sections">
              <div className="manage-section">
                <div className="manage-section-heading">
                  <div>
                    <p className="manage-eyebrow">QORAALLADA UGU DAMBEEYAY</p>
                    <h2>Maqaaladaadii ugu dambeeyay</h2>
                  </div>
                  <Link to="/manage" className="manage-create-button">
                    Maamul maqaalada <FiArrowRight aria-hidden="true" />
                  </Link>
                </div>

                {articles.length ? (
                  <div className="manage-article-list">
                    {articles.slice(0, 5).map((article) => (
                      <article className="manage-article-row" key={article.id}>
                        <div className="manage-article-thumb">
                          {article.featured_image
                            ? <img src={article.featured_image} alt="" loading="lazy" />
                            : <FiFileText aria-hidden="true" />}
                        </div>
                        <div className="manage-article-info">
                          <div className="manage-article-meta">
                            <span className={`manage-status ${article.published ? 'manage-status-published' : 'manage-status-draft'}`}>
                              {article.published ? 'La daabacay' : 'Qabyo'}
                            </span>
                            <time dateTime={article.created_at}>{formatDate(article.created_at)}</time>
                          </div>
                          <h3>{article.title || 'Maqaal aan cinwaan lahayn'}</h3>
                        </div>
                        <div className="manage-article-actions">
                          <Link
                            to={article.published ? `/article/${article.id}` : `/create/${article.id}`}
                            className="manage-action manage-action-view"
                            aria-label={article.published ? `Eeg ${article.title}` : `Wax ka beddel ${article.title}`}
                            title={article.published ? 'Eeg maqaalka' : 'Wax ka beddel'}
                          >
                            {article.published
                              ? <FiEye aria-hidden="true" />
                              : <FiEdit2 aria-hidden="true" />}
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="manage-first-article">
                    <span className="manage-first-icon"><FiFileText aria-hidden="true" /></span>
                    <p className="manage-eyebrow">BILOW QORAALKAAGA</p>
                    <h2>Weli maqaal ma aadan qorin</h2>
                    <p>Qor maqaalkaaga koowaad, kadibna la wadaag akhristayaasha.</p>
                    <Link to="/create" className="manage-create-button">
                      <FiPlus aria-hidden="true" /> Qor maqaalka koowaad
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard
