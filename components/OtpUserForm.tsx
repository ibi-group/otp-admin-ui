import React from 'react'

import { ApiUser } from '../types/user'

type Props = { user: ApiUser }

/**
 * Form showing details for a specific OTP User.
 *
 * TODO: this is currently barebones and needs to be fleshed out.
 */
const OtpUserForm = ({ user }: Props): JSX.Element => {
  return (
    <div>
      <p>Email: {user.email}</p>
      <p>TODO</p>
    </div>
  )
}

export default OtpUserForm
