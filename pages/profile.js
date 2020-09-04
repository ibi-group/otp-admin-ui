import { withAuth0, withAuthenticationRequired } from '@auth0/auth0-react'

import AdminUserForm from '../components/AdminUserForm'
import ApiUserForm from '../components/ApiUserForm'

function Profile (props) {
  const { adminUser, apiUser } = props
  // TODO: It appears to be possible to access this page as an OTP user, so we
  // need to prevent that.
  if (!adminUser && !apiUser) {
    return <p>Not authorized to view this page.</p>
  }
  return (
    <div>
      <h1>My Account</h1>
      {apiUser && <ApiUserForm apiUser={apiUser} />}
      {adminUser && <AdminUserForm adminUser={adminUser} />}
    </div>
  )
}

export default withAuthenticationRequired(withAuth0(Profile))
