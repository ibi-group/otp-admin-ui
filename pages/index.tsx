import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'

import AdminUserDashboard from '../components/AdminUserDashboard'
import ApiUserDashboard from '../components/ApiUserDashboard'
import ApiUserForm from '../components/ApiUserForm'
import WelcomeScreen from '../components/WelcomeScreen'
import type { ApiUser, CDPUser, HandleSignup } from '../types/user'
import CDPUserDashboard from '../components/CDPUserDashboard'

type Props = {
  adminUser: boolean
  apiUser: ApiUser
  cdpUser: CDPUser
  createApiUser: (apiUser: ApiUser) => Promise<void>
  handleSignup: HandleSignup
}

export default function Index(props: Props): JSX.Element {
  const { adminUser, apiUser, cdpUser, createApiUser, handleSignup } = props
  const { API_MANAGER_ENABLED } = process.env

  const { push, query } = useRouter()
  const { isAuthenticated } = useAuth0()

  if (!isAuthenticated) {
    return <WelcomeScreen handleSignup={handleSignup} />
  }

  if (
    API_MANAGER_ENABLED &&
    !adminUser &&
    (!apiUser || !apiUser.hasConsentedToTerms)
  ) {
    // New API user sign up will have both adminUser and apiUser to null,
    // or apiUser will have the terms not accepted.
    // For these users, display the API setup component.
    return <ApiUserForm createApiUser={createApiUser} />
  }
  if (adminUser) return <AdminUserDashboard />

  if (API_MANAGER_ENABLED && apiUser)
    return (
      <ApiUserDashboard
        apiUser={apiUser}
        clearWelcome={() => push('/')}
        showWelcome={query && !!query.newApiAccount} // If an API user has just been created, show welcome message.
      />
    )

  if (cdpUser) {
    return <CDPUserDashboard cdpUser={cdpUser} />
  }

  return (
    <>
      <h3>User is of invalid type!</h3>
      <p>
        This is likely because the user was created with functionality that is
        no longer configured or enabled.
      </p>
    </>
  )
}
