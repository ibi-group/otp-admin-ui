import { User } from '@styled-icons/fa-solid/User'
import { Button, ListGroup } from 'react-bootstrap'

import UserDetails from './UserDetails'

const UserRow = ({ activeId, onDeleteUser, onViewUser, type, user }) => {
  const handleDeleteUser = event => onDeleteUser(user)

  return (
    <ListGroup.Item as='li'>
      <span className='align-middle'>
        <User size={20} style={{marginRight: 10}} />
        {user.email}
      </span>
      <Button
        className='float-right'
        variant='link'
        size='sm'
        onClick={handleDeleteUser}
      >
        Delete
      </Button>
      <UserDetails
        user={user}
        show={user.id === activeId}
        onViewUser={onViewUser}
        type={type} />
    </ListGroup.Item>
  )
}

export default UserRow
