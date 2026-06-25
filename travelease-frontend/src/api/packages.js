import api from './axios'

export const getPackages = (params) => api.get('/api/v1/packages', { params })
export const getPackageById = (id)  => api.get(`/api/v1/packages/${id}`)

// Admin
export const getAllPackagesAdmin = ()         => api.get('/api/v1/admin/packages')
export const createPackage       = (data)     => api.post('/api/v1/admin/packages', data)
export const updatePackage       = (id, data) => api.put(`/api/v1/admin/packages/${id}`, data)
export const deletePackage       = (id)       => api.delete(`/api/v1/admin/packages/${id}`)
