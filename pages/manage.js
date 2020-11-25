import { useRouter } from 'next/router'
import { Tab, Tabs } from 'react-bootstrap'
import { useAuth0 } from '@auth0/auth0-react'

import UserList from '../components/UserList'
import { AUTH0_SCOPE, USER_TYPES } from '../util/constants'

export default function Manage (props) {
  const { isAuthenticated, isLoading } = useAuth0({
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
  const path = '/manage'
  return (
    <div>
      <Tabs
        id='admin-dashboard-tabs'
        className='mb-4'
        activeKey={type || 'api'}
        onSelect={(key) => push(key === '/' ? path : `${path}?type=${key}`)}
        variant='pills'
      >
        {USER_TYPES.map(item => (
          <Tab key={item.value} eventKey={item.value} title={item.label}>
            <UserList
              type={item.value}
              fetchUsers={props.fetchUsers}
              updateUser={props.updateUser}
            />
          </Tab>
        ))}
      </Tabs>
      <style jsx>{`
          * {
            font-family: 'Arial';
          }
        `}
      </style>
    </div>
  )
}
