import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Calendar, Users, MapPin, Star, Clock } from 'lucide-react'
import Layout from '../components/layout/Layout'
import Spinner from '../components/common/Spinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { useAuth } from '../context/AuthContext'
import { useFetch } from '../hooks/useFetch'
import { getPackageById } from '../api/packages'
import { getReviewsByPackage, submitReview } from '../api/index'
import { formatPrice, formatDate, getStars, getErrorMessage } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function PackageDetail() {
  const { id }                = useParams()
  const { isLoggedIn }        = useAuth()
  const navigate              = useNavigate()
  const { data: pkg, loading, error } = useFetch(() => getPackageById(id), [id])
  const { data: reviews, refetch } = useFetch(() => getReviewsByPackage(id), [id])

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!isLoggedIn()) {
      navigate('/login', { state: { from: `/packages/${id}` } })
      return
    }
    setSubmitting(true)
    try {
      await submitReview({ packageId: parseInt(id), ...reviewForm })
      toast.success('Review submitted!')
      setReviewForm({ rating: 5, comment: '' })
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Layout><Spinner /></Layout>
  if (error)   return <Layout><ErrorMessage message={error} /></Layout>
  if (!pkg)    return <Layout><ErrorMessage message="Package not found" /></Layout>

  const imgSrc = pkg.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80'
  const avgRating = reviews?.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left — Image & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img src={imgSrc} alt={pkg.title} className="w-full h-96 object-cover" />
            </div>

            {/* Info */}
            <div>
              {pkg.category && (
                <span className="inline-block bg-brand-50 text-brand-700 text-xs
                                 font-medium px-3 py-1 rounded-full mb-3">
                  {pkg.category}
                </span>
              )}
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{pkg.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-6">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {pkg.destinationName}, {pkg.country}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {pkg.durationDays} Days / {pkg.durationDays - 1} Nights
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {avgRating > 0 ? `${avgRating} (${reviews.length} reviews)` : 'No reviews'}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {pkg.description || 'No description available.'}
              </p>
            </div>

            {/* Reviews */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Reviews ({reviews?.length || 0})
              </h2>

              {reviews?.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {reviews.map(r => (
                    <div key={r.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">{r.userName}</p>
                        <span className="text-yellow-400 text-sm">{getStars(r.rating)}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{r.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDate(r.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm mb-8">No reviews yet. Be the first!</p>
              )}

              {/* Submit Review */}
              <form onSubmit={handleReviewSubmit} className="bg-white border border-gray-200
                                                              rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Leave a Review</h3>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className={`w-8 h-8 text-2xl ${
                          star <= reviewForm.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Comment</label>
                  <textarea
                    rows="3"
                    placeholder="Share your experience..."
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>

          {/* Right — Booking Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Starting from</p>
                <p className="text-3xl font-bold text-brand-600">
                  {formatPrice(pkg.pricePerPerson)}
                </p>
                <p className="text-xs text-gray-500">per person</p>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Duration
                  </span>
                  <span className="font-medium text-gray-900">
                    {pkg.durationDays} Days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Seats Available
                  </span>
                  <span className="font-medium text-gray-900">
                    {pkg.availableSeats}/{pkg.maxSeats}
                  </span>
                </div>
              </div>

              {pkg.availableSeats > 0 ? (
                <Link to={isLoggedIn() ? `/booking/${pkg.id}` : '/login'}
                  state={isLoggedIn() ? null : { from: `/packages/${pkg.id}` }}
                  className="btn-primary w-full text-center block">
                  Book Now
                </Link>
              ) : (
                <button disabled className="btn-primary w-full opacity-50 cursor-not-allowed">
                  Sold Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
