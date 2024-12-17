'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import './password-input.css'

interface PasswordInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  onBlur?: () => void
  name: string
}

export function PasswordInput({ label, value, onChange, error, onBlur, name }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="input-container">
      <label className="label">{label}</label>
      <div className="input-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="input"
          name={name}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="toggle-button"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <span className="error">{error}</span>}
    </div>
  )
}

