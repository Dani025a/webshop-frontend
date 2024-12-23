'use client'

import { ProtectedRoute } from '../../components/protectedRoutes'

function ProfilePage() {
  return (
    <div>
      <h1>Your Profile</h1>
    </div>
  )
}

export default ProtectedRoute(ProfilePage)

