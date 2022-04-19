import React from 'react'

import { CDPUser } from '../types/user'

type Props = {
  cdpUser: CDPUser
  isSelf?: boolean
}
/**
 * Form showing details for a specific CDP User.
 */
const CDPUserForm = ({ cdpUser }: Props): JSX.Element => {
  return (
    <div>
      <p>Account type: CDP</p>
      <p>Email: {cdpUser.email}</p>
    </div>
  )
}

export default CDPUserForm
