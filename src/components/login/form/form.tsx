'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../contexts/authContext'
import { TextInput } from '../../ui/text-input'
import { PasswordInput } from '../../ui/password-input'
import './form.css'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  [key: string]: string
}

export function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    if (isSubmitted && value.trim() === '') {
      return 'This field is required'
    }

    switch (name) {
      case 'email':
        return value && !/\S+@\S+\.\S+/.test(value) ? 'Invalid email address' : undefined
      case 'password':
        return value && value.length < 8 ? 'Password must be at least 8 characters long' : undefined
      default:
        return undefined
    }
  }

  const handleBlur = (name: keyof FormData) => {
    const error = validateField(name, formData[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (isSubmitted) {
      const error = validateField(name as keyof FormData, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setIsLoading(true)
    const newErrors: FormErrors = {}

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key as keyof FormData, value)
      if (error) newErrors[key] = error
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      try {
        await login(formData.email, formData.password)
        router.push(redirect)
      } catch (error) {
        setErrors({ ...newErrors, general: 'Invalid email or password. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    const emailParam = formData.email ? `?email=${encodeURIComponent(formData.email)}` : ''
    router.push(`/forgot-password${emailParam}`)
  }

  return (
    <div className="container">
      <h1 className="title">LOGIN</h1>
      <p className="signin">
        DON'T HAVE AN ACCOUNT? <Link href="/signup">SIGN UP</Link>
      </p>

      <form onSubmit={handleSubmit} className="form">
        {errors.general && <div className="error general-error">{errors.general}</div>}
        
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={() => handleBlur('email')}
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          name="password"
          value={formData.password}
          onChange={(value) => {
            setFormData(prev => ({ ...prev, password: value }))
            if (isSubmitted) {
              const error = validateField('password', value)
              setErrors(prev => ({ ...prev, password: error }))
            }
          }}
          onBlur={() => handleBlur('password')}
          error={errors.password}
        />

        <button type="submit" className="submit" disabled={isLoading}>
          {isLoading ? 'LOGGING IN...' : 'LOGIN'}
        </button>

        <p className="forgot-password">
          <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
        </p>
      </form>
    </div>
  )
}

export default LoginForm

