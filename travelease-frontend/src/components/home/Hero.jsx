import { Link } from 'react-router-dom'
import { Search, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-brand-600 via-blue-600
                        to-indigo-700 text-white overflow-hidden">

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full
                        blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full
                        blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm
                            px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Your next adventure awaits
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Explore the World <br />
              <span className="text-yellow-300">with TravelEase</span>
            </h1>

            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Discover handpicked tour packages to breathtaking destinations.
              Book with confidence and create memories that last a lifetime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/packages"
                className="inline-flex items-center justify-center gap-2 bg-white
                           text-brand-600 font-semibold px-8 py-4 rounded-xl
                           hover:bg-gray-100 transition-all duration-200 shadow-lg
                           hover:shadow-xl hover:scale-105">
                <Search className="w-5 h-5" />
                Browse Packages
              </Link>
              <Link to="/destinations"
                className="inline-flex items-center justify-center gap-2 bg-transparent
                           border-2 border-white text-white font-semibold px-8 py-4 rounded-xl
                           hover:bg-white hover:text-brand-600 transition-all duration-200">
                View Destinations
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-20"
        >
          {[
            { num: '50+', label: 'Destinations' },
            { num: '100+', label: 'Tour Packages' },
            { num: '5K+', label: 'Happy Travelers' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl font-bold text-yellow-300">{stat.num}</div>
              <div className="text-sm text-blue-100 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
