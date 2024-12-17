'use client'

import Image from 'next/image'
import { X } from 'lucide-react'
import type { Product } from '@/types/types'
import './cartCard.css'

interface CartCardProps {
  product: Product & { quantity: number }
  quantity: number
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export function CartCard({ product, quantity, onQuantityChange, onRemove }: CartCardProps) {
  const hasDiscount = product.discount !== undefined
  const originalPrice = product.price
  const discountedPrice = hasDiscount 
    ? originalPrice * (1 - (product.discount?.percentage || 0) / 100) 
    : originalPrice
  const totalPrice = originalPrice * quantity
  const totalDiscountedPrice = discountedPrice * quantity

  return (
    <div className="cart-card">
      <div className="cart-card__product">
        <div className="cart-card__image">
          <Image
            src={product.images?.[0]?.url || '/placeholder.svg'}
            alt={product.name}
            fill
          />
        </div>
        <div className="cart-card__details">
          <h3 className="cart-card__name">{product.name}</h3>
          <p className="cart-card__description">{product.description}</p>
          <div className="cart-card__mobile-price">
            {hasDiscount ? (
              <span className="cart-card__total-discounted">${totalDiscountedPrice.toFixed(2)}</span>
            ) : (
              <span className="cart-card__total-original">${totalPrice.toFixed(2)}</span>
            )}
          </div>
          <button className="cart-card__remove cart-card__remove-mobile" onClick={onRemove}>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="cart-card__quantity">
        <button
          className="cart-card__quantity-button"
          onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
        >
          -
        </button>
        <span className="cart-card__quantity-value">{quantity}</span>
        <button
          className="cart-card__quantity-button"
          onClick={() => onQuantityChange(quantity < product.stock ? quantity + 1 : quantity)}
        >
          +
        </button>
      </div>

      <div className="cart-card__price">
        <span className="cart-card__price-normal">${originalPrice}</span>
      </div>

      <div className="cart-card__total">
        {hasDiscount ? (
          <>
            <span className="cart-card__total-discounted">${totalDiscountedPrice.toFixed(2)}</span>
            <div className="cart-card__discount">
              DISCOUNT - ${(totalPrice - totalDiscountedPrice).toFixed(2)}
            </div>
          </>
        ) : (
          <span className="cart-card__total-original">${totalPrice.toFixed(2)}</span>
        )}
      </div>

      <button className="cart-card__remove cart-card__remove-desktop" onClick={onRemove}>
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

