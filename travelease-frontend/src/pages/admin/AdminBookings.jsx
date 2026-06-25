import { useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Spinner from '../../components/common/Spinner'
import { useFetch } from '../../hooks/useFetch'
import { getAllBookings, updateBookingStatus } from '../../api/bookings'
import { formatPrice, formatDate, getStatusBadge, getErrorMessage } from '../../utils/helpers'
import toast from 'react-hot-toast'

const STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']

export default function AdminBookings() {
  const { data: bookings, loading, refetch } = useFetch(getAllBookings)
  const [updatingId, setUpdatingId]          = useState(null)

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id)
    try {
      await updateBookingStatus(id, status)
      toast.success('Status updated')
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-500 text-sm mt-1">
            {bookings?.length || 0} total bookings
          </p>
        </div>

        {loading ? <Spinner /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-xs text-gray-500 uppercase">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3">Destination</th>
                    <th className="px-4 py-3">Travel Date</th>
                    <th className="px-4 py-3">Travelers</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Booked On</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(bookings || []).map(b => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-gray-500">#{b.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900
                                     max-w-[160px] truncate">
                        {b.packageTitle}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{b.destinationName}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(b.travelDate)}
                      </td>
                      <td className="px-4 py-3 text-center">{b.numTravelers}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {formatPrice(b.totalPrice)}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(b.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={b.status}
                          disabled={updatingId === b.id}
                          onChange={e => handleStatusChange(b.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1
                                     focus:outline-none focus:ring-1 focus:ring-brand-500
                                     bg-white cursor-pointer"
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!bookings || bookings.length === 0) && (
                <p className="text-center text-gray-400 text-sm py-10">No bookings yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
