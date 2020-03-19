import { useAuth } from 'use-auth0-hooks'

import UserList from '../components/UserList'

export default function Index () {
  const { isAuthenticated, isLoading } = useAuth({
    audience: process.env.AUTH0_AUDIENCE,
    scope: process.env.AUTH0_SCOPE
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
      <style jsx>{`
          * {
            font-family: 'Arial';
          }
        `}
      </style>
    </div>
  )
}
