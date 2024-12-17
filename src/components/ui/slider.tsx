import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { TextInput } from "./text-input"
import './slider.css'

export interface SliderProps extends Omit<SliderPrimitive.SliderProps, 'value' | 'defaultValue' | 'onValueChange'> {
  className?: string;
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
}

export function Slider({ 
  className, 
  min = 0, 
  max = 100000,
  value,
  defaultValue = [min, max],
  onValueChange,
  ...props 
}: SliderProps) {
  const [localValue, setLocalValue] = React.useState<[number, number]>(value || defaultValue)

  const handleSliderChange = React.useCallback((newValue: number[]) => {
    const updatedValue: [number, number] = [newValue[0], newValue[1]]
    setLocalValue(updatedValue)
    onValueChange?.(updatedValue)
  }, [onValueChange])

  const handleInputChange = React.useCallback((index: 0 | 1, inputValue: string) => {
    const numValue = parseInt(inputValue, 10)
    if (isNaN(numValue)) return

    const newValue: [number, number] = [...localValue] as [number, number]
    newValue[index] = Math.max(min, Math.min(max, numValue))

    // Ensure min value doesn't exceed max value and vice versa
    if (index === 0 && newValue[0] > newValue[1]) {
      newValue[0] = newValue[1]
    } else if (index === 1 && newValue[1] < newValue[0]) {
      newValue[1] = newValue[0]
    }

    setLocalValue(newValue)
    onValueChange?.(newValue)
  }, [localValue, min, max, onValueChange])

  React.useEffect(() => {
    if (value) {
      setLocalValue(value)
    }
  }, [value])

  return (
    <div className={`slider-container ${className || ''}`}>
      <div className="slider-inputs">
        <TextInput
          type="number"
          value={localValue[0]}
          onChange={(e) => handleInputChange(0, e.target.value)}
          min={min}
          max={max}
          label=""
        />
        <span className="slider-separator">-</span>
        <TextInput
          type="number"
          value={localValue[1]}
          onChange={(e) => handleInputChange(1, e.target.value)}
          min={min}
          max={max}
          label=""
        />
      </div>
      <SliderPrimitive.Root
        className="slider"
        min={min}
        max={max}
        value={localValue}
        onValueChange={handleSliderChange}
        {...props}
      >
        <SliderPrimitive.Track className="slider-track">
          <SliderPrimitive.Range className="slider-range" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="slider-thumb" />
        <SliderPrimitive.Thumb className="slider-thumb" />
      </SliderPrimitive.Root>
    </div>
  )
}

Slider.displayName = "Slider"

