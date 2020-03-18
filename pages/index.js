import { useAuth } from 'use-auth0-hooks'

import LogSummary from '../components/LogSummary'
import UserList from '../components/UserList'

export default function Index () {
  const { isAuthenticated, isLoading } = useAuth({
    audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    scope: ''
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
      <UserList />
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
