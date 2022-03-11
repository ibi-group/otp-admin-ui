import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'
import { Tab, Tabs } from 'react-bootstrap'

import UserList from '../components/UserList'
import { USER_TYPES } from '../util/constants'
import { OnUpdateUser } from '../types/user'
import { getActiveUserTypes } from '../util/ui'

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

  const [disabledUsersShown, toggleDisabledUsers] = useState(false)

  if (!isLoading && !isAuthenticated) {
    return <div>Please log in to view the Admin Dashboard.</div>
  }
  // Do not allow non-admin users to view page.
  if (!props.adminUser) {
    return <p>Must be admin user to view this page!</p>
  }

  const activeUserTypes = getActiveUserTypes()
  const inactiveUserTypes = USER_TYPES.filter(
    (userType) => !activeUserTypes.find((ut) => ut.value === userType.value)
  )

  const path = '/manage'
  return (
    <div>
      <Tabs
        activeKey={type || 'api'}
        className="mb-4"
        id="admin-dashboard-tabs"
        onSelect={(key) => {
          // Fake button behavior
          if (key === 'enable-disabled-types') {
            // First toggle the state
            toggleDisabledUsers(!disabledUsersShown)

            // If we're hiding the tab that's currently active, push the user back to a visible tab
            if (
              disabledUsersShown &&
              inactiveUserTypes.find((ut) => ut.value === type)
            ) {
              push(`${path}?type=${activeUserTypes[0].value}`)
            }
            // Don't push to an invalid key!
            return
          }

          // Real tab behavior
          push(key === '/' ? path : `${path}?type=${key}`)
        }}
        variant="pills"
      >
        {activeUserTypes.map((item) => (
          <Tab eventKey={item.value} key={item.value} title={item.label}>
            <UserList type={item.value} updateUser={props.updateUser} />
          </Tab>
        ))}
        {disabledUsersShown &&
          inactiveUserTypes.map((item) => (
            <Tab eventKey={item.value} key={item.value} title={item.label}>
              <UserList type={item.value} updateUser={props.updateUser} />
            </Tab>
          ))}
        {inactiveUserTypes.length > 0 && (
          <Tab
            eventKey="enable-disabled-types"
            key="enable-disabled-types"
            tabClassName="show-more-button"
            title={`${disabledUsersShown ? 'Hide' : 'Show'} Disabled Types`}
          />
        )}
      </Tabs>
      <style global jsx>
        {`
          .show-more-button {
            color: #bbb;
          }
          .show-more-button:hover {
            color: #999;
          }
        `}
      </style>
      <style jsx>
        {`
          * {
            font-family: 'Arial';
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}
      </style>
    </div>
  )
}
