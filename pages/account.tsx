import React, { Component } from 'react'
import {
  withAuth0,
  WithAuth0Props,
  withAuthenticationRequired
} from '@auth0/auth0-react'

import AdminUserForm from '../components/AdminUserForm'
import ApiUserForm from '../components/ApiUserForm'
import { ApiUser, OnUpdateUser } from '../types/user'

type Props = {
  adminUser?: ApiUser
  apiUser?: ApiUser
  updateUser: OnUpdateUser
}

class Account extends Component<Props & WithAuth0Props> {
  render() {
    const { adminUser, apiUser, updateUser } = this.props
    if (!adminUser && !apiUser) {
      return <p>Not authorized to view this page.</p>
    }
    return (
      <div>
        <h1>My Account</h1>
        {apiUser && <ApiUserForm apiUser={apiUser} />}
        {adminUser && (
          <AdminUserForm
            adminUser={adminUser}
            isSelf
            onUpdateUser={updateUser}
          />
        )}
      </div>
    )
  }
}

export default withAuthenticationRequired(withAuth0(Account))
