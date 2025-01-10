'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/cartContext'
import { useCreateOrder } from '@/hooks/useCreateOrder'
import { useStripePayment } from '@/hooks/usePayment'
import { useAuth } from '@/contexts/authContext'
import { useRouter } from 'next/navigation'
import { OrderProduct } from '@/types/types'
import './checkout.css'

export default function CheckoutPage() {
  const { cart, getCartTotal, getSumTotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { createOrder, order, loading: orderLoading, error: orderError } = useCreateOrder()
  const { createPaymentSession, loading: paymentLoading, error: paymentError } = useStripePayment()
  const [orderCreated, setOrderCreated] = useState(false)
  const [currentPage, setCurrentPage] = useState('summary')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login?redirect=/checkout')
    }
  }, [isAuthenticated, router])

  const handleCreateOrder = async () => {
    if (!user) return

    const orderProducts: OrderProduct[] = cart.map(item => ({
      product: {
        ...item,
        quantity: item.quantity
      }
    }))

    const totalItems = orderProducts.reduce((sum, p) => sum + p.product.quantity, 0);

    try {
      await createOrder({
        order: {
          totalPrice: getCartTotal(),
          totalDiscountedPrice: getSumTotal(),
          totalItems: totalItems,
          currency: 'USD',
          products: orderProducts
        }
      })

      setOrderCreated(true)
      setCurrentPage('payment')
    } catch (error) {
      console.error('Failed to create order:', error)
    }
  }

  const handlePayment = async () => {
    if (!order) return

    try {
      const result = await createPaymentSession({
        amount: Math.round(order.totalDiscountedPrice * 100),
        currency: order.currency,
        orderId: order.id,
        metadata: { }
      })
      
    
    } catch (error) {
      console.error('Failed to create payment session:', error)
    }
  }

  if (!user) return null
  if (orderLoading || paymentLoading) return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  )

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: currentPage === 'payment' ? '100%' : '50%' }}></div>
        </div>

        {currentPage === 'summary' && (
          <div className="checkout-content">
            <div className="order-summary">
              <div className="summary-header">
                <h2>Order Summary</h2>
                <p>Review your items</p>
              </div>
              <div className="summary-items">
                {cart.map(item => (
                  <div key={item.id} className="summary-item">
                    <span className="item-name">{item.name}</span>
                    <div className="item-details">
                      <span className="item-quantity">x{item.quantity}</span>
                      <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
                <div className="total">
                  <span>Total:</span>
                  <span>${getSumTotal().toFixed(2)}</span>
                </div>
                <div className="discounted-total">
                  <span>Discounted Total:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCreateOrder}
                disabled={cart.length === 0 || orderLoading}
                className="create-order-button"
              >
                {orderLoading ? 'Processing...' : 'Proceed to Payment'}
                <svg xmlns="http://www.w3.org/2000/svg" className="arrow-icon" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {currentPage === 'payment' && (
          <div className="checkout-content">
            <div className="payment-section">
              <div className="payment-header">
                <h2>Payment</h2>
                <p>Secure payment via Stripe</p>
              </div>
              <button
                onClick={handlePayment}
                disabled={!order || paymentLoading}
                className="pay-button"
              >
                {paymentLoading ? 'Processing...' : `Pay $${order?.totalDiscountedPrice.toFixed(2)}`}
              </button>
              {paymentError && <div className="error-message">{paymentError}</div>}
            </div>
          </div>
        )}

        {orderError && (
          <div className="order-error">
            {orderError}
          </div>
        )}
      </div>
    </div>
  )
}

