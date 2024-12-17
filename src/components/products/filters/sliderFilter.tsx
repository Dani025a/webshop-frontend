'use client'

import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { FilterOption } from "../../../types/types"

interface SliderFilterProps {
  filter: FilterOption
  value: { min: number; max: number }
  onChange: (value: { min: number; max: number }) => void
  min?: number
  max?: number
}

export default function SliderFilter({ filter, value, onChange, min = 0, max = 1000 }: SliderFilterProps) {
  const handleSliderChange = React.useCallback((newValue: number[]) => {
    onChange({ min: newValue[0], max: newValue[1] })
  }, [onChange])

  return (
    <div className="filter-slider">
      <h3 className="text-sm font-medium mb-2">{filter.name}</h3>
      <Slider
        min={min}
        max={max}
        step={1}
        value={[value.min, value.max]}
        onValueChange={handleSliderChange}
        className="my-4"
      />
      <div className="flex justify-between text-sm">
        <span>{value.min}</span>
        <span>{value.max}</span>
      </div>
    </div>
  )
}

