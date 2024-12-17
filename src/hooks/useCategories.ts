import { useState, useEffect, useCallback, useRef } from 'react';
import { MainCategory, SubCategory, SubSubCategory, ApiError } from '../types/types';

interface UseCategoriesResult {
  allCategories: MainCategory[];
  mainCategory: MainCategory | null;
  subCategories: SubCategory[];
  subSubCategories: SubSubCategory[];
  loading: boolean;
  error: string | null;
  fetchMainCategory: (id: number) => Promise<void>;
  fetchSubCategories: (mainCategoryId?: number) => Promise<void>;
  fetchSubSubCategories: (subCategoryId?: number) => Promise<void>;
}

interface FetchStatus {
  allCategoriesFetched: boolean;
  mainCategoryFetched: boolean;
  subCategoriesFetched: boolean;
  subSubCategoriesFetched: boolean;
}

export function useCategories(): UseCategoriesResult {
  const [allCategories, setAllCategories] = useState<MainCategory[]>([]);
  const [mainCategory, setMainCategory] = useState<MainCategory | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Update: Set initial loading state to true
  const [error, setError] = useState<string | null>(null);
  const fetchStatusRef = useRef<FetchStatus>({
    allCategoriesFetched: false,
    mainCategoryFetched: false,
    subCategoriesFetched: false,
    subSubCategoriesFetched: false,
  });

  const fetchAllCategories = useCallback(async () => {
    if (fetchStatusRef.current.allCategoriesFetched) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:1002/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data: MainCategory[] = await response.json();
      console.log('Fetched all categories:', data);
      setAllCategories(data);
      fetchStatusRef.current.allCategoriesFetched = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMainCategory = useCallback(async (id: number) => {
    if (fetchStatusRef.current.mainCategoryFetched) return;
    setLoading(false);
    setError(null);
    try {
      console.log('Fetching main category:', id);
      const response = await fetch(`http://localhost:1002/api/categories/main/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch main category');
      }
      const data: MainCategory = await response.json();
      setMainCategory(data);
      fetchStatusRef.current.mainCategoryFetched = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching main category');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubCategories = useCallback(async (mainCategoryId?: number) => {
    if (fetchStatusRef.current.subCategoriesFetched) return;
    setLoading(true);
    setError(null);
    try {
      const url = mainCategoryId
        ? `http://localhost:1002/api/categories/sub?mainCategoryId=${mainCategoryId}`
        : 'http://localhost:1002/api/categories/sub';
      console.log('Fetching sub categories:', { mainCategoryId });
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch sub categories');
      }
      const data: SubCategory[] = await response.json();
      setSubCategories(data);
      fetchStatusRef.current.subCategoriesFetched = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching sub categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubSubCategories = useCallback(async (subCategoryId?: number) => {
    if (fetchStatusRef.current.subSubCategoriesFetched) return;
    setLoading(true);
    setError(null);
    try {
      const url = subCategoryId
        ? `http://localhost:1002/api/categories/subsub?subCategoryId=${subCategoryId}`
        : 'http://localhost:1002/api/categories/subsub';
      console.log('Fetching sub-sub categories:', { subCategoryId });
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch sub-sub categories');
      }
      const data: SubSubCategory[] = await response.json();
      setSubSubCategories(data);
      fetchStatusRef.current.subSubCategoriesFetched = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching sub-sub categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  return {
    allCategories,
    mainCategory,
    subCategories,
    subSubCategories,
    loading,
    error,
    fetchMainCategory,
    fetchSubCategories,
    fetchSubSubCategories,
  };
}

