import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, Plane, User, LogOut, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logoutUser } = useAuth()
  const [menuOpen, setMenuOpen]   = useState(false)
  const [dropOpen, setDropOpen]   = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/')
    setDropOpen(false)
  }

  const navLinks = [
    { to: '/',            label: 'Home' },
    { to: '/destinations',label: 'Destinations' },
    { to: '/packages',    label: 'Packages' },
    { to: '/about',       label: 'About' },
    { to: '/contact',     label: 'Contact' },
  ]

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-brand-600 font-bold text-xl">
            <Plane className="w-6 h-6" />
            TravelEase
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-gray-600 hover:text-brand-600 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn() ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700
                             hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center
                                  justify-center text-brand-600 font-semibold text-sm">
                    {user?.fullName?.[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.fullName}</span>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg
                                  border border-gray-100 py-1 z-50">
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700
                                   hover:bg-gray-50"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    {!isAdmin() && (
                      <>
                        <Link
                          to="/my-bookings"
                          onClick={() => setDropOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm
                                     text-gray-700 hover:bg-gray-50"
                        >
                          <Plane className="w-4 h-4" /> My Bookings
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setDropOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm
                                     text-gray-700 hover:bg-gray-50"
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                      </>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm
                                 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-brand-600 px-4 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium mb-1 ${
                  isActive ? 'text-brand-600 bg-brand-50' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <hr className="my-3 border-gray-100" />
          {isLoggedIn() ? (
            <>
              {!isAdmin() && (
                <>
                  <Link to="/my-bookings" onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mb-1">
                    My Bookings
                  </Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mb-1">
                    Profile
                  </Link>
                </>
              )}
              {isAdmin() && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mb-1">
                  Admin Dashboard
                </Link>
              )}
              <button onClick={() => { handleLogout(); setMenuOpen(false) }}
                className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 mt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="flex-1 text-center btn-outline text-sm py-2">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="flex-1 text-center btn-primary text-sm py-2">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
