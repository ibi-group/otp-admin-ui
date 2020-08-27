const AdminUserForm = ({ adminUser }) => {
  return (
    <div>
      <p>Account type: ADMIN</p>
      <p>Email: {adminUser.email}</p>
    </div>
  )
}

export default AdminUserForm
