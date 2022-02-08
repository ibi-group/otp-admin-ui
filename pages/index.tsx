import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'

import AdminUserDashboard from '../components/AdminUserDashboard'
import ApiUserDashboard from '../components/ApiUserDashboard'
import ApiUserForm from '../components/ApiUserForm'
import WelcomeScreen from '../components/WelcomeScreen'

export default function Index(props: {
  adminUser: any
  apiUser: any
  createApiUser: () => void
  handleSignup: any
}): JSX.Element {
  const { adminUser, apiUser, createApiUser, handleSignup } = props

  const { push, query } = useRouter()
  const { isAuthenticated } = useAuth0()

  if (!isAuthenticated) {
    return <WelcomeScreen handleSignup={handleSignup} />
  }

  if (!adminUser && (!apiUser || !apiUser.hasConsentedToTerms)) {
    // New API user sign up will have both adminUser and apiUser to null,
    // or apiUser will have the terms not accepted.
    // For these users, display the API setup component.
    return <ApiUserForm createApiUser={createApiUser} />
  }
  if (adminUser) return <AdminUserDashboard />
  return (
    <ApiUserDashboard
      apiUser={apiUser}
      clearWelcome={() => push('/')}
      showWelcome={query && query.newApiAccount} // If an API user has just been created, show welcome message.
    />
  )
}
