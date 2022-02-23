import React from 'react'
import Form from 'react-bootstrap/Form'
// @ts-expect-error types invalid
import Select from 'react-select'

import { AdminUser, OnUpdateUser, Subscription } from '../types/user'

const subscriptionOptions = [
  {
    label: 'New errors',
    value: 'NEW_ERROR'
  }
]

/**
 * Form showing details for a specific Admin User.
 */
const AdminUserForm = ({
  adminUser,
  isSelf,
  onUpdateUser
}: {
  adminUser: AdminUser
  isSelf?: boolean
  onUpdateUser: OnUpdateUser
}): JSX.Element => {
  const handleUpdateSubscriptions = (options: Subscription[]) => {
    const subscriptions = options ? options.map((o) => o.value) : []
    onUpdateUser({
      isSelf,
      type: 'admin',
      user: { ...adminUser, subscriptions }
    })
  }
  const currentSubscriptions = adminUser.subscriptions
    ? adminUser.subscriptions
        .map((v) => subscriptionOptions.find((o) => o.value === v))
        .filter((o) => o)
    : []
  return (
    <div>
      <p>Account type: ADMIN</p>
      <p>Email: {adminUser.email}</p>
      <Form.Label htmlFor="subscriptions">Email subscriptions</Form.Label>
      <Select
        defaultValue={currentSubscriptions}
        disabled={!onUpdateUser}
        id="subscriptions"
        isMulti
        label="Subscriptions"
        name="subscriptions"
        onChange={handleUpdateSubscriptions}
        options={subscriptionOptions}
      />
    </div>
  )
}

export default AdminUserForm
