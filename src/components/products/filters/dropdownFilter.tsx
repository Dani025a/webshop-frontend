'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FilterOption } from "../../../types/types"

interface DropdownFilterProps {
  filter: FilterOption
  selectedValue: string
  onChange: (value: string) => void
}

export default function DropdownFilter({ filter, selectedValue, onChange }: DropdownFilterProps) {
  return (
    <div className="filter-group space-y-2">
      <h3 className="text-sm font-medium">{filter.name}</h3>
      <Select value={selectedValue} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${filter.name}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={`all_${filter.id}`}>All {filter.name}</SelectItem>
          {filter.filterValues.map((value) => (
            <SelectItem key={value.id} value={value.value || `value_${value.id}`}>
              {value.value || "Unnamed Option"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

