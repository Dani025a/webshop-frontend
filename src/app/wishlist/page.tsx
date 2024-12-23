'use client'

import { WishlistList } from '@/components/wishlist/wishlistList/wishlisttList'
import './wishlist.css'

export default function WishlistPage() {
  return (
    <div className="wishlist-page">
      <h1 className="wishlist-page__title">My Wishlist</h1>
      <WishlistList />
    </div>
  )
}

