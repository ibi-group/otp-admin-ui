import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'
import { stringify } from 'qs'
import { Button, ListGroup } from 'react-bootstrap'
import useSWR from 'swr'

import { USER_TYPE, USER_TYPES } from '../util/constants'
import { getUserUrl, secureFetch } from '../util/middleware'
import { AbstractUser, OnUpdateUser, OnUpdateUserArgs } from '../types/user'

import PageControls from './PageControls'
import UserRow from './UserRow'

type Props = {
  summaryView?: boolean
  type: USER_TYPE
  updateUser?: OnUpdateUser
}

/**
 * This component renders a list of users (can be any subtype of otp-middleware's
 * AbstractUser).
 */
function UserList({
  summaryView,
  type,
  updateUser
}: Props): JSX.Element | null {
  // Set up hooks, state.
  const auth0 = useAuth0()
  const { isAuthenticated } = auth0
  const [offset, setOffset] = useState(0)
  const router = useRouter()
  // Ensure user is authenticated and type from query param is valid.
  const selectedType = USER_TYPES.find((t) => t.value === type)

  // Fetch user data.
  const limit = 10
  // Although we only want to fetch if authenticated, we have to fetch null
  // to comply with react hooks rules (see https://flaviocopes.com/react-hooks-conditionals/)
  const url = isAuthenticated
    ? `${getUserUrl(type)}?${stringify({ limit, offset })}`
    : null
  const getAllResult = useSWR(url)

  if (!isAuthenticated) return null
  if (!selectedType) return <div>Page does not exist!</div>
  const { data: swrData = {}, error, mutate: mutateList } = getAllResult
  const { data } = swrData
  const users = data && data.data
  // Set up on click handlers with mutates to trigger refresh on updates.
  const onViewUser = (user?: AbstractUser | null) => {
    if (!user || !user.id) router.push(`/manage?type=${type}`)
    else router.push(`/manage?type=${type}&userId=${user.id}`)
  }
  const onDeleteUser = async (user: AbstractUser, type: USER_TYPE) => {
    let message = `Are you sure you want to delete user ${user.email}?`
    // TODO: Remove Data Tools user prop?
    if (user.isDataToolsUser) {
      message = 'WARNING: user is a Data Tools user!\n' + message
    }
    if (!window.confirm(message)) {
      return
    }
    // Note: should not useSWR because SWR caches requests and polls at regular intervals.
    // (If we must use useSWR, we can probably still pass appropriate params explicitly.)
    const deleteResult = await secureFetch(
      `${getUserUrl(type)}/${user.id}`,
      auth0,
      'DELETE'
    )
    mutateList()
    if (deleteResult.error) {
      window.alert(deleteResult.message)
    }
  }
  const onUpdateUser = async (args: OnUpdateUserArgs) => {
    if (!updateUser) return

    await updateUser(args)
    mutateList()
  }
  const onCreateAdminUser = async (userType: USER_TYPE) => {
    const email = window.prompt(`Enter an email address for ${userType} user.`)
    // Create user and re-fetch users.
    const adminUrl = getUserUrl(userType)
    // Note: should not useSWR because SWR caches requests and polls at regular intervals.
    // (If we must use useSWR, we can probably still pass appropriate params explicitly.)
    const createResult = await secureFetch(adminUrl, auth0, 'POST', {
      body: JSON.stringify({ email })
    })
    mutateList()
    if (createResult.error) {
      window.alert(createResult.message)
    }
  }
  // If in summary view, show a simple block with user count.
  if (summaryView) {
    const total = data ? data.total : 0
    return (
      <div
        style={{ display: 'inline-block', margin: '10px', textAlign: 'center' }}
      >
        <div style={{ fontSize: 'xxx-large' }}>{total}</div>
        <div>{selectedType.label}</div>
        <Button
          data-id={selectedType.label}
          onClick={() => onViewUser()}
          size="sm"
          variant="outline-primary"
        >
          View
        </Button>
      </div>
    )
  }
  // Otherwise, show fill list of users with page controls.
  return (
    <div>
      <h2 className="mb-4">List of {selectedType.label}</h2>
      <PageControls
        limit={limit}
        offset={offset}
        result={getAllResult}
        setOffset={setOffset}
      />
      <div className="controls">
        {/*
          Only permit user creation for certain types of users.
          Other users must be created through standard flows.
        */}
        {['admin', 'cdp'].find((t) => t === type) && (
          <Button
            className="mr-3"
            onClick={() => onCreateAdminUser(type)}
            variant="outline-primary"
          >
            Create user
          </Button>
        )}
      </div>
      {users && (
        <div style={{ marginTop: 10 }}>
          {error && <pre>Error loading users: {error}</pre>}
          <ListGroup>
            {users && users.length ? (
              users.map((user: AbstractUser) => {
                const activeId = router.query.userId
                return (
                  <UserRow
                    activeId={
                      typeof activeId === 'object' ? activeId[0] : activeId
                    }
                    key={user.id}
                    onDeleteUser={onDeleteUser}
                    onUpdateUser={onUpdateUser}
                    onViewUser={onViewUser}
                    type={type}
                    user={user}
                  />
                )
              })
            ) : (
              <p>No users found.</p>
            )}
          </ListGroup>
        </div>
      )}
      <style jsx>
        {`
          ul {
            padding: 0;
          }
          .controls {
            align-items: center;
            display: flex;
          }
          li {
            list-style: none;
            margin: 5px 0;
          }

          a {
            text-decoration: none;
            color: blue;
          }

          a:hover {
            opacity: 0.6;
          }
        `}
      </style>
    </div>
  )
}

export default UserList
