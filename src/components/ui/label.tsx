import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import './label.css'

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

export function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={`label ${className || ''}`}
      {...props}
    />
  )
}

Label.displayName = "Label"

