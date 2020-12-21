import { useRouter } from 'next/router'
import { stringify } from 'qs'
import { useState } from 'react'
import { Button, ListGroup } from 'react-bootstrap'
import useSWR from 'swr'
import { useAuth } from 'use-auth0-hooks'

import PageControls from './PageControls'
import UserRow from './UserRow'
import { AUTH0_SCOPE, USER_TYPES } from '../util/constants'
import { getUserUrl, secureFetch } from '../util/middleware'

/**
 * This component renders a list of users (can be any subtype of otp-middleware's
 * AbstractUser).
 */
function UserList ({ fetchUsers, summaryView, type, updateUser }) {
  // Set up hooks, state.
  const { accessToken, isAuthenticated } = useAuth({
    audience: process.env.AUTH0_AUDIENCE,
    scope: AUTH0_SCOPE
  })
  const [offset, setOffset] = useState(0)
  const router = useRouter()
  // Ensure user is authenticated and type from query param is valid.
  const selectedType = USER_TYPES.find(t => t.value === type)
  if (!isAuthenticated) return null
  if (!selectedType) return <div>Page does not exist!</div>
  // Fetch user data.
  const limit = 10
  const url = `${getUserUrl(type)}?${stringify({limit, offset})}`
  const getAllResult = useSWR(url)
  const { data, error, mutate: mutateList } = getAllResult
  const users = data && data.data
  // Set up on click handlers with mutates to trigger refresh on updates.
  const onViewUser = (user) => {
    if (!user || !user.id) router.push(`/manage?type=${type}`)
    else router.push(`/manage?type=${type}&userId=${user.id}`)
  }
  const onDeleteUser = async (user, type) => {
    let message = `Are you sure you want to delete user ${user.email}?`
    // TODO: Remove Data Tools user prop?
    if (user.isDataToolsUser) {
      message = 'WARNING: user is a Data Tools user!\n' + message
    }
    if (!window.confirm(message)) {
      return
    }
    // TODO: Can we replace with useSWR (might only be possible for fetching/GET)?
    const deleteResult = await secureFetch(
      `${getUserUrl(type)}/${user.id}`,
      accessToken,
      'delete'
    )
    mutateList()
    if (deleteResult.code >= 400) {
      window.alert(deleteResult.message)
    }
  }
  const onUpdateUser = async (args) => {
    await updateUser(args)
    mutateList()
  }
  const onCreateAdminUser = async (errorMessage = '') => {
    const email = window.prompt(`Enter an email address for admin user.`)
    // Create user and re-fetch users.
    const adminUrl = getUserUrl('admin')
    // TODO: Can we replace with useSWR (might only be possible for fetching/GET)?
    const createResult = await secureFetch(
      adminUrl,
      accessToken,
      'post',
      { body: JSON.stringify({ email }) }
    )
    mutateList()
    if (createResult.code >= 400) {
      window.alert(createResult.message)
    }
  }
  // If in summary view, show a simple block with user count.
  if (summaryView) {
    const total = data ? data.total : 0
    return (
      <div style={{display: 'inline-block', margin: '10px', textAlign: 'center'}}>
        <div style={{fontSize: 'xxx-large'}}>{total}</div>
        <div>{selectedType.label}</div>
        <Button onClick={onViewUser} size='sm' variant='outline-primary'>
          View
        </Button>
      </div>
    )
  }
  // Otherwise, show fill list of users with page controls.
  return (
    <div>
      <h2 className='mb-4'>List of {selectedType.label}</h2>
      <PageControls
        limit={limit}
        offset={offset}
        setOffset={setOffset}
        showSkipButtons
        result={getAllResult} />
      <div className='controls'>
        {/*
          Only permit user creation for admin users.
          Other users must be created through standard flows.
        */}
        {type === 'admin' &&
          <Button className='mr-3' variant='outline-primary' onClick={onCreateAdminUser}>
            Create user
          </Button>
        }
      </div>
      {
        users && (
          <div style={{marginTop: 10}}>
            {error && <pre>Error loading users: {error}</pre>}
            <ListGroup>
              {users && users.length
                ? users.map(user => (
                  <UserRow
                    key={user.id}
                    activeId={router.query.userId}
                    type={type}
                    user={user}
                    onUpdateUser={onUpdateUser}
                    onViewUser={onViewUser}
                    onDeleteUser={onDeleteUser}
                  />
                ))
                : <p>No users found.</p>}
            </ListGroup>
          </div>
        )
      }
      <style jsx>{`
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
