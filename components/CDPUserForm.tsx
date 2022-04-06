import React from 'react'
import { Alert, Form } from 'react-bootstrap'

import { CDPUser, OnUpdateUser } from '../types/user'

type Props = {
  cdpUser: CDPUser
  isSelf?: boolean
  onUpdateUser: OnUpdateUser
}
/**
 * Form showing details for a specific CDP User.
 */
const CDPUserForm = ({ cdpUser, isSelf, onUpdateUser }: Props): JSX.Element => {
  const updateUser = (update: { [field: string]: any }) => {
    onUpdateUser({
      isSelf,
      type: 'cdp',
      user: { ...cdpUser, ...update }
    })
  }
  return (
    <div>
      <p>Account type: CDP</p>
      <p>Email: {cdpUser.email}</p>
    </div>
  )
}

export default CDPUserForm
