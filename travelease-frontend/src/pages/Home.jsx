import { Link } from 'react-router-dom'
import { Shield, HeadphonesIcon, Star, CreditCard } from 'lucide-react'
import Layout from '../components/layout/Layout'
import Hero from '../components/home/Hero'
import DestinationCard from '../components/home/DestinationCard'
import PackageCard from '../components/packages/PackageCard'
import Spinner from '../components/common/Spinner'
import { useFetch } from '../hooks/useFetch'
import { getDestinations } from '../api/destinations'
import { getPackages } from '../api/packages'

export default function Home() {
  const { data: destinations, loading: destLoading } = useFetch(getDestinations)
  const { data: packages,     loading: pkgLoading  } = useFetch(() => getPackages({}))

  return (
    <Layout>
      {/* Hero */}
      <Hero />

      {/* Destinations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-2">
                Where to go
              </p>
              <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
            </div>
            <Link to="/destinations" className="text-brand-600 text-sm font-medium
                                                hover:underline hidden sm:block">
              View all →
            </Link>
          </div>

          {destLoading ? <Spinner /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(destinations || []).slice(0, 3).map(dest => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-2">
                Top picks
              </p>
              <h2 className="text-3xl font-bold text-gray-900">Featured Tour Packages</h2>
            </div>
            <Link to="/packages" className="text-brand-600 text-sm font-medium
                                            hover:underline hidden sm:block">
              View all →
            </Link>
          </div>

          {pkgLoading ? <Spinner /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(packages || []).slice(0, 4).map(pkg => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-2">
              Why TravelEase
            </p>
            <h2 className="text-3xl font-bold text-gray-900">Travel with Confidence</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-7 h-7" />,
                title: 'Secure Booking',
                desc: 'Your payment and personal data are always protected.',
              },
              {
                icon: <Star className="w-7 h-7" />,
                title: 'Curated Packages',
                desc: 'Every package is handpicked for the best experience.',
              },
              {
                icon: <HeadphonesIcon className="w-7 h-7" />,
                title: '24/7 Support',
                desc: 'Our team is available round the clock to help you.',
              },
              {
                icon: <CreditCard className="w-7 h-7" />,
                title: 'Best Prices',
                desc: 'Competitive pricing with no hidden charges.',
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl border border-gray-100
                                        hover:shadow-md transition-shadow duration-200">
                <div className="inline-flex items-center justify-center w-14 h-14
                                bg-brand-50 text-brand-600 rounded-2xl mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-indigo-600 text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Browse our tour packages and book your dream vacation today.
          </p>
          <Link to="/packages"
            className="inline-flex items-center gap-2 bg-white text-brand-600
                       font-semibold px-8 py-4 rounded-xl hover:bg-gray-100
                       transition-all duration-200 shadow-lg hover:scale-105">
            Explore All Packages
          </Link>
        </div>
      </section>
    </Layout>
  )
}
