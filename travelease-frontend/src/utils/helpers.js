// Format price in Indian Rupees
export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

// Format date to readable string
export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

// Get Tailwind badge class based on booking status
export const getStatusBadge = (status) => {
  const map = {
    PENDING:   'badge-pending',
    CONFIRMED: 'badge-confirmed',
    CANCELLED: 'badge-cancelled',
    COMPLETED: 'badge-completed',
  }
  return map[status] || 'badge-pending'
}

// Extract error message from Axios error
export const getErrorMessage = (error) =>
  error?.response?.data?.message || 'Something went wrong. Please try again.'

// Get star rating display
export const getStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating)
