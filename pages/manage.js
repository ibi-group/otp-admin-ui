import { useRouter } from 'next/router'
import { Tab, Tabs } from 'react-bootstrap'
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
        <Tab eventKey='api' title='API Users'>
          <UserList type={'api'} />
        </Tab>
        <Tab eventKey='admin' title='Admin Users'>
          <UserList type={'admin'} />
        </Tab>
        <Tab eventKey='otp' title='OTP Users'>
          <UserList type={'otp'} />
        </Tab>
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
