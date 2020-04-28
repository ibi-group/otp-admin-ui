import { useAuth } from 'use-auth0-hooks'

import LogSummary from '../components/LogSummary'
import UserList from '../components/UserList'
import { AUTH0_SCOPE } from '../util/constants'

export default function Index () {
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
  return (
    <div>
      <h1>OTP Admin Dashboard Overview</h1>
      <UserList type='admin' />
      <UserList type='otp' />
      <LogSummary />
      <style jsx>{`
          * {
            font-family: 'Arial';
          }
        `}
      </style>
    </div>
  )
}
