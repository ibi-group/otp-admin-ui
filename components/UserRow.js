const UserRow = ({ onDeleteUser, user }) => {
  const handleDeleteUser = event => onDeleteUser(user)

  return (
    <li>
      {user.email}
      <button onClick={handleDeleteUser}>x</button>
    </li>
  )
}

export default UserRow
