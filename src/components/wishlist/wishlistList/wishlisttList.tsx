'use client'

import { useWishlist } from '@/hooks/useWishlist'
import { WishlistCard } from '../wishlistCard/wishlistCard'
import './wishlistList.css'

export function WishlistList() {
  const { wishlistProducts, loading, error, removeFromWishlist } = useWishlist()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!wishlistProducts || wishlistProducts.products.length === 0) return <div>Your wishlist is empty.</div>

  return (
    <div className="wishlist-list">
      <div className="wishlist-list__header">
        <div className="wishlist-list__header-product">PRODUCT</div>
        <div className="wishlist-list__header-price">PRICE</div>
        <div className="wishlist-list__header-remove">REMOVE</div>
      </div>
      {wishlistProducts.products.map((item) => (
        <WishlistCard
          key={item.product.id}
          product={item.product}
          onRemove={() => removeFromWishlist(item.product.id)}
        />
      ))}
    </div>
  )
}

