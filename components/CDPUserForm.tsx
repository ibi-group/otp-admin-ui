import React, { useState } from 'react'
import { Alert, Form } from 'react-bootstrap'

import { CDPUser, OnUpdateUser } from '../types/user'

/**
 * Form showing details for a specific CDP User.
 */
const CDPUserForm = ({
  cdpUser,
  isSelf,
  onUpdateUser
}: {
  cdpUser: CDPUser
  isSelf?: boolean
  onUpdateUser: OnUpdateUser
}): JSX.Element => {
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
      <Alert variant="warning">
        <Alert.Heading>Example Only!</Alert.Heading>
        <p>
          This demonstrates that this field can be changed, but is only a demo.
          If we want to edit more than one character at a time, we should use
          Formik (see ApiUserForm)
        </p>
      </Alert>
      <Form.Label htmlFor="name">Name</Form.Label>
      <Form.Control
        defaultValue={cdpUser.name}
        disabled={!onUpdateUser}
        id="name"
        name="name"
        onChange={(e) => updateUser({ name: e.target.value })}
      />
    </div>
  )
}

export default CDPUserForm
