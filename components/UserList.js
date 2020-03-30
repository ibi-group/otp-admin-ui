import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import { withAuth } from 'use-auth0-hooks'

import UserRow from './UserRow'
import { AUTH0_SCOPE } from '../util/constants'

async function secureFetch (url, accessToken, method = 'get', options = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-api-key': process.env.API_KEY
    },
    ...options
  })
  if (res.status >= 400) {
    const result = await res.json()
    let message = `Error ${method}-ing user: ${result.message}`
    if (result.detail) message += `  (${result.detail})`
    return window.alert(message)
  }
  return res.json()
}

class UserList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      users: null,
      usersError: null
    }
    // TODO fix babel plugin so we can use class properties
    // https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
    // https://nextjs.org/docs/advanced-features/customizing-babel-config
    this.handleCreateUser = this.handleCreateUser.bind(this)
    this.fetchUserData = this.fetchUserData.bind(this)
    this.handleDeleteUser = this.handleDeleteUser.bind(this)
  }

  async fetchUserData (force = false) {
    const { users, usersError } = this.state
    if (!force && (users || usersError)) {
      return
    }

    const { accessToken } = this.props.auth
    if (!accessToken) {
      return
    }
    const fetchedUsers = await secureFetch(`${process.env.API_BASE_URL}/api/secure/user`, accessToken)
    if (fetchedUsers) {
      this.setState({ users: fetchedUsers })
    }
  }

  async handleDeleteUser (user) {
    const { accessToken } = this.props.auth
    let message = `Are you sure you want to delete user ${user.email}?`
    if (user.isDataToolsUser) {
      message = 'WARNING: user is a Data Tools user!\n' + message
    }
    if (!window.confirm(message)) {
      return
    }
    const result = await secureFetch(
      `${process.env.API_BASE_URL}/api/secure/user/${user.id}`,
      accessToken,
      'delete'
    )
    window.alert(result.message)
    await this.fetchUserData(true)
  }

  async handleCreateUser () {
    const { accessToken } = this.props.auth
    const email = window.prompt('Enter an email address', 'landontreed+hello@gmail.com')
    if (!email) return
    const user = await secureFetch(
      `${process.env.API_BASE_URL}/api/secure/user`,
      accessToken,
      'post',
      { body: JSON.stringify({ email }) }
    )
    if (user) {
      window.alert(`Created user: ${user.email}`)
      await this.fetchUserData(true)
    }
  }

  async componentDidMount () {
    await this.fetchUserData()
  }

  async componentDidUpdate () {
    await this.fetchUserData()
  }

  render () {
    const { auth } = this.props
    const { users, usersError } = this.state
    if (!auth.isAuthenticated) return null
    return (
      <div>
        <h2>List of Users</h2>
        <button onClick={this.handleCreateUser}>Create user +</button>
        <button onClick={this.fetchUserData}>
          Fetch users <span aria-label='refresh' role='img'>🔄</span>
        </button>
        {
          users && (
            <div>
              {usersError && <pre>Error loading users: {usersError}</pre>}
              <ul>
                {users && users.length
                  ? users.map(user => (
                    <UserRow
                      key={user.id}
                      user={user}
                      onDeleteUser={this.handleDeleteUser}
                    />
                  ))
                  : 'No users exist'}
              </ul>
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

export default withAuth(UserList, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: AUTH0_SCOPE
})
