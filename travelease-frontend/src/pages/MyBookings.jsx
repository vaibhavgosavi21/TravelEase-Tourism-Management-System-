import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin, XCircle } from 'lucide-react'
import Layout from '../components/layout/Layout'
import Spinner from '../components/common/Spinner'
import Empty from '../components/common/Empty'
import { useFetch } from '../hooks/useFetch'
import { getMyBookings, cancelBooking } from '../api/bookings'
import { formatPrice, formatDate, getStatusBadge, getErrorMessage } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function MyBookings() {
  const { data: bookings, loading, refetch } = useFetch(getMyBookings)
  const [cancellingId, setCancellingId]      = useState(null)

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    setCancellingId(id)
    try {
      await cancelBooking(id)
      toast.success('Booking cancelled. Seats have been released.')
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage all your tour bookings
          </p>
        </div>

        {loading ? <Spinner /> : (bookings || []).length === 0 ? (
          <div className="text-center py-16">
            <Empty message="No bookings yet" />
            <Link to="/packages" className="btn-primary mt-4 inline-block">
              Browse Packages
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {(bookings || []).map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancel}
                cancelling={cancellingId === booking.id}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

function BookingCard({ booking, onCancel, cancelling }) {
  const canCancel = ['PENDING', 'CONFIRMED'].includes(booking.status)

  return (
    <div className="card p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-lg text-gray-900">{booking.packageTitle}</h3>
            <span className={getStatusBadge(booking.status)}>{booking.status}</span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {booking.destinationName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(booking.travelDate)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {booking.numTravelers} traveler(s)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Total Paid</p>
              <p className="text-xl font-bold text-brand-600">
                {formatPrice(booking.totalPrice)}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Booked on {formatDate(booking.createdAt)}
            </p>
          </div>
        </div>

        {/* Booking ID & Actions */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3">
          <p className="text-xs text-gray-400 font-mono bg-gray-100
                        px-2 py-1 rounded">
            #{booking.id}
          </p>

          {canCancel && (
            <button
              onClick={() => onCancel(booking.id)}
              disabled={cancelling}
              className="flex items-center gap-1.5 text-sm text-red-600
                         hover:text-red-800 border border-red-200 hover:border-red-400
                         px-3 py-1.5 rounded-lg transition-colors duration-150
                         disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              {cancelling ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
