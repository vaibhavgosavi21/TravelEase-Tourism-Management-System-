import { Link } from 'react-router-dom'
import { Plane, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <Plane className="w-5 h-5 text-brand-400" />
              TravelEase
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Discover the world with TravelEase. We offer handpicked tour packages
              to the most beautiful destinations in India and beyond.
            </p>
            <div className="flex flex-col gap-2 mt-5 text-sm">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" /> hello@travelease.com
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" /> +91 9657160283
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" /> Pune, India
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/',             label: 'Home' },
                { to: '/destinations', label: 'Destinations' },
                { to: '/packages',     label: 'Tour Packages' },
                { to: '/about',        label: 'About Us' },
                { to: '/contact',      label: 'Contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="hover:text-white transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              {['Beach', 'Adventure', 'Nature', 'Cultural', 'Honeymoon'].map(cat => (
                <li key={cat}>
                  <Link to={`/packages?category=${cat}`}
                    className="hover:text-white transition-colors duration-150">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 mb-6" />
        <p className="text-center text-xs text-gray-600">
          © {new Date().getFullYear()} TravelEase. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
