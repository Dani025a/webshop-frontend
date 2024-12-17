'use client'

import React, { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { FilterDefinition } from '../../../types/types'
import { TextInput } from '@/components/ui/text-input'

interface SliderFilterProps {
  filter: FilterDefinition
  onChange: (values: { min: number; max: number } | null) => void
  initialValues?: { min: number; max: number }
}

export default function SliderFilter({ filter, onChange, initialValues }: SliderFilterProps) {
  const minValue = Math.min(...filter.filterValues.map(fv => Number(fv.value)))
  const maxValue = Math.max(...filter.filterValues.map(fv => Number(fv.value)))

  const [range, setRange] = useState<[number, number]>([
    initialValues?.min ?? minValue,
    initialValues?.max ?? maxValue
  ])

  useEffect(() => {
    if (initialValues) {
      setRange([initialValues.min, initialValues.max])
    }
  }, [initialValues])

  const handleSliderChange = (newValues: number[]) => {
    setRange(newValues as [number, number])
    onChange({ min: newValues[0], max: newValues[1] })
  }

  const handleInputChange = (index: number, value: string) => {
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      const newRange: [number, number] = [...range]
      newRange[index] = numValue
      setRange(newRange)
      onChange({ min: newRange[0], max: newRange[1] })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between space-x-4">
        <TextInput
          type="number"
          value={range[0]}
          onChange={(e) => handleInputChange(0, e.target.value)}
          label=''
        />
        <TextInput
          type="number"
          value={range[1]}
          onChange={(e) => handleInputChange(1, e.target.value)}
          label=''
        />
      </div>      
      <Slider
        min={minValue}
        max={maxValue}
        step={1}
        value={range}
        onValueChange={handleSliderChange}
        className="w-full"
      />
    </div>
  )
}

