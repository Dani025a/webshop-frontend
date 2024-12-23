import { FilterOption } from '@/types/types'
import './specificationsTable.css'

interface SpecificationsTableProps {
  filters?: FilterOption[]
}

export default function SpecificationsTable({ filters }: SpecificationsTableProps) {
  if (!filters || filters.length === 0) {
    return null
  }

  return (
    <div className="specifications-table">
      <h2 className="specifications-title">GENERALLY</h2>
      <div className="specifications-content">
        {filters.map((filter) => (
          <div key={filter.id} className="specification-item">
            <div className="specification-name">{filter.name}</div>
            <div className="specification-value">
              {filter.filterValues?.map((value, index) => (
                <span key={value.id}>
                  {value.value}
                  {index < filter.filterValues.length - 1 ? ', ' : ''}
                </span>
              )) || 'No values'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

