'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ProductList from '@/components/products/productList/productList';
import ProductFilters from '@/components/products/filters/productFilter';
import { GetProductsOptions, Product, MainCategory, SubCategory, SubSubCategory } from '@/types/types';
import { useCategories } from '@/hooks/useCategories';
import useFilters from '@/hooks/useFilters';
import { useProducts } from '@/hooks/useProducts';
import '../products.css';

export default function ProductsPage() {
  const [filterOptions, setFilterOptions] = useState<GetProductsOptions>({});
  const [products, setProducts] = useState<Product[]>([]);
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

    if (subSubCategorySlug) {
      mainCategory = allCategories.find(main => main.name.toLowerCase() === mainCategorySlug?.toLowerCase());
      subCategory = mainCategory?.subCategories?.find(sub => sub.name.toLowerCase() === subCategorySlug?.toLowerCase());
      subSubCategory = subCategory?.subSubCategories?.find(subsub => subsub.name.toLowerCase() === subSubCategorySlug?.toLowerCase());
    } else if (subCategorySlug) {
      mainCategory = allCategories.find(main => main.name.toLowerCase() === mainCategorySlug?.toLowerCase());
      subCategory = mainCategory?.subCategories?.find(sub => sub.name.toLowerCase() === subCategorySlug?.toLowerCase());
    } else if (mainCategorySlug) {
      mainCategory = allCategories.find(main => main.name.toLowerCase() === mainCategorySlug?.toLowerCase());
    }

    if (!mainCategory) {
      mainCategory = allCategories[0];
    }

    console.log('Category info:', { mainCategory, subCategory, subSubCategory });
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

    console.log('Updating filter options:', {
      categoryId: categoryInfo.mainCategory.id,
      subCategoryId: categoryInfo.subCategory?.id,
      subSubCategoryId: categoryInfo.subSubCategory?.id,
    });

    setFilterOptions(prevOptions => ({
      ...prevOptions,
      categoryId: categoryInfo.mainCategory?.id,
      subCategoryId: categoryInfo.subCategory?.id,
      subSubCategoryId: categoryInfo.subSubCategory?.id,
    }));

    fetchFilters(
      categoryInfo.subSubCategory?.id || categoryInfo.subCategory?.id || categoryInfo.mainCategory.id,
      subSubCategorySlug ? 'subsub' : subCategorySlug ? 'sub' : 'main'
    );

    updateProducts({
      categoryId: categoryInfo.mainCategory.id,
      subCategoryId: categoryInfo.subCategory?.id,
      subSubCategoryId: categoryInfo.subSubCategory?.id,
    });
  }, [categoryInfo, fetchFilters, subCategorySlug, subSubCategorySlug, updateProducts, categoriesLoading]);

  const handleFiltersChange = useCallback((newFilters: Partial<GetProductsOptions>) => {
    const updatedFilters: GetProductsOptions = {
      ...filterOptions,
      ...newFilters,
    };

    // Remove filters with null values
    if (updatedFilters.filters) {
      updatedFilters.filters = updatedFilters.filters.filter(filter => filter.values !== null);
    }

    // Ensure at least one category ID is maintained
    if (!updatedFilters.subSubCategoryId && !updatedFilters.subCategoryId && !updatedFilters.categoryId) {
      updatedFilters.categoryId = categoryInfo.mainCategory?.id;
    }

    console.log('Handling filter change:', updatedFilters);
    setFilterOptions(updatedFilters);
    updateProducts(updatedFilters);
    
    // Update URL with new filters
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


  return (
    <div className="products-page">
      <h1 className="products-title">Our Products</h1>
      <div className="products-content">
        <aside className="product-filters-sidebar">
          <ProductFilters 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            appliedFilters={filterOptions.filters || []}
          />
        </aside>

          <ProductList products={products} />
      </div>
    </div>
  );
}

