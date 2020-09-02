import { Component } from 'react'
import { Button } from 'react-bootstrap'
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
    if (user.status === 'success') {
      window.alert(`Created user: ${user.data.email}`)
      await this.fetchUserData(true)
    }
  }

  async componentDidMount () {
    await this.fetchUserData()
  }

  render () {
    const { auth, type } = this.props
    const { users, usersError } = this.state
    const selectedType = USER_TYPES.find(t => t.value === type)
    if (!auth.isAuthenticated) return null
    if (!selectedType) return <div>Page does not exist!</div>
    return (
      <div>
        <h2>List of {selectedType.label}</h2>
        <Button variant='outline-primary' onClick={this.handleCreateUser}>
          Create user +
        </Button>
        {' '}
        <Button onClick={this.fetchUserData}>
          Fetch users <span aria-label='refresh' role='img'>🔄</span>
        </Button>
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
