import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiClock, FiTrendingUp } from 'react-icons/fi'
import { getPublishedArticles, getArticleExcerpt } from '../lib/articles'

const formatDate = (date) => date
  ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  : 'Latest'

const HomePage = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getPublishedArticles({ limit: 9 })
      .then((results) => {
        if (active) setArticles(results)
      })
      .catch((fetchError) => {
        console.error('Error loading news:', fetchError)
        if (active) setError('We could not load the latest stories. Please try again later.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  const leadArticle = articles[0]
  const latestArticles = articles.slice(1)

  return (
    <div className="news-page">
      <div className="news-ticker">
        <div className="news-container flex items-center gap-3">
          <span className="ticker-label"><FiTrendingUp aria-hidden="true" /> JUST IN</span>
          <span className="ticker-copy">Independent stories. A clearer view of what matters.</span>
          <span className="ticker-date">{formatDate(new Date().toISOString())}</span>
        </div>
      </div>

      <div className="news-container home-content">
        <header className="home-intro">
          <div>
            <p className="home-intro-kicker"><span aria-hidden="true" /> THE DAILY BRIEFING</p>
            <h1>Stories that <em>move us.</em></h1>
            <p className="home-intro-copy">Independent journalism. A clearer view of the stories shaping our world.</p>
          </div>
          <Link to="/about" className="home-intro-link">
            Explore all stories <FiArrowRight aria-hidden="true" />
          </Link>
        </header>

        {loading ? (
          <div className="home-loading" role="status">
            <span className="home-loading-mark" aria-hidden="true" />
            <span>Gathering the latest stories…</span>
          </div>
        ) : error ? (
          <div className="news-message news-message-error" role="alert">{error}</div>
        ) : !leadArticle ? (
          <section className="news-empty">
            <span className="news-kicker">YOUR NEWSROOM STARTS HERE</span>
            <h2 className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">No stories published yet</h2>
            <p className="mx-auto mt-2 max-w-lg text-gray-600 dark:text-gray-300">
              Check back soon for the latest updates, or sign in to start sharing stories.
            </p>
            <Link to="/about" className="news-button mt-6">Explore the newsroom <FiArrowRight aria-hidden="true" /></Link>
          </section>
        ) : (
          <>
            <div className="home-section-label">
              <span>EDITOR&apos;S PICK</span>
              <span className="home-section-rule" />
              <span>{formatDate(new Date().toISOString())}</span>
            </div>
            <section className="news-lead-grid">
              <Link to={`/article/${leadArticle.id}`} className="news-lead-image group">
                {leadArticle.featured_image ? (
                  <img src={leadArticle.featured_image} alt="" />
                ) : (
                  <div className="news-image-placeholder"><span>THE DAILY<br />BRIEFING</span></div>
                )}
                <span className="news-image-badge">TOP STORY</span>
              </Link>
              <div className="flex flex-col justify-center py-5 sm:py-8">
                <div className="news-meta">
                  <span>{leadArticle.tags?.[0] || 'NEWS'}</span>
                  <span><FiClock aria-hidden="true" /> {formatDate(leadArticle.created_at)}</span>
                </div>
                <Link to={`/article/${leadArticle.id}`} className="group">
                  <h2 className="news-lead-title">{leadArticle.title}</h2>
                </Link>
                <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">
                  {getArticleExcerpt(leadArticle.content, 220)}
                </p>
                <Link to={`/article/${leadArticle.id}`} className="news-text-link mt-6 w-fit">
                  Read the full story <FiArrowRight aria-hidden="true" />
                </Link>
              </div>
            </section>

            {latestArticles.length > 0 && (
              <section className="home-latest">
                <div className="home-latest-heading">
                  <div>
                    <p className="news-kicker">FRESH PERSPECTIVES</p>
                    <h2>Latest stories</h2>
                  </div>
                  <Link to="/about" className="news-text-link">View all <FiArrowRight aria-hidden="true" /></Link>
                </div>
                <div className="news-card-grid">
                  {latestArticles.slice(0, 6).map((article) => (
                    <article key={article.id} className="news-card">
                      <Link to={`/article/${article.id}`} className="news-card-image">
                        {article.featured_image
                          ? <img src={article.featured_image} alt="" loading="lazy" />
                          : <div className="news-image-placeholder"><span>NEWS</span></div>}
                      </Link>
                      <div className="news-card-body">
                        <div className="news-meta">
                          <span>{article.tags?.[0] || 'NEWS'}</span>
                          <span>{formatDate(article.created_at)}</span>
                        </div>
                        <h3><Link to={`/article/${article.id}`}>{article.title}</Link></h3>
                        <p>{getArticleExcerpt(article.content, 120)}</p>
                        <Link to={`/article/${article.id}`} className="news-card-more">Read story <FiArrowRight aria-hidden="true" /></Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default HomePage
