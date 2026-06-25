import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Spinner from '../../components/common/Spinner'
import { useFetch } from '../../hooks/useFetch'
import { getAllPackagesAdmin, createPackage, updatePackage, deletePackage } from '../../api/packages'
import { getAllDestinationsAdmin } from '../../api/destinations'
import { formatPrice, getErrorMessage } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminPackages() {
  const { data: packages, loading, refetch } = useFetch(getAllPackagesAdmin)
  const { data: destinations }               = useFetch(getAllDestinationsAdmin)
  const [modal, setModal]                    = useState(null) // null | 'create' | package obj
  const [deleting, setDeleting]              = useState(null)

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package?')) return
    setDeleting(id)
    try {
      await deletePackage(id)
      toast.success('Package deleted')
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Tour Packages</h2>
          <button onClick={() => setModal('create')} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Package
          </button>
        </div>

        {loading ? <Spinner /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-xs text-gray-500 uppercase">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Destination</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Seats</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(packages || []).map(pkg => (
                    <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">
                        {pkg.title}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{pkg.destinationName}</td>
                      <td className="px-4 py-3 font-semibold text-brand-600">
                        {formatPrice(pkg.pricePerPerson)}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{pkg.durationDays}d</td>
                      <td className="px-4 py-3 text-gray-500">
                        {pkg.availableSeats}/{pkg.maxSeats}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full
                          ${pkg.availableSeats > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'}`}>
                          {pkg.availableSeats > 0 ? 'Available' : 'Sold Out'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setModal(pkg)}
                            className="p-1.5 text-gray-500 hover:text-brand-600
                                       hover:bg-brand-50 rounded-lg transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(pkg.id)}
                            disabled={deleting === pkg.id}
                            className="p-1.5 text-gray-500 hover:text-red-600
                                       hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!packages || packages.length === 0) && (
                <p className="text-center text-gray-400 text-sm py-10">No packages found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {modal && (
        <PackageModal
          pkg={modal === 'create' ? null : modal}
          destinations={destinations || []}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); refetch() }}
        />
      )}
    </AdminLayout>
  )
}

function PackageModal({ pkg, destinations, onClose, onSaved }) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: pkg ? {
      title:          pkg.title,
      description:    pkg.description,
      destinationId:  pkg.destinationId,
      pricePerPerson: pkg.pricePerPerson,
      durationDays:   pkg.durationDays,
      maxSeats:       pkg.maxSeats,
      category:       pkg.category,
      imageUrl:       pkg.imageUrl,
    } : {},
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = { ...data, destinationId: parseInt(data.destinationId),
                        pricePerPerson: parseFloat(data.pricePerPerson),
                        durationDays: parseInt(data.durationDays),
                        maxSeats: parseInt(data.maxSeats) }
      if (pkg) {
        await updatePackage(pkg.id, payload)
        toast.success('Package updated')
      } else {
        await createPackage(payload)
        toast.success('Package created')
      }
      onSaved()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center
                    justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg my-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-900">
            {pkg ? 'Edit Package' : 'New Package'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
            <input className={`input-field ${errors.title ? 'border-red-400' : ''}`}
              {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Destination</label>
              <select className="input-field"
                {...register('destinationId', { required: true })}>
                <option value="">Select...</option>
                {destinations.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select className="input-field" {...register('category')}>
                <option value="">None</option>
                {['Beach','Adventure','Nature','Cultural','Honeymoon'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹)</label>
              <input type="number" className="input-field"
                {...register('pricePerPerson', { required: true, min: 1 })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Days</label>
              <input type="number" className="input-field"
                {...register('durationDays', { required: true, min: 1 })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Seats</label>
              <input type="number" className="input-field"
                {...register('maxSeats', { required: true, min: 1 })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
            <input className="input-field" placeholder="https://..." {...register('imageUrl')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea rows={3} className="input-field" {...register('description')} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : pkg ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
