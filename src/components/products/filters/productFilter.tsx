'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'
import { FilterDefinition, FilterType, GetProductsOptions, FilterOption } from '../../../types/types'
import FilterOptions from './filterOptions'
import SliderFilter from './sliderFilter'
import './productFilters.css'

interface ProductFiltersProps {
    filters: FilterDefinition[]
    onFiltersChange: (filters: Partial<GetProductsOptions>) => void
    appliedFilters: FilterOption[]
  }
  
  export default function ProductFilters({ filters, onFiltersChange, appliedFilters }: ProductFiltersProps) {
    const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>(appliedFilters || [])
    const [openFilters, setOpenFilters] = useState<Record<number, boolean>>(
      filters.reduce((acc, filter) => ({ ...acc, [filter.id]: true }), {})
    )
  
    useEffect(() => {
      setSelectedFilters(appliedFilters || [])
    }, [appliedFilters])
  
    const handleFilterChange = (filter: FilterDefinition, values: number[] | { min: number; max: number } | null) => {
      let newFilters = selectedFilters.filter(f => f.filterOptionId !== filter.id)
      
      if (values !== null) {
        if (filter.type === FilterType.slider) {
          newFilters.push({
            filterOptionId: filter.id,
            type: filter.type,
            values: values as { min: number; max: number }
          })
        } else if (Array.isArray(values) && values.length > 0) {
          newFilters.push({
            filterOptionId: filter.id,
            type: filter.type,
            values: values
          })
        }
      }
  
      setSelectedFilters(newFilters)
      onFiltersChange({ filters: newFilters })
    }
  
    const handleReset = () => {
      setSelectedFilters([])
      onFiltersChange({ filters: [] })
    }
  
    const toggleFilter = (filterId: number) => {
      setOpenFilters(prev => ({ ...prev, [filterId]: !prev[filterId] }))
    }
  
    const renderFilter = (filter: FilterDefinition) => {
      const isOpen = openFilters[filter.id]
      const currentFilter = selectedFilters.find(f => f.filterOptionId === filter.id)
  
      return (
        <div key={filter.id} className="filter-group">
          <div 
            className="filter-header" 
            onClick={() => toggleFilter(filter.id)}
          >
            <h3 className="filter-title">{filter.name}</h3>
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
          {isOpen && (
            <div className="filter-content">
              {filter.type === FilterType.slider ? (
                <SliderFilter
                  filter={filter}
                  onChange={(values) => handleFilterChange(filter, values)}
                  initialValues={currentFilter?.values as { min: number; max: number } | undefined}
                />
              ) : (
                <FilterOptions
                  filter={filter}
                  selectedValues={currentFilter?.values as number[] || []}
                  onChange={(values) => handleFilterChange(filter, values)}
                />
              )}
            </div>
          )}
        </div>
      )
    }
  
    return (
      <div className="product-filters">
        <div className="filters-header">
          <h2 className="filters-title">Filters</h2>
          <Button
            variant="link"
            onClick={handleReset}
            className="reset-button"
          >
            RESET
          </Button>
        </div>
        <div className="filters-content">
          {filters.map(renderFilter)}
        </div>
      </div>
    )
  }
  