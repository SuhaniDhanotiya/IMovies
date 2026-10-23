import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, qs } from '../api'
import MovieCard, { Poster } from '../components/MovieCard'
import { MovieGridSkeleton } from '../components/Skeletons'
import { useTitle } from '../hooks'
import { GENRES, LANGUAGES, duration } from '../utils'

const SORTS = [
  { value: 'rating', label: 'Top rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'title', label: 'A – Z' },
]

export default function Home() {
  useTitle('')
  const [params, setParams] = useSearchParams()
  const search = params.get('search') || ''
  const status = params.get('status') || 'now_showing'
  const genre = params.get('genre') || ''
  const language = params.get('language') || ''
  const sort = params.get('sort') || 'rating'

  const [movies, setMovies] = useState([])
  const [total, setTotal] = useState(0)
  const [featured, setFeatured] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    value ? next.set(key, value) : next.delete(key)
    setParams(next)
  }
  const hasFilters = search || genre || language || sort !== 'rating'
  const clearFilters = () => setParams(status === 'upcoming' ? { status: 'upcoming' } : {})

  useEffect(() => {
    setLoading(true)
    api
      .get(`/movies${qs({ search, status, genre, language, sort, limit: 24 })}`)
      .then((d) => { setMovies(d.movies); setTotal(d.total ?? d.movies.length); setError('') })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [search, status, genre, language, sort])

  useEffect(() => {
    api.get('/movies?status=now_showing&sort=rating&limit=1').then((d) => setFeatured(d.movies[0])).catch(() => {})
  }, [])

  return (
    <div className="page">
      {featured && !search && (
        <section className="hero">
          <div className="hero-text">
            <span className="tag">Featured</span>
            <h1>{featured.title}</h1>
            <p className="muted">
              {featured.averageRating > 0 && <span className="gold">★ {featured.averageRating} · </span>}
              {featured.genre.join(' • ')} · {featured.language} · {duration(featured.duration)}
            </p>
            <p className="hero-desc">{featured.description}</p>
            <Link className="btn btn-lg" to={`/movies/${featured._id}`}>Book tickets</Link>
          </div>
          <Poster movie={featured} className="hero-poster" />
        </section>
      )}

      <div className="toolbar">
        <div className="tabs">
          <button className={status === 'now_showing' ? 'active' : ''} onClick={() => setParam('status', '')}>Now Showing</button>
          <button className={status === 'upcoming' ? 'active' : ''} onClick={() => setParam('status', 'upcoming')}>Upcoming</button>
        </div>
        <div className="filters">
          <select aria-label="Language" value={language} onChange={(e) => setParam('language', e.target.value)}>
            <option value="">All languages</option>
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
          <select aria-label="Sort by" value={sort} onChange={(e) => setParam('sort', e.target.value === 'rating' ? '' : e.target.value)}>
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="genre-chips">
        <button className={!genre ? 'active' : ''} onClick={() => setParam('genre', '')}>All</button>
        {GENRES.map((g) => (
          <button key={g} className={genre === g ? 'active' : ''} onClick={() => setParam('genre', genre === g ? '' : g)}>{g}</button>
        ))}
      </div>

      <div className="results-bar">
        <p className="muted">
          {!loading && !error && `${total} movie${total === 1 ? '' : 's'}`}
          {search && ` for “${search}”`}
        </p>
        {hasFilters && <button className="link-btn" onClick={clearFilters}>Clear filters</button>}
      </div>

      {error && <div className="alert error">{error}</div>}
      {loading ? (
        <MovieGridSkeleton />
      ) : movies.length === 0 && !error ? (
        <div className="center-msg">
          <p>No movies found.</p>
          {hasFilters && <button className="btn" onClick={clearFilters}>Clear filters</button>}
        </div>
      ) : (
        <div className="grid">{movies.map((m) => <MovieCard key={m._id} movie={m} />)}</div>
      )}
    </div>
  )
}
