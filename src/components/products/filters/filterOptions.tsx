import React from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FilterDefinition, FilterType } from '../../../types/types'

interface FilterOptionsProps {
  filter: FilterDefinition;
  selectedValues: number[];
  onChange: (values: number[] | null) => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ filter, selectedValues, onChange }) => {
  const handleChange = (value: number, checked: boolean) => {
    let newValues: number[];
    if (filter.type === FilterType.checkbox) {
      if (checked) {
        newValues = [...selectedValues, value];
      } else {
        newValues = selectedValues.filter(v => v !== value);
      }
    } else {
      newValues = checked ? [value] : [];
    }
    onChange(newValues.length > 0 ? newValues : null);
  };

  if (filter.type === FilterType.checkbox) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">{filter.name}</h3>
        {filter.filterValues.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={`${filter.name}-${option.id}`}
              checked={selectedValues.includes(option.id)}
              onCheckedChange={(checked) => handleChange(option.id, checked as boolean)}
            />
            <Label htmlFor={`${filter.name}-${option.id}`}>{option.value}</Label>
          </div>
        ))}
      </div>
    );
  } else if (filter.type === FilterType.dropdown) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">{filter.name}</h3>
        <RadioGroup
          value={selectedValues[0]?.toString() || ''}
          onValueChange={(value) => onChange(value ? [parseInt(value, 10)] : null)}
        >
          {filter.filterValues.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id.toString()} id={`${filter.name}-${option.id}`} />
              <Label htmlFor={`${filter.name}-${option.id}`}>{option.value}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  return null;
};

export default FilterOptions;

