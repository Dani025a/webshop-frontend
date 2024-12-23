'use client'

import { useMemo } from 'react'
import ProductCard from '../productCard/productCard'
import { Product } from '@/types/types'
import './productList.css'

interface ProductListProps {
  products: Product[];
}


export default function ProductList({ products }: ProductListProps) {
  const memoizedProducts = useMemo(() => products, [products]);

  if (!memoizedProducts.length) {
    return (
      <div className="no-products-found">
        <p>No products found.</p>
      </div>
    );
  }


  return (
    <div className="product-grid">
      {memoizedProducts.map(product => (
        <ProductCard 
          key={product?.id ?? `product-${Math.random()}`} 
          product={product} 
        />
      ))}
    </div>
  );
}

