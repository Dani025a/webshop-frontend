import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from 'lucide-react'
import './select.css'

export const Select = SelectPrimitive.Root

export const SelectGroup = SelectPrimitive.Group

export const SelectValue = SelectPrimitive.Value

export interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {}

export function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      className={`select-trigger ${className || ''}`}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="select-icon" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

export interface SelectContentProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  position?: "popper" | "item-aligned"
}

export function SelectContent({ className, children, position = "popper", ...props }: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={`select-content ${className || ''}`}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport className="select-viewport">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

SelectContent.displayName = SelectPrimitive.Content.displayName

export interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {}

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={`select-item ${className || ''}`}
      {...props}
    >
      <span className="select-item-indicator">
        <SelectPrimitive.ItemIndicator>
          <Check className="check-icon" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

SelectItem.displayName = SelectPrimitive.Item.displayName

