import { useRouter } from 'next/router'
import { useAuth0 } from '@auth0/auth0-react'
import useSWR from 'swr'

import AdminUserDashboard from '../components/AdminUserDashboard'
import ApiUserDashboard from '../components/ApiUserDashboard'
import ApiUserForm from '../components/ApiUserForm'
import WelcomeScreen from '../components/WelcomeScreen'
import { ADMIN_USER_URL, API_USER_URL } from '../util/constants'

export default function Index (props) {
  const {
    adminUser,
    apiUser,
    handleSignup
  } = props
  //const { data: adminUser } = useSWR(`${ADMIN_USER_URL}/fromtoken`)
  //const { data: apiUser } = useSWR(`${API_USER_URL}/fromtoken`)
  console.log(adminUser, apiUser)
  const { push, query } = useRouter()
  const { isAuthenticated } = useAuth0()

  if (!isAuthenticated) {
    return (
      <WelcomeScreen handleSignup={handleSignup} />
    )
  }

  if (!adminUser && (!apiUser || !apiUser.hasConsentedToTerms)) {
    // New API user sign up will have both adminUser and apiUser to null,
    // or apiUser will have the terms not accepted.
    // For these users, display the API setup component.
    return <ApiUserForm isCreating />
  }
  if (adminUser) return <AdminUserDashboard />
  return (
    <ApiUserDashboard
      apiUser={apiUser}
      clearWelcome={() => push('/')}
      // If an API user has just been created, show welcome message.
      showWelcome={query && query.newApiAccount} />
  )
}
