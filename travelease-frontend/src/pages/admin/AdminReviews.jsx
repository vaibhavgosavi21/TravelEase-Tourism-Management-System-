import { useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Spinner from '../../components/common/Spinner'
import { useFetch } from '../../hooks/useFetch'
import { getAllReviews, deleteReview } from '../../api/index'
import { formatDate, getStars, getErrorMessage } from '../../utils/helpers'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminReviews() {
  const { data: reviews, loading, refetch } = useFetch(getAllReviews)
  const [deletingId, setDeletingId]         = useState(null)

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return
    setDeletingId(id)
    try {
      await deleteReview(id)
      toast.success('Review deleted')
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          <p className="text-gray-500 text-sm mt-1">
            {reviews?.length || 0} total reviews
          </p>
        </div>

        {loading ? <Spinner /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-xs text-gray-500 uppercase">
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Comment</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(reviews || []).map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{r.userName}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[140px] truncate">
                        {r.packageTitle}
                      </td>
                      <td className="px-4 py-3 text-yellow-500 text-xs">
                        {getStars(r.rating)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                        {r.comment || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(r.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(r.id)}
                          disabled={deletingId === r.id}
                          className="p-1.5 text-gray-400 hover:text-red-600
                                     hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!reviews || reviews.length === 0) && (
                <p className="text-center text-gray-400 text-sm py-10">No reviews yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
