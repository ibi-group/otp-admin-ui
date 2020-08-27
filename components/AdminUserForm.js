/**
 * Form showing details for a specific Admin User.
 *
 * TODO: this is currently barebones, but it matches the otp-middleware level
 * of detail for now.
 */
const AdminUserForm = ({ adminUser }) => {
  return (
    <div>
      <p>Account type: ADMIN</p>
      <p>Email: {adminUser.email}</p>
    </div>
  )
}

export default AdminUserForm
