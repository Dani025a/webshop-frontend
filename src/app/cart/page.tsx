'use client'

import { useCart } from '@/contexts/cartContext'
import { CartList } from '@/components/cart/cartList/cartList'
import './cart.css'

export default function CartPage() {
    const { cart, removeFromCart, addToCart, getCartTotal } = useCart()
  
    const handleQuantityChange = (productId: number, newQuantity: number) => {
      const item = cart.find(item => item.id === productId)
      if (item) {
        const difference = newQuantity - item.quantity
        if (difference > 0) {
          for (let i = 0; i < difference; i++) {
            addToCart(item)
          }
        } else {
          for (let i = 0; i < Math.abs(difference); i++) {
            removeFromCart(productId)
          }
        }
      }
    }
  
    const handleRemove = (productId: number) => {
      const item = cart.find(item => item.id === productId)
      if (item) {
        for (let i = 0; i < item.quantity; i++) {
          removeFromCart(productId)
        }
      }
    }
  
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalDiscount = cart.reduce((sum, item) => {
      if (item.discount) {
        const discountedPrice = item.price * (1 - (item.discount.percentage / 100))
        return sum + (item.price - discountedPrice) * item.quantity
      }
      return sum
    }, 0)
    const total = subtotal - totalDiscount
  
    return (
      <div className="cart">
        <h1 className="cart__title">ITEMS IN THE CART</h1>
        
        <CartList 
          items={cart}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemove}
        />
  
        <div className="cart__summary">
          <div className="cart__summary-row">
            <span className="cart__summary-label">SUM:</span>
            <span className="cart__summary-value">${subtotal.toFixed(2)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="cart__summary-row">
              <span className="cart__summary-label">TOTAL DISCOUNT:</span>
              <span className="cart__summary-discount">-${totalDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="cart__summary-row">
            <span className="cart__summary-label">TOTAL:</span>
            <span className="cart__summary-value">${total.toFixed(2)}</span>
          </div>
          
          <button className="cart__checkout">
            GO TO CHECKOUT
          </button>
        </div>
      </div>
    )
  }
  