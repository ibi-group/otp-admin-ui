import { useRouter } from 'next/router'
import Select from 'react-select'
import { useAuth } from 'use-auth0-hooks'

import UserList from '../components/UserList'
import { AUTH0_SCOPE } from '../util/constants'

export default function Manage (props) {
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
  // Do not allow non-admin users to view page.
  if (!props.adminUser) {
    return (
      <p>
        Must be admin user to view this page!
      </p>
    )
  }
  const manageOptions = [
    // TODO: Remove Home or do we want a summary view here?
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
      {!type &&
        <p>
          Please select a category above.
        </p>
      }
      {/* UserList component repeated to trigger re-render on type change. */}
      {type === 'otp' && <UserList type={type} />}
      {type === 'admin' && <UserList type={type} />}
      <style jsx>{`
          * {
            font-family: 'Arial';
          }
        `}
      </style>
    </div>
  )
}
