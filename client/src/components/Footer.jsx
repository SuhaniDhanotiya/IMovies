import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <Link to="/" className="logo">i<span>Movies</span></Link>
      <div className="footer-links">
        <Link to="/">Now Showing</Link>
        <Link to="/?status=upcoming">Coming Soon</Link>
        <Link to="/bookings">My Bookings</Link>
        <Link to="/admin/login">Admin</Link>
      </div>
      <small>© {new Date().getFullYear()} iMovies. Book smarter, watch better.</small>
    </footer>
  )
}
