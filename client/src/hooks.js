import { useEffect, useState } from 'react'

// Dark / light theme, saved in localStorage and applied as <html data-theme="...">
export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch { /* private mode */ }
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

// Sets the browser tab title, e.g. useTitle('Inception') -> "Inception · iMovies"
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · iMovies` : 'iMovies - Book Movie Tickets'
  }, [title])
}
