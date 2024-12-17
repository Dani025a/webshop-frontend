import React from 'react'
import './text-input.css'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  onBlur?: () => void
}

export function TextInput({ label, error, onBlur, ...props }: TextInputProps) {
  return (
    <div className="input-container">
      <label className="label">{label}</label>
      <input className="input" onBlur={onBlur} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  )
}

