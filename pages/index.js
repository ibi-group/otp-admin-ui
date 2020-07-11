import { useAuth } from 'use-auth0-hooks'

import AdminUserDashboard from '../components/AdminUserDashboard'
import ApiUserSetup from '../components/ApiUserSetup'
import { AUTH0_SCOPE } from '../util/constants'

export default function Index ({ adminUser, apiUser, isUserFetched }) {
  const { isAuthenticated, isLoading } = useAuth({
    audience: process.env.AUTH0_AUDIENCE,
    scope: AUTH0_SCOPE
  })
  if (!isLoading && !isAuthenticated) {
    return (
      <div>
        Please log in to view the Admin Dashboard.
      </div>
    )
  }

  if (!isUserFetched) {
    return <div>Loading...</div>
  }

  if (!adminUser && (!apiUser || !apiUser.hasConsentedToTerms)) {
    // New API user sign up will have both adminUser and apiUser to null,
    // or apiUser will have the terms not accepted.
    // For these users, display the API setup component.
    return <ApiUserSetup />
  }
  if (adminUser) return <AdminUserDashboard />
  return (
    <div>
      <h1>TODO: API User Dashboard</h1>
    </div>
  )
}
