import { Component } from 'react'
import { withAuth } from 'use-auth0-hooks'

import UserRow from './UserRow'
import { secureFetch } from '../util'
import { ADMIN_USER_URL, AUTH0_SCOPE, OTP_USER_URL } from '../util/constants'

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
    if (fetchedUsers) {
      this.setState({ users: fetchedUsers })
    }
  }

  _getUrl () { return this.props.type === 'admin' ? ADMIN_USER_URL : OTP_USER_URL }

  handleDeleteUser = async (user) => {
    const { accessToken } = this.props.auth
    let message = `Are you sure you want to delete user ${user.email}?`
    if (user.isDataToolsUser) {
      message = 'WARNING: user is a Data Tools user!\n' + message
    }
    if (!window.confirm(message)) {
      return
    }
    const result = await secureFetch(
      `${this._getUrl()}/${user.id}`,
      accessToken,
      'delete'
    )
    window.alert(result.message)
    await this.fetchUserData(true)
  }

  handleCreateUser = async () => {
    const { accessToken } = this.props.auth
    const email = window.prompt('Enter an email address', 'landontreed+hello@gmail.com')
    if (!email) return
    const user = await secureFetch(
      this._getUrl(),
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
        <h2>List of {this.props.type === 'admin' ? 'Admin' : 'OTP'} Users</h2>
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
