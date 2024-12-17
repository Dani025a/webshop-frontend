'use client'

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FilterOption } from "../../../types/types"

interface RadioFilterProps {
  filter: FilterOption
  selectedValue: string
  onChange: (value: string) => void
}

export default function RadioFilter({ filter, selectedValue, onChange }: RadioFilterProps) {
  return (
    <RadioGroup value={selectedValue} onValueChange={onChange}>
      {filter.filterValues.map((value) => (
        <div key={value.id} className="flex items-center space-x-2">
          <RadioGroupItem value={value.value} id={`${filter.id}-${value.id}`} />
          <Label htmlFor={`${filter.id}-${value.id}`}>{value.value}</Label>
        </div>
      ))}
    </RadioGroup>
  )
}

