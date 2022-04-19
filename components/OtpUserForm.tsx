import React from 'react'

import { AbstractUser } from '../types/user'

type Props = { user: AbstractUser }

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
