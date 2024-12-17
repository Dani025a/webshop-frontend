import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from 'lucide-react'
import './checkbox.css'

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {}

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={`checkbox ${className || ''}`}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="checkbox-indicator">
        <Check className="check-icon" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

Checkbox.displayName = "Checkbox"

