import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Spinner from '../../components/common/Spinner'
import { useFetch } from '../../hooks/useFetch'
import { getAllDestinationsAdmin, createDestination,
         updateDestination, deleteDestination } from '../../api/destinations'
import { getErrorMessage } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminDestinations() {
  const { data: destinations, loading, refetch } = useFetch(getAllDestinationsAdmin)
  const [modal, setModal]                        = useState(null)
  const [deleting, setDeleting]                  = useState(null)

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this destination?')) return
    setDeleting(id)
    try {
      await deleteDestination(id)
      toast.success('Destination deleted')
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
          <h2 className="text-2xl font-bold text-gray-900">Destinations</h2>
          <button onClick={() => setModal('create')}
            className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Destination
          </button>
        </div>

        {loading ? <Spinner /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(destinations || []).map(dest => (
              <div key={dest.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{dest.name}</h3>
                    <p className="text-xs text-gray-400">{dest.country}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setModal(dest)}
                      className="p-1.5 text-gray-400 hover:text-brand-600
                                 hover:bg-brand-50 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(dest.id)}
                      disabled={deleting === dest.id}
                      className="p-1.5 text-gray-400 hover:text-red-600
                                 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {dest.description || 'No description'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <DestinationModal
          dest={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); refetch() }}
        />
      )}
    </AdminLayout>
  )
}

function DestinationModal({ dest, onClose, onSaved }) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: dest || {},
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      if (dest) {
        await updateDestination(dest.id, data)
        toast.success('Destination updated')
      } else {
        await createDestination(data)
        toast.success('Destination created')
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
                    justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-900">
            {dest ? 'Edit Destination' : 'New Destination'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <input className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
              <input className={`input-field ${errors.country ? 'border-red-400' : ''}`}
                {...register('country', { required: 'Country is required' })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
            <input className="input-field" placeholder="https://..."
              {...register('imageUrl')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea rows={3} className="input-field" {...register('description')} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : dest ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
