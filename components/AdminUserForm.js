import Form from 'react-bootstrap/Form'
import Select from 'react-select'

const subscriptionOptions = [
  {
    value: 'NEW_ERROR',
    label: 'New errors'
  }
]

/**
 * Form showing details for a specific Admin User.
 */
const AdminUserForm = ({ adminUser, onUpdateUser, isSelf }) => {
  const handleUpdateSubscriptions = (options) => {
    const subscriptions = options ? options.map(o => o.value) : []
    onUpdateUser({
      user: {...adminUser, subscriptions},
      type: 'admin',
      isSelf
    })
  }
  const currentSubscriptions = adminUser.subscriptions
    ? adminUser.subscriptions
      .map(v => subscriptionOptions.find(o => o.value === v))
      .filter(o => o)
    : []
  return (
    <div>
      <p>Account type: ADMIN</p>
      <p>Email: {adminUser.email}</p>
      <Form.Label htmlFor='subscriptions'>Email subscriptions</Form.Label>
      <Select
        defaultValue={currentSubscriptions}
        disabled={!onUpdateUser}
        isMulti
        label='Subscriptions'
        name='subscriptions'
        id='subscriptions'
        options={subscriptionOptions}
        onChange={handleUpdateSubscriptions}
      />
    </div>
  )
}

export default AdminUserForm
