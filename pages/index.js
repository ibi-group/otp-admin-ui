import { useRouter } from 'next/router'
import { useAuth } from 'use-auth0-hooks'

import AdminUserDashboard from '../components/AdminUserDashboard'
import ApiUserForm from '../components/ApiUserForm'
import ApiUserDashboard from '../components/ApiUserDashboard'
import { AUTH0_SCOPE } from '../util/constants'

export default function Index (props) {
  const {
    adminUser,
    apiUser,
    createUser,
    isUserFetched
  } = props
  const { push, query } = useRouter()
  const { isAuthenticated } = useAuth({
    audience: process.env.AUTH0_AUDIENCE,
    scope: AUTH0_SCOPE
  })

  if (!isAuthenticated) {
    return (
      <div>
        Please log in to view the Admin Dashboard.
      </div>
    )
  }

  // FIXME: isLoading appears to be broken in useAuth.
  if (!isUserFetched) {
    return <div>Loading...</div>
  }

  if (!adminUser && (!apiUser || !apiUser.hasConsentedToTerms)) {
    // New API user sign up will have both adminUser and apiUser to null,
    // or apiUser will have the terms not accepted.
    // For these users, display the API setup component.
    return <ApiUserForm createUser={createUser} />
  }
  if (adminUser) return <AdminUserDashboard />
  // If an API user has just been created, show welcome message.
  return (
    <ApiUserDashboard
      apiUser={apiUser}
      clearWelcome={() => push('/')}
      showWelcome={query && query.newApiAccount} />
  )
}
