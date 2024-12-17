import { useState, useEffect, useCallback, useRef } from 'react';
import { FilterOption } from '../types/types';

interface UseFiltersResult {
  filters: FilterOption[];
  loading: boolean;
  error: string | null;
  fetchFilters: (categoryId: number, level: 'main' | 'sub' | 'subsub') => Promise<void>;
}

const useFilters = (initialCategoryId: number, initialLevel: 'main' | 'sub' | 'subsub'): UseFiltersResult => {
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtersFetched, setFiltersFetched] = useState<boolean>(false);
  const prevParamsRef = useRef<{ categoryId: number; level: 'main' | 'sub' | 'subsub' }>({ categoryId: initialCategoryId, level: initialLevel });

  const fetchFilters = useCallback(async (categoryId: number, level: 'main' | 'sub' | 'subsub') => {
    const currentParams = { categoryId, level };
    const prevParams = prevParamsRef.current;

    if (filtersFetched && 
        currentParams.categoryId === prevParams.categoryId && 
        currentParams.level === prevParams.level) {
      console.log('Filters already fetched for this category and level, skipping fetch');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:1002/api/filters?categoryId=${categoryId}&level=${level}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch filters: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      const transformedFilters: FilterOption[] = data.map((item: any) => ({
        id: item.categoryFilterOption.filterOption.id,
        filterOptionId: item.categoryFilterOption.filterOption.id,
        name: item.categoryFilterOption.filterOption.name,
        type: item.categoryFilterOption.filterOption.type,
        filterValues: item.categoryFilterOption.filterOption.filterValues.map((value: any) => ({
          id: value.id,
          value: value.value
        }))
      }));

      setFilters(transformedFilters);
      setFiltersFetched(true);
      prevParamsRef.current = currentParams;
    } catch (err) {
      console.error('Error fetching filters:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilters(initialCategoryId, initialLevel);
  }, [fetchFilters, initialCategoryId, initialLevel]);

  return { filters, loading, error, fetchFilters };
};

export default useFilters;

