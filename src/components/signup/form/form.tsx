'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../contexts/authContext'
import { TextInput } from '../../ui/text-input'
import { PasswordInput } from '../../ui/password-input'
import { PhoneInput } from '../../ui/phone-input'
import './form.css'

interface FormData {
  username: string
  email: string
  zipcode: string
  city: string
  phone: string
  address: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  firstname: string
  lastname: string
}

interface FormErrors {
  [key: string]: string
}

export function SignUpForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    zipcode: '',
    city: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    firstname: '',
    lastname: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const validateField = (name: keyof FormData, value: string | boolean): string | undefined => {
    if (isSubmitted && typeof value === 'string' && value.trim() === '') {
      return 'This field is required'
    }

    switch (name) {
      case 'email':
        return value && !/\S+@\S+\.\S+/.test(value as string) ? 'Invalid email address' : undefined
      case 'phone':
        return value && (value as string).replace(/\D/g, '').length !== 8 ? 'Phone number must be 8 digits' : undefined
      case 'password':
        return value && !/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value as string)
          ? 'Password must contain at least 8 characters, one uppercase letter, and one number'
          : undefined
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match' : undefined
      default:
        return undefined
    }
  }

  const handleBlur = (name: keyof FormData) => {
    if (isSubmitted || name === 'email' || name === 'phone' || name === 'password' || name === 'confirmPassword') {
      const error = validateField(name, formData[name])
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setFormData(prev => ({ ...prev, [name]: newValue }))
    
    if (isSubmitted || name === 'email' || name === 'phone' || name === 'password' || name === 'confirmPassword') {
      const error = validateField(name as keyof FormData, newValue)
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

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the sales conditions'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      try {
        const { confirmPassword, acceptTerms, ...userData } = formData
        await register({
          ...userData,
          street: userData.address,
        })
        router.push(redirect)
      } catch (error) {
        if (error instanceof Error) {
          setErrors({ ...newErrors, general: error.message })
        } else {
          setErrors({ ...newErrors, general: 'An unexpected error occurred. Please try again.' })
        }
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <h1 className="title">SIGN UP</h1>
      <p className="signin">
        ALREADY HAVE AN ACCOUNT? <Link href="/login">SIGN IN</Link>
      </p>

      <form onSubmit={handleSubmit} className="form">
        {errors.general && <div className="error general-error">{errors.general}</div>}
        
        <TextInput
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          onBlur={() => handleBlur('username')}
          error={errors.username}
        />

        <TextInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={() => handleBlur('email')}
          error={errors.email}
        />

        <div className="row">
          <div className="input-container zipcode-container">
            <TextInput
              label="Zipcode"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleInputChange}
              onBlur={() => handleBlur('zipcode')}
              className="input zipcode"
              error={errors.zipcode}
            />
          </div>
          <div className="input-container">
            <TextInput
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              onBlur={() => handleBlur('city')}
              className="input"
              error={errors.city}
            />
          </div>
        </div>

        <PhoneInput
          value={formData.phone}
          onChange={(value) => {
            setFormData(prev => ({ ...prev, phone: value }))
            if (isSubmitted) {
              const error = validateField('phone', value)
              setErrors(prev => ({ ...prev, phone: error }))
            }
          }}
          onBlur={() => handleBlur('phone')}
          error={errors.phone}
        />

        <TextInput
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          onBlur={() => handleBlur('address')}
          error={errors.address}
        />

        <TextInput
          label="First Name"
          name="firstname"
          value={formData.firstname}
          onChange={handleInputChange}
          onBlur={() => handleBlur('firstname')}
          error={errors.firstname}
        />

        <TextInput
          label="Last Name"
          name="lastname"
          value={formData.lastname}
          onChange={handleInputChange}
          onBlur={() => handleBlur('lastname')}
          error={errors.lastname}
        />

        <PasswordInput
          label="Password (At least 8 characters, one uppercase, one number)"
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

        <PasswordInput
          label="Repeat Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(value) => {
            setFormData(prev => ({ ...prev, confirmPassword: value }))
            if (isSubmitted) {
              const error = validateField('confirmPassword', value)
              setErrors(prev => ({ ...prev, confirmPassword: error }))
            }
          }}
          onBlur={() => handleBlur('confirmPassword')}
          error={errors.confirmPassword}
        />

        <div className="checkbox-container">
          <div className="checkbox">
            <input
              type="checkbox"
              id="terms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
            />
            <label htmlFor="terms">
              I ACCEPT THE FOLLOWING <a href="/terms">SALES CONDITIONS</a>
            </label>
          </div>
          {errors.acceptTerms && <span className="error">{errors.acceptTerms}</span>}
        </div>

        <button type="submit" className="submit" disabled={isLoading}>
          {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
        </button>
      </form>
    </div>
  )
}

export default SignUpForm

