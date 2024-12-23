'use client'

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FilterOption } from "@/types/types"

interface RadioFilterProps {
  filter: FilterOption
  selectedValue: string
  onChange: (value: string) => void
}

export default function RadioFilter({ filter, selectedValue, onChange }: RadioFilterProps) {
  return (
    <RadioGroup value={selectedValue} onValueChange={onChange} className="space-y-2">
      {filter.filterValues.map((value) => (
        <div key={value.id} className="flex items-center space-x-3">
          <RadioGroupItem 
            value={value.value} 
            id={`${filter.id}-${value.id}`}
            className="w-6 h-6 flex-shrink-0"
          />
          <Label 
            htmlFor={`${filter.id}-${value.id}`}
            className="text-sm cursor-pointer flex-grow"
          >
            {value.value}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}

