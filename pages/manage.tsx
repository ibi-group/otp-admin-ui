import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'
import { Tab, Tabs } from 'react-bootstrap'

import UserList from '../components/UserList'
import { USER_TYPES } from '../util/constants'
import { OnUpdateUser } from '../types/user'

type Props = {
  adminUser?: boolean
  updateUser: OnUpdateUser
}

export default function Manage(props: Props): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth0()
  const {
    push,
    query: { type }
  } = useRouter()
  if (!isLoading && !isAuthenticated) {
    return <div>Please log in to view the Admin Dashboard.</div>
  }
  // Do not allow non-admin users to view page.
  if (!props.adminUser) {
    return <p>Must be admin user to view this page!</p>
  }
  const path = '/manage'
  return (
    <div>
      <Tabs
        activeKey={type || 'api'}
        className="mb-4"
        id="admin-dashboard-tabs"
        onSelect={(key) => push(key === '/' ? path : `${path}?type=${key}`)}
        variant="pills"
      >
        {USER_TYPES.map((item) => (
          <Tab eventKey={item.value} key={item.value} title={item.label}>
            <UserList type={item.value} updateUser={props.updateUser} />
          </Tab>
        ))}
      </Tabs>
      <style jsx>
        {`
          * {
            font-family: 'Arial';
          }
        `}
      </style>
    </div>
  )
}
