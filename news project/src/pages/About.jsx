import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiClock } from 'react-icons/fi'
import { getArticleById, getArticleExcerpt } from '../lib/articles'
import Read from '../components/Read'

const About = () => {
  const { id } = useParams()
  const [result, setResult] = useState({ id: null, article: null, error: '' })

  useEffect(() => {
    let active = true

    getArticleById(id)
      .then((result) => {
        if (active) setResult({ id, article: result, error: '' })
      })
      .catch((fetchError) => {
        console.error('Error loading article:', fetchError)
        if (active) setResult({ id, article: null, error: 'This story could not be loaded. Please try again later.' })
      })

    return () => { active = false }
  }, [id])

  const loading = result.id !== id
  const article = loading ? null : result.article
  const error = loading ? '' : result.error

  if (loading) {
    return <div className="news-container py-24 text-center text-gray-500" role="status">Loading story…</div>
  }

  if (error || !article) {
    return (
      <div className="news-container min-h-[60vh] py-20 text-center">
        <p className="news-kicker">STORY NOT FOUND</p>
        <h1 className="mt-3 text-2xl font-bold text-gray-950 dark:text-white">{error || 'This story is not available.'}</h1>
        <Link to="/about" className="news-text-link mx-auto mt-6"><FiArrowLeft aria-hidden="true" /> Back to all stories</Link>
      </div>
    )
  }

  const publishedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Latest'

  return (
    <div className="news-container min-h-[65vh] py-8 sm:py-12">
      <Link to="/about" className="news-text-link mb-8"><FiArrowLeft aria-hidden="true" /> All stories</Link>
      <article className="mx-auto max-w-4xl">
        <div className="news-meta mb-5">
          <span>{article.tags?.join(' / ') || 'NEWS'}</span>
          <span><FiClock aria-hidden="true" /> {publishedDate}</span>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          {getArticleExcerpt(article.content, 260)}
        </p>
        {article.featured_image && (
          <img
            className="mt-8 max-h-[34rem] w-full rounded-sm object-cover"
            src={article.featured_image}
            alt=""
          />
        )}
        <div className="news-article-content">
          {getArticleExcerpt(article.content, 100000)}
        </div>
        <Read key={article.id} articleId={article.id} />
      </article>
    </div>
  )
}

export default About
