const UserRow = ({ onDeleteUser, user }) => {
  const handleDeleteUser = event => onDeleteUser(user)

  return (
    <li>
      <a>{user.email}</a>
      <style jsx>{`
        li {
          list-style: none;
          margin: 5px 0;
        }

        a {
          text-decoration: none;
          color: blue;
          font-family: 'Arial';
          margin-right: 5px;
        }

        a:hover {
          opacity: 0.6;
        }
      `}
      </style>
      <button onClick={handleDeleteUser}>x</button>
    </li>
  )
}

export default UserRow


const PostLink = ({ post }) => (
  <li>

  </li>
)
