import { useRouter } from 'next/router'
import Select from 'react-select'
import { useAuth } from 'use-auth0-hooks'

import UserList from '../components/UserList'
import { AUTH0_SCOPE } from '../util/constants'

export default function Manage () {
  const { isAuthenticated, isLoading } = useAuth({
    audience: process.env.AUTH0_AUDIENCE,
    scope: AUTH0_SCOPE
  })
  const { push, query: { type } } = useRouter()
  if (!isLoading && !isAuthenticated) {
    return (
      <div>
        Please log in to view the Admin Dashboard.
      </div>
    )
  }
  const manageOptions = [
    {label: 'Home'}, // value is undefined to match missing query param
    {value: 'admin', label: 'Admin Users'},
    {value: 'otp', label: 'OpenTripPlanner Users'}
  ]
  return (
    <div>
      <h1>Manage</h1>
      <Select
        placeholder='Manage...'
        value={manageOptions.find(o => o.value === type)}
        options={manageOptions}
        onChange={(option) => push(option.value ? `/manage?type=${option.value}` : '/manage')}
      />
      {type === 'otp' || type === 'admin' ? <UserList type={type} /> : null}
      <style jsx>{`
          * {
            font-family: 'Arial';
          }
        `}
      </style>
    </div>
  )
}
