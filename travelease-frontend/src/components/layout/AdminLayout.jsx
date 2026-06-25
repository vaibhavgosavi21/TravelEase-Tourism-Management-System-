import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Package, CalendarCheck, Users,
  Star, MessageSquare, MapPin, Plane, LogOut, Menu, X
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/admin',               icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
  { to: '/admin/packages',      icon: <Package className="w-5 h-5" />,         label: 'Packages' },
  { to: '/admin/destinations',  icon: <MapPin className="w-5 h-5" />,          label: 'Destinations' },
  { to: '/admin/bookings',      icon: <CalendarCheck className="w-5 h-5" />,   label: 'Bookings' },
  { to: '/admin/users',         icon: <Users className="w-5 h-5" />,           label: 'Users' },
  { to: '/admin/reviews',       icon: <Star className="w-5 h-5" />,            label: 'Reviews' },
  { to: '/admin/messages',      icon: <MessageSquare className="w-5 h-5" />,   label: 'Messages' },
]

export default function AdminLayout({ children }) {
  const { logoutUser, user } = useAuth()
  const navigate             = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white
        flex flex-col transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16
                        border-b border-gray-800">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Plane className="w-5 h-5 text-brand-400" />
            TravelEase
          </div>
          <button onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
                 font-medium transition-colors duration-150 ${
                   isActive
                     ? 'bg-brand-600 text-white'
                     : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                 }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center
                            justify-center font-bold text-sm">
              {user?.fullName?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-3 py-2
                       text-sm text-gray-400 hover:text-white hover:bg-gray-800
                       rounded-lg transition-colors duration-150"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center
                           px-4 sm:px-6 gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
