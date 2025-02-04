'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FilterOption, FilterValue } from "@/types/types"

interface CheckboxFilterProps {
  filter: FilterOption
  selectedValues: string[]
  onChange: (values: string[]) => void
}

export default function CheckboxFilter({ filter, selectedValues, onChange }: CheckboxFilterProps) {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value])
    } else {
      onChange(selectedValues.filter(v => v !== value))
    }
  }

  return (
    <div className="filter-group space-y-2">
      <h3 className="filter-title text-sm font-medium">{filter.name}</h3>
      <div className="filter-options space-y-2">
        {filter.filterValues.map((value: FilterValue) => (
          <div key={value.id} className="filter-option">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={`${filter.id}-${value.id}`}
                checked={selectedValues.includes(value.value)}
                onCheckedChange={(checked) => handleCheckboxChange(value.value, checked as boolean)}
                className="w-6 h-6 flex-shrink-0"
              />
              <Label
                htmlFor={`${filter.id}-${value.id}`}
                className="text-sm font-normal cursor-pointer flex-grow"
              >
                {value.value}
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

