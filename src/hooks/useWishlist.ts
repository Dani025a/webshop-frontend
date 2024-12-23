'use client'

import { useState, useEffect, useCallback } from 'react'
import { Product, Wishlist, WishlistProduct } from '@/types/types'

const LOCAL_STORAGE_KEY = 'localWishlist'

export function useWishlist() {
  const [wishlistProducts, setWishlistProducts] = useState<Wishlist | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('accessToken')
  }, [])

  const fetchWishlist = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (isAuthenticated()) {
      try {
        const response = await fetch('http://localhost:1007/api/wishlist', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch wishlist: ${response.status} ${response.statusText}`)
        }

        const data: Wishlist = await response.json()
        setWishlistProducts(data)
      } catch (err) {
        console.error('Error fetching wishlist:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setWishlistProducts(null)
      }
    } else {
      const localWishlist = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (localWishlist) {
        setWishlistProducts(JSON.parse(localWishlist))
      } else {
        setWishlistProducts({
          id: 'local',
          userId: 'local',
          products: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    }

    setLoading(false)
  }, [isAuthenticated])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const addToWishlist = useCallback(async (product: Product) => {
    if (!product || !product.id) {
      console.error('Invalid product or missing product ID');
      setError('Invalid product or missing product ID');
      return;
    }

    setLoading(true);
    setError(null);

    if (isAuthenticated()) {
      try {
        const response = await fetch('http://localhost:1007/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ product }),
        });

        if (!response.ok) {
          throw new Error(`Failed to add to wishlist: ${response.status} ${response.statusText}`);
        }

        const updatedWishlist: Wishlist = await response.json();
        setWishlistProducts(updatedWishlist);
      } catch (err) {
        console.error('Error adding to wishlist:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    } else {
      const localWishlist = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{"products":[]}') as Wishlist;
      const newWishlistProduct: WishlistProduct = { product };
      localWishlist.products.push(newWishlistProduct);
      localWishlist.updatedAt = new Date().toISOString();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localWishlist));
      setWishlistProducts(localWishlist);
    }

    setLoading(false);
  }, [isAuthenticated]);

  const removeFromWishlist = useCallback(async (productId: number | undefined) => {
    if (productId === undefined) {
      console.error('Invalid product ID');
      setError('Invalid product ID');
      return;
    }

    setLoading(true);
    setError(null);

    if (isAuthenticated()) {
      try {
        const response = await fetch(`http://localhost:1007/api/wishlist/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to remove from wishlist: ${response.status} ${response.statusText}`);
        }

        const updatedWishlist: Wishlist = await response.json();
        setWishlistProducts(updatedWishlist);
      } catch (err) {
        console.error('Error removing from wishlist:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    } else {
      const localWishlist = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{"products":[]}') as Wishlist;
      localWishlist.products = localWishlist.products.filter(item => item.product.id !== productId);
      localWishlist.updatedAt = new Date().toISOString();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localWishlist));
      setWishlistProducts(localWishlist);
    }

    setLoading(false);
  }, [isAuthenticated]);

  return { 
    wishlistProducts, 
    loading, 
    error, 
    fetchWishlist, 
    addToWishlist, 
    removeFromWishlist,
    isAuthenticated: isAuthenticated()
  }
}

