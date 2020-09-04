import { useRouter } from 'next/router'
import { Button, ListGroup } from 'react-bootstrap'
import useSWR, { mutate } from 'swr'
import { useAuth0 } from '@auth0/auth0-react'

import FetchMessage from './FetchMessage'
import UserRow from './UserRow'
import { AUTH0_SCOPE, USER_TYPES } from '../util/constants'
import { secureFetch } from '../util/middleware'

function _getUrl (type) {
  const selectedType = USER_TYPES.find(t => t.value === type)
  if (!selectedType) throw new Error(`Type: ${type} does not exist!`)
  return selectedType.url
}

/**
 * This component renders a list of users (can be any subtype of otp-middleware's
 * AbstractUser).
 */
function UserList ({ type }) {
  const { accessToken, isAuthenticated } = useAuth0({
    audience: process.env.AUTH0_AUDIENCE,
    scope: AUTH0_SCOPE
  })
  const router = useRouter()
  const onViewUser = (user) => {
    if (!user) router.push(`/manage?type=${type}`)
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
    const result = await secureFetch(
      `${_getUrl(type)}/${user.id}`,
      accessToken,
      'delete'
    )
    mutate(_getUrl(type))
    if (result.code >= 400) {
      window.alert(result.message)
    }
  }
  const onCreateAdminUser = async () => {
    const email = window.prompt(`Enter an email address for admin user.`)
    // TODO: Validate user.
    if (!email) return
    // Create user and re-fetch users.
    const adminUrl = _getUrl('admin')
    // TODO: Can we replace with useSWR (might only be possible for fetching/GET)?
    await secureFetch(
      adminUrl,
      accessToken,
      'post',
      { body: JSON.stringify({ email }) }
    )
    mutate(adminUrl)
  }
  const selectedType = USER_TYPES.find(t => t.value === type)
  if (!isAuthenticated) return null
  if (!selectedType) return <div>Page does not exist!</div>
  const { data: users, error } = useSWR(_getUrl(type))
  return (
    <div>
      <h2 className='mb-4'>List of {selectedType.label}</h2>
      {/*
        Only permit user creation for admin users.
        Other users must be created through standard flows.
      */}
      {type === 'admin' &&
        <Button className='mr-3' variant='outline-primary' onClick={onCreateAdminUser}>
          Create user +
        </Button>
      }
      <FetchMessage data={users} error={error} />
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
