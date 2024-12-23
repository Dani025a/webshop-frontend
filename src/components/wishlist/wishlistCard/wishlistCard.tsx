'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import type { Product } from '@/types/types'
import './wishlistCard.css'

interface WishlistCardProps {
  product: Product
  onRemove: () => void
}

export function WishlistCard({ product, onRemove }: WishlistCardProps) {
  const hasDiscount = product.discount?.percentage && product.discount.percentage > 0
  const originalPrice = product.price
  const discountedPrice = hasDiscount 
    ? originalPrice * (1 - (product.discount?.percentage || 0) / 100) 
    : originalPrice

  const getProductLink = () => {
    const mainCategory = product.subSubCategory?.subCategory?.mainCategory?.name || 'uncategorized'
    const subCategory = product.subSubCategory?.subCategory?.name || 'uncategorized'
    const subSubCategory = product.subSubCategory?.name || 'uncategorized'
    return `/product/${product.id}/${mainCategory}/${subCategory}/${subSubCategory}`
  }

  return (
    <div className="wishlist-card">
      <Link href={getProductLink()} className="wishlist-card__product">
        <div className="wishlist-card__image">
          <Image
            src={product.images?.[0]?.url || '/placeholder.svg'}
            alt={product.name}
            width={80}
            height={80}
          />
        </div>
        <div className="wishlist-card__details">
          <h3 className="wishlist-card__name">{product.name}</h3>
          <p className="wishlist-card__description">{product.description}</p>
          <div className="wishlist-card__mobile-price">
            {hasDiscount ? (
              <>
                <span className="wishlist-card__price-discounted">${discountedPrice.toFixed(2)}</span>
                <span className="wishlist-card__price-original wishlist-card__price-strikethrough">${originalPrice}</span>
              </>
            ) : (
              <span className="wishlist-card__price-original">${originalPrice}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="wishlist-card__price">
        {hasDiscount ? (
          <>
            <span className="wishlist-card__price-discounted">${discountedPrice.toFixed(2)}</span>
            <span className="wishlist-card__price-original wishlist-card__price-strikethrough">${originalPrice}</span>
            <div className="wishlist-card__discount">
              {product.discount?.percentage}% OFF
            </div>
          </>
        ) : (
          <span className="wishlist-card__price-original">${originalPrice}</span>
        )}
      </div>

      <button className="wishlist-card__remove wishlist-card__remove-desktop" onClick={(e) => {
        e.preventDefault();
        onRemove();
      }}>
        <X className="h-5 w-5" />
      </button>

      <button className="wishlist-card__remove wishlist-card__remove-mobile" onClick={(e) => {
        e.preventDefault();
        onRemove();
      }}>
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

