import { FilterOption, FilterType } from '../../../types/types'

interface SpecificationsTableProps {
  filters?: FilterOption[]
}

export default function SpecificationsTable({ filters }: SpecificationsTableProps) {
  if (!filters || filters.length === 0) {
    return null; 
  }

  return (
    <div className="specifications-table">
      <h2 className="text-lg font-bold uppercase mb-4">GENERALLY</h2>
      <table className="w-full border-collapse">
        <tbody>
          {filters.map((filter) => (
            <tr key={filter.id}>
              <th className="py-3 pr-4 text-left font-medium text-gray-600 border-b border-gray-200 uppercase">
                {filter.name}
              </th>
              <td className="py-3 pl-4 text-left border-b border-gray-200">
                {filter.type === FilterType.slider ? (
                  `${filter.filterValues[0]?.value || ''} - ${filter.filterValues[1]?.value || ''}`
                ) : (
                  filter.filterValues?.map((value, index) => (
                    <span key={value.id}>
                      {value.value}
                      {index < filter.filterValues.length - 1 ? ', ' : ''}
                    </span>
                  )) || 'No values'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

