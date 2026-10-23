import { Link } from 'react-router-dom'
import { useTitle } from '../hooks'

export default function NotFound() {
  useTitle('Page not found')
  return (
    <div className="center-msg">
      <h1>404</h1>
      <p>This page left before the credits rolled.</p>
      <p><Link className="btn" to="/">Back to movies</Link></p>
    </div>
  )
}
