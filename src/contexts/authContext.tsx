'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UAParser } from 'ua-parser-js'

interface User {
  id: string
  username: string
  email: string
  firstname: string
  lastname: string
  phone: string
  street: string
  zipcode: string
  city: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function decodeToken(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

const getDeviceInfo = () => {
  const parser = new UAParser()
  const result = parser.getResult()
  return JSON.stringify({
    browser: `${result.browser.name} ${result.browser.version}`,
    os: `${result.os.name} ${result.os.version}`,
    device: result.device.type || 'desktop',
  })
}

const getIpAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error('Error fetching IP address:', error)
    return 'unknown'
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkAuth()
    }
  }, [])

  const checkAuth = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')

      if (!accessToken || !refreshToken) {
        setUser(null)
        return
      }

      const decodedAccessToken = decodeToken(accessToken)
      const decodedRefreshToken = decodeToken(refreshToken)

      if (!decodedAccessToken || !decodedRefreshToken) {
        logout()
        return
      }

      const currentTime = Date.now() / 1000

      if (decodedRefreshToken.exp < currentTime) {
        logout()
      } else if (decodedAccessToken.exp < currentTime) {
        try {
          await refreshAccessToken()
        } catch (error) {
          console.error('Error refreshing token:', error)
          logout()
        }
      } else {
        setUser({
          id: decodedAccessToken.userid,
          username: decodedAccessToken.username,
          email: decodedAccessToken.email,
          firstname: decodedAccessToken.firstname,
          lastname: decodedAccessToken.lastname,
          phone: decodedAccessToken.phone,
          street: decodedAccessToken.street,
          zipcode: decodedAccessToken.zipcode,
          city: decodedAccessToken.city,
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      logout()
    }
  }

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      const response = await fetch('http://localhost:1001/api/token/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('accessToken', data.accessToken)
        const decodedAccessToken = decodeToken(data.accessToken)
        setUser({
          id: decodedAccessToken.userid,
          username: decodedAccessToken.username,
          email: decodedAccessToken.email,
          firstname: decodedAccessToken.firstname,
          lastname: decodedAccessToken.lastname,
          phone: decodedAccessToken.phone,
          street: decodedAccessToken.street,
          zipcode: decodedAccessToken.zipcode,
          city: decodedAccessToken.city,
        })
      } else {
        throw new Error('Failed to refresh token')
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const deviceInfo = getDeviceInfo()
      const ipAddress = await getIpAddress()

      const response = await fetch('http://localhost:1001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-device-info': deviceInfo,
          'x-ip-address': ipAddress,
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        const decodedAccessToken = decodeToken(data.accessToken)
        setUser({
          id: decodedAccessToken.userid,
          username: decodedAccessToken.username,
          email: decodedAccessToken.email,
          firstname: decodedAccessToken.firstname,
          lastname: decodedAccessToken.lastname,
          phone: decodedAccessToken.phone,
          street: decodedAccessToken.street,
          zipcode: decodedAccessToken.zipcode,
          city: decodedAccessToken.city,
        })
        router.push('/')
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    try {
      console.log('Attempting to register user:', userData)
      const response = await fetch('http://localhost:1001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        if (response.status === 0) {
          console.error('Network error: Empty response from server')
          throw new Error('Unable to connect to the server. Please check your internet connection and try again.')
        }
        const errorData = await response.json()
        console.error('Server responded with an error:', errorData)
        throw new Error(errorData.message || 'Registration failed')
      }

      console.log('Registration successful')
      router.push('/login')
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
    setUser(null)
    router.push('/login')
  }

  const isAuthenticated = () => {
    return user !== null
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

