'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TextInput } from '../../ui/text-input'
import '../../login/form/form.css'
import { Popup } from '@/components/ui/popup'
import { Button } from '@/components/ui/button'
import { useRequestPasswordReset } from '../../../hooks/useRequestPasswordReset'

interface FormErrors {
  [key: string]: string
}

export function ForgotPasswordForm() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    email,
    setEmail,
    requestPasswordReset,
    isLoading,
    error: requestError
  } = useRequestPasswordReset({
    onSuccess: () => {
      setPopupMessage('Password reset email sent. Please check your inbox.')
      setIsPopupOpen(true)
    },
    onError: (error) => {
      setPopupMessage(`Failed to send password reset email: ${error}`)
      setIsPopupOpen(true)
    }
  })

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams, setEmail])

  const validateEmail = (value: string): string | undefined => {
    if (isSubmitted && value.trim() === '') {
      return 'This field is required'
    }
    return value && !/\S+@\S+\.\S+/.test(value) ? 'Invalid email address' : undefined
  }

  const handleBlur = () => {
    const error = validateEmail(email)
    setErrors(prev => ({ ...prev, email: error }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    
    if (isSubmitted) {
      const error = validateEmail(e.target.value)
      setErrors(prev => ({ ...prev, email: error }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    const error = validateEmail(email)
    setErrors({ email: error })

    if (!error) {
      await requestPasswordReset()
    }
  }

  const closePopup = () => {
    setIsPopupOpen(false)
    if (popupMessage.includes('sent')) {
      router.push('/login')
    }
  }

  return (
    <div className="container">
      <h1 className="title">FORGOT PASSWORD</h1>
      <p className="signin">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="form">
        {requestError && <div className="error general-error">{requestError}</div>}
        
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={errors.email}
        />

        <Button type="submit" className="submit" disabled={isLoading}>
          {isLoading ? 'SENDING...' : 'SEND RESET LINK'}
        </Button>
      </form>

      <Popup
        isOpen={isPopupOpen}
        onClose={closePopup}
        title="Password Reset"
        footer={
          <button
            onClick={closePopup}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Close
          </button>
        }
      >
        <p>{popupMessage}</p>
      </Popup>
    </div>
  )
}

