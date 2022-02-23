/* eslint-disable react/jsx-curly-spacing */
import React from 'react'
import { User } from '@styled-icons/fa-solid/User'
import { Button, Modal } from 'react-bootstrap'

import {
  ApiUser,
  AdminUser,
  OnUpdateUser,
  OnViewUser,
  CDPUser
} from '../types/user'
import { USER_TYPE } from '../util/constants'

import AdminUserForm from './AdminUserForm'
import ApiKeyList from './ApiKeyList'
import ApiUserForm from './ApiUserForm'
import CDPUserForm from './CDPUserForm'

/**
 * Modal showing user details for various user types (OTP, Admin, API).
 */
const UserDetails = ({
  onUpdateUser,
  onViewUser,
  show,
  type,
  user
}: {
  onUpdateUser: OnUpdateUser
  onViewUser: OnViewUser
  show?: boolean
  type: USER_TYPE
  user: ApiUser | AdminUser | CDPUser
}): JSX.Element => {
  const hideUser = () => onViewUser(null, type)
  const showUser = () => onViewUser(user, type)

  if (type === 'otp') return <></>
  return (
    <>
      <Button
        className="float-right"
        onClick={showUser}
        size="sm"
        variant="link"
      >
        View
      </Button>

      <Modal onHide={hideUser} show={show} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <User size={30} style={{ marginRight: 10 }} />
            {user?.email || user.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {type === 'api' && 'apiKeys' in user && (
            <>
              <ApiUserForm apiUser={user} />
              <ApiKeyList apiUser={user} isAdmin />
            </>
          )}
          {type === 'admin' && (
            <AdminUserForm adminUser={user} onUpdateUser={onUpdateUser} />
          )}
          {type === 'cdp' && (
            <CDPUserForm cdpUser={user} onUpdateUser={onUpdateUser} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={hideUser}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UserDetails
