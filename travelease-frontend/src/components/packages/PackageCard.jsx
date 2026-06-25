import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin } from 'lucide-react'
import { formatPrice } from '../../utils/helpers'
import { motion } from 'framer-motion'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80'

export default function PackageCard({ pkg }) {
  const imgSrc = pkg.imageUrl || FALLBACK_IMAGE

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/packages/${pkg.id}`} className="block card overflow-hidden group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imgSrc}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-105
                       transition-transform duration-500"
          />
          {pkg.category && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm
                             px-3 py-1 rounded-full text-xs font-medium text-gray-700">
              {pkg.category}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1
                         group-hover:text-brand-600 transition-colors duration-150">
            {pkg.title}
          </h3>

          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4" />
            {pkg.destinationName}, {pkg.country}
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {pkg.durationDays} Days
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {pkg.availableSeats}/{pkg.maxSeats} Seats
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Starting from</p>
              <p className="text-xl font-bold text-brand-600">
                {formatPrice(pkg.pricePerPerson)}
              </p>
            </div>
            <span className="btn-primary text-sm py-2 px-5 group-hover:bg-brand-700">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
