import { useRouter } from 'next/router'
import { useAuth } from 'use-auth0-hooks'

import ApiUserSetup from '../components/ApiUserSetup'
import ApiUserWelcome from '../components/ApiUserWelcome'
import LogSummary from '../components/LogSummary'
import VerifyEmailScreen from '../components/verify-email-screen'
import UserList from '../components/UserList'
import { AUTH0_SCOPE } from '../util/constants'

export default function Index (props) {
  const {
    adminUser,
    apiUser,
    createUser,
    isUserFetched
  } = props
  const { query } = useRouter()
  const { isAuthenticated, user } = useAuth({
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

  if (user && !user.email_verified) {
    return <VerifyEmailScreen />
  }

  // FIXME: isLoading appears to be broken in useAuth.
  if (!isUserFetched) {
    return <div>Loading...</div>
  }

  if (!adminUser && (!apiUser || !apiUser.hasConsentedToTerms)) {
    // New API user sign up will have both adminUser and apiUser to null,
    // or apiUser will have the terms not accepted.
    // For these users, display the API setup component.
    return <ApiUserSetup createUser={createUser} />
  }
  // If an API user has just been created, show welcome message.
  let banner
  if (query && query.newApiAccount) {
    banner = <ApiUserWelcome />
  }

  return (
    <div>
      <h1>OTP Admin Dashboard Overview</h1>
      {banner}
      {adminUser &&
        <>
          <UserList />
          <UserList type='otp' />
          <LogSummary />
        </>
      }
      <style jsx>{`
          * {
            font-family: 'Arial';
          }
        `}
      </style>
    </div>
  )
}
