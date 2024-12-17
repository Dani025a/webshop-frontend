'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Product, GetProductsOptions } from '../types/types'

export function useProducts(initialOptions: GetProductsOptions = {}, onProductsUpdate?: (products: Product[]) => void) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const prevOptionsRef = useRef<GetProductsOptions>(initialOptions)

  const fetchProducts = useCallback(async (options: GetProductsOptions) => {
    const stringifiedOptions = JSON.stringify(options)
    const stringifiedPrevOptions = JSON.stringify(prevOptionsRef.current)

    console.log('fetchProducts called with options:', options);
    console.log('Previous options:', prevOptionsRef.current);
    console.log('Initial options:', initialOptions);

    if (stringifiedOptions === stringifiedPrevOptions) {
      console.log('Options unchanged, skipping fetch')
      return
    }

    setLoading(true)
    setError(null)

    console.log('Fetching products with options:', options)

    try {
      const url = 'http://localhost:1002/api/products'
      console.log('Fetching products from:', url)
      console.log('Request body:', JSON.stringify(options))

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
      }

      const data: Product[] = await response.json()
      console.log('Fetched products:', data)

      setProducts(data)
      if (onProductsUpdate) {
        onProductsUpdate(data)
      }
      prevOptionsRef.current = options
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [onProductsUpdate])

  useEffect(() => {
    fetchProducts(initialOptions)
  }, [fetchProducts, initialOptions])

  const updateProducts = useCallback((newOptions: Partial<GetProductsOptions>) => {
    const updatedOptions = { ...prevOptionsRef.current, ...newOptions }
    console.log('Updating products with options:', updatedOptions)
    fetchProducts(updatedOptions)
  }, [fetchProducts])

  const fetchSingleProduct = useCallback(async (productId: number) => {
    setLoading(true)
    setError(null)

    try {
      const url = `http://localhost:1002/api/product/${productId}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`)
      }

      const data: Product = await response.json()
      console.log('Fetched product:', data)

      setProducts([data])
      if (onProductsUpdate) {
        onProductsUpdate([data])
      }
    } catch (err) {
      console.error('Error fetching product:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [onProductsUpdate])

  const getAllProducts = useCallback(async (): Promise<Product[]> => {
    setLoading(true)
    setError(null)

    try {
      const url = 'http://localhost:1002/api/products'
      console.log('Fetching all products from:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch all products: ${response.status} ${response.statusText}`)
      }

      const data: Product[] = await response.json()
      console.log('Fetched all products:', data)

      setProducts(data)
      if (onProductsUpdate) {
        onProductsUpdate(data)
      }
      return data
    } catch (err) {
      console.error('Error fetching all products:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setProducts([])
      throw err
    } finally {
      setLoading(false)
    }
  }, [onProductsUpdate])

  const searchProducts = useCallback(async (query: string): Promise<Product[]> => {
    setLoading(true)
    setError(null)

    try {
      const url = `http://localhost:1002/api/products/search?q=${encodeURIComponent(query)}`
      console.log('Searching products from:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to search products: ${response.status} ${response.statusText}`)
      }

      const data: Product[] = await response.json()
      console.log('Search results:', data)

      setProducts(data)
      if (onProductsUpdate) {
        onProductsUpdate(data)
      }
      return data
    } catch (err) {
      console.error('Error searching products:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setProducts([])
      throw err
    } finally {
      setLoading(false)
    }
  }, [onProductsUpdate])

  return { products, loading, error, updateProducts, fetchSingleProduct, getAllProducts, searchProducts }
}

