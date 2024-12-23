'use client'

import { useCart } from '@/contexts/cartContext'
import { CartList } from '@/components/cart/cartList/cartList'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import './cart.css'

export default function CartPage() {
    const { cart, removeFromCart, addToCart, getCartTotal, getSumTotal } = useCart()
    const { user } = useAuth()
    const router = useRouter()
  
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
  
    const totalDiscount = getSumTotal() - getCartTotal()
  
    const handleCheckout = () => {
      if (cart.length === 0) {
        alert('Your cart is empty. Add items before proceeding to checkout.')
        return
      }
      
      if (!user) {
        router.push('/login?redirect=/checkout')
        return
      }
      
      router.push('/checkout')
    }

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
            <span className="cart__summary-value">${getSumTotal().toFixed(2)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="cart__summary-row">
              <span className="cart__summary-label">TOTAL DISCOUNT:</span>
              <span className="cart__summary-discount">-${totalDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="cart__summary-row">
            <span className="cart__summary-label">TOTAL:</span>
            <span className="cart__summary-value">${getCartTotal().toFixed(2)}</span>
          </div>
          
          <button className="cart__checkout" onClick={handleCheckout}>
            GO TO CHECKOUT
          </button>
        </div>
      </div>
    )
  }

