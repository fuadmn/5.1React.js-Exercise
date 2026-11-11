import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { getPublishedArticles, getArticleExcerpt } from '../lib/articles'

const formatDate = (date) => date
  ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  : 'Latest'

const Love = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All stories')

  useEffect(() => {
    let active = true

    getPublishedArticles({ limit: 100 })
      .then((results) => {
        if (active) setArticles(results)
      })
      .catch((fetchError) => {
        console.error('Error loading articles:', fetchError)
        if (active) setError('We could not load the stories. Please try again later.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  const tags = useMemo(
    () => [...new Set(articles.flatMap((article) => article.tags || []).filter(Boolean))],
    [articles],
  )
  const visibleArticles = useMemo(() => {
    const query = search.trim().toLowerCase()
    return articles.filter((article) => {
      const matchesTag = activeTag === 'All stories' || article.tags?.includes(activeTag)
      const matchesSearch = !query
        || article.title?.toLowerCase().includes(query)
        || getArticleExcerpt(article.content, 2000).toLowerCase().includes(query)
      return matchesTag && matchesSearch
    })
  }, [activeTag, articles, search])

  return (
    <div className="news-container min-h-[65vh] py-10 sm:py-14">
      <header className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
        <p className="news-kicker">WARARKA UGU DAMBEEYA</p>
        <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-4xl">Dhammaan wararka</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Wararkii ugu dambeeyay, warbixinno iyo aragtiyo muhiim ah.</p>
          </div>
          <label className="news-search">
            <FiSearch aria-hidden="true" />
            <span className="sr-only">Search stories</span>
            <input
              type="search"
              placeholder="Search stories…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>
      </header>

      <div className="news-filter-row" aria-label="Filter stories by topic">
        {['All stories', ...tags].map((tag) => (
          <button
            type="button"
            key={tag}
            className={`news-filter ${activeTag === tag ? 'news-filter-active' : ''}`}
            onClick={() => setActiveTag(tag)}
            aria-pressed={activeTag === tag}
          >
            {tag === 'All stories' ? 'Dhammaan wararka' : tag}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 text-center text-gray-500" role="status">Loading stories…</div>
      ) : error ? (
        <div className="news-message news-message-error" role="alert">{error}</div>
      ) : visibleArticles.length === 0 ? (
        <section className="news-empty mt-8">
          <h2 className="text-xl font-bold text-gray-950 dark:text-white">No stories found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Try another search or topic.</p>
          {(search || activeTag !== 'All stories') && (
            <button type="button" className="news-text-link mx-auto mt-4" onClick={() => { setSearch(''); setActiveTag('All stories') }}>
              Clear filters
            </button>
          )}
        </section>
      ) : (
        <div className="news-card-grid mt-8">
          {visibleArticles.map((article) => (
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
                <h2><Link to={`/article/${article.id}`}>{article.title}</Link></h2>
                <p>{getArticleExcerpt(article.content, 140)}</p>
                <Link to={`/article/${article.id}`} className="news-card-more">Read story <span aria-hidden="true">→</span></Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default Love
