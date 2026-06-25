import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on page refresh
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser  = localStorage.getItem('user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const loginUser = (data) => {
    setToken(data.token)
    setUser({ email: data.email, fullName: data.fullName, role: data.role })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    }))
  }

  const logoutUser = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isAdmin    = () => user?.role === 'ROLE_ADMIN'
  const isLoggedIn = () => !!token

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logoutUser, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
