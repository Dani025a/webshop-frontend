import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from 'lucide-react'
import './radio-group.css'

export interface RadioGroupProps extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>, 'onValueChange'> {
  onValueChange?: (value: string | undefined) => void;
}

export function RadioGroup({ className, onValueChange, ...props }: RadioGroupProps) {
  const handleValueChange = (value: string) => {
    if (value === props.value) {
      onValueChange?.(undefined);
    } else {
      onValueChange?.(value);
    }
  };

  return (
    <RadioGroupPrimitive.Root
      className={`radio-group ${className || ''}`}
      onValueChange={handleValueChange}
      {...props}
    />
  );
}

export interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {}

export function RadioGroupItem({ className, children, ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      className={`radio-group-item ${className || ''}`}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="radio-group-indicator">
        <Circle className="radio-group-icon" />
      </RadioGroupPrimitive.Indicator>
      {children}
    </RadioGroupPrimitive.Item>
  );
}

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

