'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/authContext'

export function ProtectedRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => {
    const { isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isAuthenticated()) {
        router.push('/login')
      }
    }, [isAuthenticated, router])

    if (!isAuthenticated()) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}

