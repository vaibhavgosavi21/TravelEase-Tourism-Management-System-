import api from './axios'

export const createBooking       = (data) => api.post('/api/v1/bookings', data)
export const getMyBookings       = ()     => api.get('/api/v1/bookings')
export const getMyBookingById    = (id)   => api.get(`/api/v1/bookings/${id}`)
export const cancelBooking       = (id)   => api.put(`/api/v1/bookings/${id}/cancel`)

// Admin
export const getAllBookings       = ()         => api.get('/api/v1/admin/bookings')
export const updateBookingStatus  = (id, status) =>
  api.put(`/api/v1/admin/bookings/${id}/status`, null, { params: { status } })
