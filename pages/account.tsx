import React, { Component } from 'react'
import {
  withAuth0,
  WithAuth0Props,
  withAuthenticationRequired
} from '@auth0/auth0-react'

import AdminUserForm from '../components/AdminUserForm'
import ApiUserForm from '../components/ApiUserForm'
import { AdminUser, ApiUser, CDPUser, OnUpdateUser } from '../types/user'
import CDPUserForm from '../components/CDPUserForm'

type Props = {
  adminUser?: AdminUser
  apiUser?: ApiUser
  cdpUser?: CDPUser
  updateUser: OnUpdateUser
}

class Account extends Component<Props & WithAuth0Props> {
  render() {
    const { adminUser, apiUser, cdpUser, updateUser } = this.props
    if (!adminUser && !apiUser && !cdpUser) {
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
        {cdpUser && (
          <CDPUserForm cdpUser={cdpUser} isSelf onUpdateUser={updateUser} />
        )}
      </div>
    )
  }
}

export default withAuthenticationRequired(withAuth0(Account))
