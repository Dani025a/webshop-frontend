'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/cartContext'
import { useAuth } from '@/contexts/authContext'
import { Check, Truck, Package } from 'lucide-react'

interface OrderDetails {
  id: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  estimatedDelivery: string;
}

export default function OrderConfirmationPage() {
  const { clearCart } = useCart()
  const { user } = useAuth()
  const [order, setOrder] = useState<OrderDetails | null>(null)

  useEffect(() => {
    clearCart()
    setOrder({
      id: 'ORD-' + Math.random().toString(36).substr(2, 9),
      total: 129.99,
      items: [
        { name: "Product 1", quantity: 2, price: 49.99 },
        { name: "Product 2", quantity: 1, price: 30.01 },
      ],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    })
  }, [clearCart])

  if (!order) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 mb-4">
          <Check className="w-6 h-6 text-green-500" />
          <h1 className="text-2xl font-bold text-green-600">Order Confirmed</h1>
        </div>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase, {user?.firstname || 'valued customer'}!
        </p>
        <div className="space-y-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Order Details</h2>
            <p>Order ID: {order.id}</p>
            <p>Total: ${order.total.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Items</h3>
            <ul className="list-disc list-inside">
              {order.items.map((item, index) => (
                <li key={index} className="mb-1">
                  {item.name} - Quantity: {item.quantity} - ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-blue-500" />
            <p>Estimated Delivery: {order.estimatedDelivery}</p>
          </div>
        </div>
        <div className="flex justify-between">
          <Link href="/">
            <button className="bg-white text-blue-500 border border-blue-500 px-4 py-2 rounded hover:bg-blue-100 transition duration-300">
              Continue Shopping
            </button>
          </Link>
          <Link href={`/order-tracking/${order.id}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Track Order
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

