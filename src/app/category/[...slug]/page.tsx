'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ProductList from '@/components/products/productList/productList';
import ProductFilters from '@/components/products/filters/productFilter';
import { GetProductsOptions, Product, MainCategory, SubCategory, SubSubCategory } from '@/types/types';
import { useCategories } from '@/hooks/useCategories';
import useFilters from '@/hooks/useFilters';
import { useProducts } from '@/hooks/useProducts';
import { Button } from "@/components/ui/button"
import { Filter } from 'lucide-react';
import '../products.css';

export default function ProductsPage() {
  const [filterOptions, setFilterOptions] = useState<GetProductsOptions>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { allCategories, loading: categoriesLoading } = useCategories();
  const slugParams = useMemo(() => params.slug as string[], [params.slug]);
  const [mainCategorySlug, subCategorySlug, subSubCategorySlug] = slugParams;

  const categoryInfo = useMemo(() => {
    if (categoriesLoading || allCategories.length === 0) {
      return { mainCategory: undefined, subCategory: undefined, subSubCategory: undefined };
    }

    let mainCategory: MainCategory | undefined;
    let subCategory: SubCategory | undefined;
    let subSubCategory: SubSubCategory | undefined;

    if (mainCategorySlug) {
      mainCategory = allCategories.find(main => main.name.toLowerCase().replace(/\s+/g, '-') === mainCategorySlug);
      if (subCategorySlug && mainCategory) {
        subCategory = mainCategory.subCategories.find(sub => sub.name.toLowerCase().replace(/\s+/g, '-') === subCategorySlug);
        if (subSubCategorySlug && subCategory) {
          subSubCategory = subCategory.subSubCategories.find(subsub => subsub.name.toLowerCase().replace(/\s+/g, '-') === subSubCategorySlug);
        }
      }
    }

    if (!mainCategory && allCategories.length > 0) {
      mainCategory = allCategories[0];
    }

    return { mainCategory, subCategory, subSubCategory };
  }, [allCategories, mainCategorySlug, subCategorySlug, subSubCategorySlug, categoriesLoading]);

  const { filters, loading: filtersLoading, error: filtersError, fetchFilters } = useFilters(
    categoryInfo.subSubCategory?.id || categoryInfo.subCategory?.id || categoryInfo.mainCategory?.id || 0, 
    subSubCategorySlug ? 'subsub' : subCategorySlug ? 'sub' : 'main'
  );

  const updateProductsCallback = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
  }, []);

  const { loading: productsLoading, error: productsError, updateProducts } = useProducts(filterOptions, updateProductsCallback);

  useEffect(() => {
    if (categoriesLoading || !categoryInfo.mainCategory) {
      return;
    }

    const newFilterOptions = {
      categoryId: categoryInfo.mainCategory.id,
      subCategoryId: categoryInfo.subCategory?.id,
      subSubCategoryId: categoryInfo.subSubCategory?.id,
    };

    setFilterOptions(prevOptions => ({
      ...prevOptions,
      ...newFilterOptions,
    }));

    fetchFilters(
      categoryInfo.subSubCategory?.id || categoryInfo.subCategory?.id || categoryInfo.mainCategory.id,
      subSubCategorySlug ? 'subsub' : subCategorySlug ? 'sub' : 'main'
    );

    updateProducts(newFilterOptions);

  }, [categoryInfo, fetchFilters, subCategorySlug, subSubCategorySlug, updateProducts, categoriesLoading]);

  const handleFiltersChange = useCallback((newFilters: Partial<GetProductsOptions>) => {
    const updatedFilters: GetProductsOptions = {
      ...filterOptions,
      ...newFilters,
    };

    if (updatedFilters.filters) {
      updatedFilters.filters = updatedFilters.filters.filter(filter => filter.values !== null);
    }

    if (!updatedFilters.subSubCategoryId && !updatedFilters.subCategoryId && !updatedFilters.categoryId) {
      updatedFilters.categoryId = categoryInfo.mainCategory?.id;
    }

    setFilterOptions(updatedFilters);
    updateProducts(updatedFilters);
    
    const newSearchParams = new URLSearchParams(searchParams);
    if (updatedFilters.filters && updatedFilters.filters.length > 0) {
      newSearchParams.set('filters', JSON.stringify(updatedFilters.filters));
    } else {
      newSearchParams.delete('filters');
    }
    if (updatedFilters.sorting?.field) newSearchParams.set('sortBy', updatedFilters.sorting.field);
    if (updatedFilters.sorting?.order) newSearchParams.set('sortOrder', updatedFilters.sorting.order);
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`, { scroll: false });
  }, [filterOptions, updateProducts, searchParams, router, categoryInfo]);

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  return (
    <div className="products-page">
      <h1 className="products-title">Our Products</h1>
      <Button className="filter-menu-button" onClick={toggleFilterMenu}>
        <Filter size={16} />
        Filters
      </Button>
      <div className="products-content">
        <aside className={`product-filters-sidebar ${isFilterMenuOpen ? 'open full' : ''}`}>
          <ProductFilters 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            appliedFilters={filterOptions.filters || []}
            onClose={toggleFilterMenu}
          />
          <button className="show-results-button" onClick={toggleFilterMenu}>
            Show Results
          </button>
        </aside>
        <ProductList products={products} />
      </div>
    </div>
  );
}

