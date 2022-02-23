import React from 'react'
import { User } from '@styled-icons/fa-solid/User'
import { Button, ListGroup } from 'react-bootstrap'

import {
  AbstractUser,
  OnDeleteUser,
  OnUpdateUser,
  OnViewUser
} from '../types/user'
import { USER_TYPE } from '../util/constants'

import UserDetails from './UserDetails'

type Props = {
  activeId?: string
  onDeleteUser: OnDeleteUser
  onUpdateUser: OnUpdateUser
  onViewUser: OnViewUser
  type: USER_TYPE
  user: AbstractUser
}

/**
 * Renders a row in UserList for a specific user.
 */
const UserRow = ({
  activeId,
  onDeleteUser,
  onUpdateUser,
  onViewUser,
  type,
  user
}: Props): JSX.Element => {
  const handleDeleteUser = () => onDeleteUser(user, type)
  return (
    <ListGroup.Item as="li">
      <span className="align-middle">
        <User size={20} style={{ marginRight: 10 }} />
        {user.email}
      </span>
      <Button
        className="float-right"
        onClick={handleDeleteUser}
        size="sm"
        variant="link"
      >
        Delete
      </Button>
      <UserDetails
        onUpdateUser={onUpdateUser}
        onViewUser={onViewUser}
        show={user.id === activeId}
        type={type}
        user={user}
      />
    </ListGroup.Item>
  )
}

export default UserRow
