import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <div className="news-container flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="text-lg font-black tracking-tight text-gray-950 dark:text-white">
          <span className="text-red-700">THE</span> DAILY
          <span className="ml-2 text-xs font-medium text-gray-500">Independent newsroom</span>
        </Link>
        <nav className="flex gap-5 text-sm text-gray-600 dark:text-gray-300" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/about">All stories</Link>
        </nav>
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} The Daily. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
