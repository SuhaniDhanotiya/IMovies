import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useToast } from '../components/Toast'
import { TicketCard } from './Checkout'
import { useTitle } from '../hooks'

export default function MyBookings() {
  const toast = useToast()
  const [bookings, setBookings] = useState(null)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('upcoming')
  useTitle('My Bookings')

  const load = () => api.get('/bookings/my').then((d) => setBookings(d.bookings)).catch((e) => setError(e.message))
  useEffect(() => { load() }, [])

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try { const d = await api.put(`/bookings/${id}/cancel`); toast(d.message); load() } catch (e) { toast(e.message, 'error') }
  }

  if (error) return <div className="page"><div className="alert error">{error}</div></div>
  if (!bookings) return <div className="center-msg">Loading…</div>

  const now = Date.now()
  const isPast = (b) => new Date(b.show.startTime) < now
  const groups = {
    upcoming: bookings.filter((b) => ['pending', 'confirmed'].includes(b.status) && !isPast(b)),
    past: bookings.filter((b) => b.status === 'confirmed' && isPast(b)),
    cancelled: bookings.filter((b) => ['cancelled', 'expired'].includes(b.status) || (b.status === 'pending' && isPast(b))),
  }
  const list = groups[tab]

  return (
    <div className="page narrow">
      <h1>My Bookings</h1>
      {bookings.length === 0 && <p className="muted">No bookings yet. <Link to="/">Browse movies</Link></p>}
      {bookings.length > 0 && (
        <div className="tabs">
          {Object.keys(groups).map((k) => (
            <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)} style={{ textTransform: 'capitalize' }}>
              {k} ({groups[k].length})
            </button>
          ))}
        </div>
      )}
      {bookings.length > 0 && list.length === 0 && <p className="muted">Nothing in this tab.</p>}
      {list.map((b) => (
        <div key={b._id}>
          <TicketCard booking={b} />
          <div className="row-gap ticket-actions">
            {b.status === 'pending' && <Link className="btn" to={`/checkout/${b._id}`}>Pay now</Link>}
            {['pending', 'confirmed'].includes(b.status) && <button className="btn btn-ghost" onClick={() => cancel(b._id)}>Cancel booking</button>}
          </div>
        </div>
      ))}
    </div>
  )
}
