import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import { withAuth } from 'use-auth0-hooks'

import UserRow from './UserRow'

class UserList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      users: null,
      usersError: null
    }
    this.handleCreateUser = this.handleCreateUser.bind(this)
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
    console.log('fetching users')

    const res = await fetch(`${process.env.API_BASE_URL}/api/secure/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (res.status >= 400) {
      if (res.statusText) this.setState({ usersError: res.statusText })
      else {
        const { detail, message } = res.json()
        this.setState({ usersError: `${message}: ${detail}` })
      }
    } else {
      const users = await res.json()
      this.setState({
        users: users
      })
    }
  }

  async handleDeleteUser (user) {
    if (!window.confirm(`Are you sure you want to delete user ${user.email}?`)) {
      return
    }
    const res = await fetch(`${process.env.API_BASE_URL}/api/secure/user/${user.id}`, {
      method: 'delete',
      headers: {
        Authorization: `Bearer ${this.props.auth.accessToken}`
      }
    })
    if (res.status >= 400) {
      return window.alert('Error deleting user!')
    }
    const result = await res.json()
    window.alert(result.message)
    await this.fetchUserData(true)
  }

  // TODO fix babel plugin so we can use class properties
  // https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
  // https://nextjs.org/docs/advanced-features/customizing-babel-config
  async handleCreateUser () {
    const email = window.prompt('Enter an email address', 'landontreed+hello@gmail.com')
    if (!email) return
    const res = await fetch(`${process.env.API_BASE_URL}/api/secure/user`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${this.props.auth.accessToken}`
      },
      body: JSON.stringify({ email })
    })
    if (res.status >= 400) {
      return window.alert('Error creating user!')
    }
    const user = await res.json()
    window.alert(`Created user: ${user.email}`)
    await this.fetchUserData(true)
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
    return (
      <div>
        <button onClick={this.handleCreateUser}>Create user +</button>
        {
          users && (
            <div>
              <h1>Users (logged in: {auth.user.email})</h1>
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
      </div>
    )
  }
}

export default withAuth(UserList, {
  audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
  scope: ''
})
