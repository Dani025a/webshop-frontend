import * as React from "react"
import './text-input.css'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  return <input className="text-input" {...props} />
}

Input.displayName = "TextInput"

