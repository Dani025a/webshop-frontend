import { CartCard } from '../cartCard/cartCard'
import type { Product } from '@/types/types'
import './cartList.css'

interface CartListProps {
  items: (Product & { quantity: number })[]
  onQuantityChange: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

export function CartList({ items, onQuantityChange, onRemove }: CartListProps) {
  return (
    <div className="cart-list">
      <div className="cart-list__header">
        <div className="cart-list__header-product">PRODUCT</div>
        <div className="cart-list__header-amount">AMOUNT</div>
        <div className="cart-list__header-price">PRICE</div>
        <div className="cart-list__header-total">TOTAL</div>
        <div className="cart-list__header-delete">DELETE</div>
      </div>
      {items.map((item) => (
        <CartCard
          key={item.id}
          product={item}
          quantity={item.quantity}
          onQuantityChange={(quantity) => onQuantityChange(item.id!, quantity)}
          onRemove={() => onRemove(item.id!)}
        />
      ))}
    </div>
  )
}

