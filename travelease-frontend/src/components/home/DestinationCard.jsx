import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

const FALLBACK_IMAGES = {
  'Goa':             'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600&q=80',
  'Manali':          'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&q=80',
  'Kerala':          'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
  'Rajasthan':       'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
  'Andaman Islands': 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=600&q=80',
}

export default function DestinationCard({ destination }) {
  const imgSrc = destination.imageUrl ||
    FALLBACK_IMAGES[destination.name] ||
    `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80`

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/packages?destinationId=${destination.id}&search=${destination.name}`}
        className="block card overflow-hidden group"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={imgSrc}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105
                       transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-3 text-white">
            <h3 className="font-bold text-lg">{destination.name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-200">
              <MapPin className="w-3 h-3" />
              {destination.country}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-gray-500 text-sm line-clamp-2">
            {destination.description || 'Explore this amazing destination'}
          </p>
          <span className="inline-block mt-3 text-brand-600 text-sm font-medium
                           group-hover:underline">
            View packages →
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
