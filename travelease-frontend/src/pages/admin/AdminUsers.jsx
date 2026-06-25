import { useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Spinner from '../../components/common/Spinner'
import { useFetch } from '../../hooks/useFetch'
import { getAllUsers, toggleUserStatus } from '../../api/index'
import { formatDate, getErrorMessage } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const { data: users, loading, refetch } = useFetch(getAllUsers)
  const [togglingId, setTogglingId]       = useState(null)

  const handleToggle = async (id) => {
    setTogglingId(id)
    try {
      const res = await toggleUserStatus(id)
      toast.success(res.data.message)
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-500 text-sm mt-1">
            {users?.length || 0} registered users
          </p>
        </div>

        {loading ? <Spinner /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-xs text-gray-500 uppercase">
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(users || []).map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100
                                          flex items-center justify-center text-brand-600
                                          font-semibold text-sm flex-shrink-0">
                            {u.fullName?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{u.fullName}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{u.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full
                          ${u.role === 'ROLE_ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'}`}>
                          {u.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full
                          ${u.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'}`}>
                          {u.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {u.role !== 'ROLE_ADMIN' && (
                          <button
                            onClick={() => handleToggle(u.id)}
                            disabled={togglingId === u.id}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg
                                        border transition-colors duration-150
                                        disabled:opacity-50 ${
                              u.isActive
                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                : 'border-green-200 text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {togglingId === u.id
                              ? '...'
                              : u.isActive ? 'Disable' : 'Enable'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!users || users.length === 0) && (
                <p className="text-center text-gray-400 text-sm py-10">No users found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
