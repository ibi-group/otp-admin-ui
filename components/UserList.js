import { withRouter } from 'next/router'
import { Component } from 'react'
import { Button, ListGroup } from 'react-bootstrap'
import { withAuth } from 'use-auth0-hooks'

import UserRow from './UserRow'
import { AUTH0_SCOPE, USER_TYPES } from '../util/constants'
import { secureFetch } from '../util/middleware'

class UserList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      users: null,
      usersError: null
    }
  }

  fetchUserData = async (force = false) => {
    const { users, usersError } = this.state
    if (!force && (users || usersError)) {
      return
    }

    const { accessToken } = this.props.auth
    if (!accessToken) {
      return
    }
    const fetchedUsers = await secureFetch(this._getUrl(), accessToken)
    if (fetchedUsers.status === 'success') {
      this.setState({ users: fetchedUsers.data })
    } else {
      window.alert(fetchedUsers.message)
    }
  }

  _getUrl () {
    const { type } = this.props
    const selectedType = USER_TYPES.find(t => t.value === type)
    if (!selectedType) throw new Error(`Type: ${type} does not exist!`)
    return selectedType.url
  }

  onDeleteUser = async (user) => {
    const { accessToken } = this.props.auth
    let message = `Are you sure you want to delete user ${user.email}?`
    // TODO: Remove Data Tools user prop?
    if (user.isDataToolsUser) {
      message = 'WARNING: user is a Data Tools user!\n' + message
    }
    if (!window.confirm(message)) {
      return
    }
    await secureFetch(
      `${this._getUrl()}/${user.id}`,
      accessToken,
      'delete'
    )
    await this.fetchUserData(true)
  }

  onViewUser = (user) => {
    const {router, type} = this.props
    if (!user) router.push(`/manage?type=${type}`)
    else router.push(`/manage?type=${type}&userId=${user.id}`)
  }

  onCreateUser = async () => {
    const {auth, type} = this.props
    const { accessToken } = auth
    const email = window.prompt(`Enter an email address for ${type} user.`)
    // TODO: Validate user.
    if (!email) return
    // Create user and re-fetch users.
    await secureFetch(
      this._getUrl(),
      accessToken,
      'post',
      { body: JSON.stringify({ email }) }
    )
    await this.fetchUserData(true)
  }

  async componentDidMount () {
    await this.fetchUserData()
  }

  async componentDidUpdate () {
    await this.fetchUserData()
  }

  render () {
    const { auth, router, type } = this.props
    const { query } = router
    const { users, usersError } = this.state
    const selectedType = USER_TYPES.find(t => t.value === type)
    if (!auth.isAuthenticated) return null
    if (!selectedType) return <div>Page does not exist!</div>
    return (
      <div>
        <h2 className='mb-4'>List of {selectedType.label}</h2>
        {/*
          Only permit user creation for admin users.
          Other users must be created through standard flows.
        */}
        {type === 'admin' &&
          <Button variant='outline-primary' onClick={this.onCreateUser}>
            Create user +
          </Button>
        }
        {' '}
        <Button onClick={this.fetchUserData}>
          Fetch users
        </Button>
        {
          users && (
            <div style={{marginTop: 10}}>
              {usersError && <pre>Error loading users: {usersError}</pre>}
              <ListGroup>
                {users && users.length
                  ? users.map(user => (
                    <UserRow
                      key={user.id}
                      activeId={query.userId}
                      type={type}
                      user={user}
                      onViewUser={this.onViewUser}
                      onDeleteUser={this.onDeleteUser}
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
}

export default withRouter(withAuth(UserList, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: AUTH0_SCOPE
}))
