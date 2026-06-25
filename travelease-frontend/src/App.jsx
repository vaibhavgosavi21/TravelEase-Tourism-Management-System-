import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute, AdminRoute } from './components/common/RouteGuards'

// Public Pages
import Home          from './pages/Home'
import Packages      from './pages/Packages'
import PackageDetail from './pages/PackageDetail'
import Destinations  from './pages/Destinations'
import About         from './pages/About'
import Contact       from './pages/Contact'
import Login         from './pages/Login'
import Register      from './pages/Register'
import NotFound      from './pages/NotFound'

// Customer Pages
import Booking       from './pages/Booking'
import MyBookings    from './pages/MyBookings'
import Profile       from './pages/Profile'

// Admin Pages
import AdminDashboard  from './pages/admin/AdminDashboard'
import AdminPackages   from './pages/admin/AdminPackages'
import AdminBookings   from './pages/admin/AdminBookings'
import AdminUsers      from './pages/admin/AdminUsers'
import AdminReviews    from './pages/admin/AdminReviews'
import AdminMessages   from './pages/admin/AdminMessages'
import AdminDestinations from './pages/admin/AdminDestinations'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/"               element={<Home />} />
        <Route path="/packages"       element={<Packages />} />
        <Route path="/packages/:id"   element={<PackageDetail />} />
        <Route path="/destinations"   element={<Destinations />} />
        <Route path="/about"          element={<About />} />
        <Route path="/contact"        element={<Contact />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />

        {/* Customer Protected Routes */}
        <Route path="/booking/:id" element={
          <ProtectedRoute><Booking /></ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute><MyBookings /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="/admin/packages" element={
          <AdminRoute><AdminPackages /></AdminRoute>
        } />
        <Route path="/admin/bookings" element={
          <AdminRoute><AdminBookings /></AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute><AdminUsers /></AdminRoute>
        } />
        <Route path="/admin/reviews" element={
          <AdminRoute><AdminReviews /></AdminRoute>
        } />
        <Route path="/admin/messages" element={
          <AdminRoute><AdminMessages /></AdminRoute>
        } />
        <Route path="/admin/destinations" element={
          <AdminRoute><AdminDestinations /></AdminRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}
