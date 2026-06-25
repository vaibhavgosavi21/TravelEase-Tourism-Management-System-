import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import Layout from '../components/layout/Layout'
import PackageCard from '../components/packages/PackageCard'
import Spinner from '../components/common/Spinner'
import Empty from '../components/common/Empty'
import { getPackages } from '../api/packages'

const CATEGORIES = ['Beach', 'Adventure', 'Nature', 'Cultural', 'Honeymoon']

export default function Packages() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [packages, setPackages]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [showFilter, setShowFilter]     = useState(false)

  const [filters, setFilters] = useState({
    search:        searchParams.get('search')        || '',
    category:      searchParams.get('category')      || '',
    minPrice:      searchParams.get('minPrice')      || '',
    maxPrice:      searchParams.get('maxPrice')      || '',
    destinationId: searchParams.get('destinationId') || '',
  })

  const fetchPackages = async (f) => {
    setLoading(true)
    try {
      const params = {}
      if (f.search)        params.search        = f.search
      if (f.category)      params.category      = f.category
      if (f.minPrice)      params.minPrice      = f.minPrice
      if (f.maxPrice)      params.maxPrice      = f.maxPrice
      if (f.destinationId) params.destinationId = f.destinationId

      const res = await getPackages(params)
      setPackages(res.data.data || [])
    } catch {
      setPackages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPackages(filters) }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPackages(filters)
    setSearchParams(Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '')
    ))
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    const reset = { search: '', category: '', minPrice: '', maxPrice: '', destinationId: '' }
    setFilters(reset)
    setSearchParams({})
    fetchPackages(reset)
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-indigo-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Tour Packages</h1>
          <p className="text-blue-100 text-lg">
            Find the perfect package for your next adventure
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch}
            className="flex gap-2 max-w-2xl mx-auto mt-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2
                                  w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations, packages..."
                value={filters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-white text-sm"
              />
            </div>
            <button type="submit" className="bg-white text-brand-600 font-semibold
                                              px-6 py-3 rounded-xl hover:bg-gray-100
                                              transition-colors duration-150">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">

          {/* Filter Sidebar — Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onApply={() => fetchPackages(filters)}
              onClear={clearFilters}
              hasActive={hasActiveFilters}
            />
          </aside>

          {/* Package Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {loading ? 'Loading...' : `${packages.length} packages found`}
              </p>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="lg:hidden flex items-center gap-2 text-sm text-brand-600
                           font-medium border border-brand-200 px-4 py-2 rounded-lg"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
                {hasActiveFilters && (
                  <span className="bg-brand-600 text-white text-xs rounded-full
                                   w-5 h-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Filter */}
            {showFilter && (
              <div className="lg:hidden mb-6 p-4 bg-gray-50 rounded-xl border
                              border-gray-200">
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                  onApply={() => { fetchPackages(filters); setShowFilter(false) }}
                  onClear={clearFilters}
                  hasActive={hasActiveFilters}
                />
              </div>
            )}

            {loading ? <Spinner /> : packages.length === 0 ? (
              <Empty message="No packages found. Try different filters." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {packages.map(pkg => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

function FilterSidebar({ filters, onChange, onApply, onClear, hasActive }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActive && (
          <button onClick={onClear}
            className="text-xs text-red-500 flex items-center gap-1 hover:text-red-700">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Category</p>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => onChange('category', filters.category === cat ? '' : cat)}
                className="text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-gray-600">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Price Range (₹)</p>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={e => onChange('minPrice', e.target.value)}
            className="input-field text-sm"
          />
          <input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={e => onChange('maxPrice', e.target.value)}
            className="input-field text-sm"
          />
        </div>
      </div>

      <button onClick={onApply} className="btn-primary w-full text-sm">
        Apply Filters
      </button>
    </div>
  )
}
