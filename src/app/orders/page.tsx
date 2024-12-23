'use client'

import { ProtectedRoute } from '../../components/protectedRoutes'

function OrdersPage() {
  return (
    <div>
      <h1>Your Orders</h1>
    </div>
  )
}

export default ProtectedRoute(OrdersPage)

