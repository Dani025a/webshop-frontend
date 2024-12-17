import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import './button.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function Button({ 
  className, 
  variant = 'default', 
  size = 'default', 
  asChild = false, 
  ...props 
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={`button ${variant} ${size} ${className || ''}`}
      {...props}
    />
  )
}

Button.displayName = "Button"

