import { Component } from 'react'
import { withAuth, withLoginRequired } from 'use-auth0-hooks'

import AdminUserForm from '../components/AdminUserForm'
import ApiUserForm from '../components/ApiUserForm'
import { AUTH0_SCOPE } from '../util/constants'

class Account extends Component {
  render () {
    const { adminUser, apiUser, updateUser } = this.props
    if (!adminUser && !apiUser) {
      return <p>Not authorized to view this page.</p>
    }
    return (
      <div>
        <h1>My Account</h1>
        {apiUser && <ApiUserForm apiUser={apiUser} />}
        {adminUser &&
          <AdminUserForm
            adminUser={adminUser}
            isSelf
            onUpdateUser={updateUser}
          />
        }
      </div>
    )
  }
}

export default withLoginRequired(
  withAuth(Account, {
    audience: process.env.AUTH0_AUDIENCE,
    scope: AUTH0_SCOPE
  })
)
