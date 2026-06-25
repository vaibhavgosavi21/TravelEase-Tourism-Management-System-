import AdminLayout from '../../components/layout/AdminLayout'
import Spinner from '../../components/common/Spinner'
import { useFetch } from '../../hooks/useFetch'
import { getDashboard } from '../../api/index'
import { formatPrice, formatDate, getStatusBadge } from '../../utils/helpers'
import { Users, Package, CalendarCheck, IndianRupee,
         Clock, CheckCircle, XCircle, Star } from 'lucide-react'

export default function AdminDashboard() {
  const { data, loading } = useFetch(getDashboard)

  if (loading) return <AdminLayout><Spinner /></AdminLayout>

  const stats = [
    {
      label: 'Total Users',
      value: data?.totalUsers ?? 0,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Bookings',
      value: data?.totalBookings ?? 0,
      icon: <CalendarCheck className="w-6 h-6" />,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Total Revenue',
      value: formatPrice(data?.totalRevenue ?? 0),
      icon: <IndianRupee className="w-6 h-6" />,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      label: 'Unread Messages',
      value: data?.unreadMessages ?? 0,
      icon: <Star className="w-6 h-6" />,
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  const bookingStats = [
    { label: 'Pending',   value: data?.pendingBookings,   color: 'text-yellow-600', icon: <Clock className="w-5 h-5" /> },
    { label: 'Confirmed', value: data?.confirmedBookings, color: 'text-green-600',  icon: <CheckCircle className="w-5 h-5" /> },
    { label: 'Cancelled', value: data?.cancelledBookings, color: 'text-red-600',    icon: <XCircle className="w-5 h-5" /> },
    { label: 'Completed', value: data?.completedBookings, color: 'text-blue-600',   icon: <Package className="w-5 h-5" /> },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">{s.label}</p>
                <div className={`w-10 h-10 rounded-xl flex items-center
                                 justify-center ${s.color}`}>
                  {s.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Booking Status Breakdown */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Booking Status Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {bookingStats.map((s, i) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className={`flex items-center justify-center mb-2 ${s.color}`}>
                  {s.icon}
                </div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase
                               border-b border-gray-100">
                  <th className="pb-3 pr-4">Booking #</th>
                  <th className="pb-3 pr-4">Package</th>
                  <th className="pb-3 pr-4">Travel Date</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(data?.recentBookings || []).map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4 font-mono text-gray-500">#{b.id}</td>
                    <td className="py-3 pr-4 font-medium text-gray-900 max-w-[180px] truncate">
                      {b.packageTitle}
                    </td>
                    <td className="py-3 pr-4 text-gray-500">
                      {formatDate(b.travelDate)}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-gray-900">
                      {formatPrice(b.totalPrice)}
                    </td>
                    <td className="py-3">
                      <span className={getStatusBadge(b.status)}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!data?.recentBookings || data.recentBookings.length === 0) && (
              <p className="text-center text-gray-400 text-sm py-8">No bookings yet</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
