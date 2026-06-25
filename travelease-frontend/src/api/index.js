import api from './axios'

// User
export const getMyProfile      = ()       => api.get('/api/v1/users/me')
export const updateMyProfile   = (data)   => api.put('/api/v1/users/me', data)
export const changePassword    = (data)   => api.put('/api/v1/users/me/change-password', data)

// Admin Users
export const getAllUsers        = ()     => api.get('/api/v1/admin/users')
export const toggleUserStatus  = (id)   => api.put(`/api/v1/admin/users/${id}/toggle-status`)

// Reviews
export const getReviewsByPackage = (packageId) =>
  api.get(`/api/v1/reviews/package/${packageId}`)
export const submitReview      = (data) => api.post('/api/v1/reviews', data)
export const getAllReviews      = ()     => api.get('/api/v1/admin/reviews')
export const deleteReview      = (id)   => api.delete(`/api/v1/admin/reviews/${id}`)

// Contact
export const submitContact     = (data) => api.post('/api/v1/contact', data)
export const getAllMessages     = ()     => api.get('/api/v1/admin/contact')
export const markMessageRead   = (id)   => api.put(`/api/v1/admin/contact/${id}/read`)
export const getUnreadCount    = ()     => api.get('/api/v1/admin/contact/unread-count')

// Dashboard
export const getDashboard      = ()     => api.get('/api/v1/admin/dashboard')
