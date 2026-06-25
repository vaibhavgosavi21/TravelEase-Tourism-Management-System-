import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Calendar, Users, MapPin, IndianRupee } from 'lucide-react'
import Layout from '../components/layout/Layout'
import Spinner from '../components/common/Spinner'
import { useFetch } from '../hooks/useFetch'
import { getPackageById } from '../api/packages'
import { createBooking } from '../api/bookings'
import { formatPrice, getErrorMessage } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function Booking() {
  const { id }          = useParams()
  const navigate        = useNavigate()
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const { data: pkg, loading: pkgLoading } = useFetch(() => getPackageById(id), [id])

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { numTravelers: 1 },
  })

  const numTravelers = parseInt(watch('numTravelers') || 1)
  const totalPrice   = pkg ? pkg.pricePerPerson * numTravelers : 0

  const today = new Date()
  today.setDate(today.getDate() + 1)
  const minDate = today.toISOString().split('T')[0]

  const onSubmit = async (data) => {
    setLoading(true)
    setServerError('')
    try {
      const res = await createBooking({
        packageId:    parseInt(id),
        travelDate:   data.travelDate,
        numTravelers: parseInt(data.numTravelers),
      })
      toast.success('Booking confirmed! Check your email for the invoice.')
      navigate('/my-bookings')
    } catch (err) {
      setServerError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (pkgLoading) return <Layout><Spinner /></Layout>
  if (!pkg)       return <Layout><p className="p-8 text-gray-500">Package not found.</p></Layout>

  const imgSrc = pkg.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80'

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — Form */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Booking Details</h2>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm
                              px-4 py-3 rounded-lg mb-5">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Travel Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Travel Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  className={`input-field ${errors.travelDate ? 'border-red-400' : ''}`}
                  {...register('travelDate', { required: 'Travel date is required' })}
                />
                {errors.travelDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.travelDate.message}</p>
                )}
              </div>

              {/* Number of Travelers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Users className="inline w-4 h-4 mr-1" />
                  Number of Travelers
                </label>
                <input
                  type="number"
                  min="1"
                  max={pkg.availableSeats}
                  className={`input-field ${errors.numTravelers ? 'border-red-400' : ''}`}
                  {...register('numTravelers', {
                    required: 'Number of travelers is required',
                    min: { value: 1, message: 'At least 1 traveler required' },
                    max: {
                      value: pkg.availableSeats,
                      message: `Only ${pkg.availableSeats} seats available`,
                    },
                  })}
                />
                {errors.numTravelers && (
                  <p className="text-red-500 text-xs mt-1">{errors.numTravelers.message}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {pkg.availableSeats} seats available
                </p>
              </div>

              {/* Price Summary */}
              <div className="bg-brand-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatPrice(pkg.pricePerPerson)} × {numTravelers} traveler(s)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <hr className="border-brand-200" />
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-brand-600 text-lg">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-4 w-4
                                   border-b-2 border-white" />
                ) : (
                  <>
                    <IndianRupee className="w-4 h-4" />
                    Confirm Booking – {formatPrice(totalPrice)}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                You will receive a confirmation email with your invoice after booking.
              </p>
            </form>
          </div>

          {/* Right — Package Summary */}
          <div className="space-y-6">
            <div className="card overflow-hidden">
              <img src={imgSrc} alt={pkg.title}
                className="w-full h-52 object-cover" />
              <div className="p-5">
                <p className="text-xs text-brand-600 font-medium mb-1">{pkg.category}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  {pkg.destinationName}, {pkg.country}
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {pkg.durationDays} Days
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Max {pkg.maxSeats} people
                  </span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm
                            text-blue-700">
              <p className="font-semibold mb-2">What happens next?</p>
              <ul className="space-y-1 text-xs list-disc list-inside">
                <li>Your booking will be confirmed instantly</li>
                <li>A PDF invoice will be generated automatically</li>
                <li>Confirmation email sent to your registered email</li>
                <li>You can view and cancel from My Bookings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
