import api from './axios'

export const getDestinations    = ()     => api.get('/api/v1/destinations')
export const getDestinationById = (id)   => api.get(`/api/v1/destinations/${id}`)

// Admin
export const createDestination  = (data) => api.post('/api/v1/admin/destinations', data)
export const updateDestination  = (id, data) => api.put(`/api/v1/admin/destinations/${id}`, data)
export const deleteDestination  = (id)   => api.delete(`/api/v1/admin/destinations/${id}`)
export const getAllDestinationsAdmin = () => api.get('/api/v1/admin/destinations')
