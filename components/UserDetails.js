import { User } from '@styled-icons/fa-solid/User'
import { Button, Modal } from 'react-bootstrap'

import AdminUserForm from './AdminUserForm'
import ApiKeyList from './ApiKeyList'
import ApiUserForm from './ApiUserForm'

/**
 * Modal showing user details for various user types (OTP, Admin, API).
 */
const UserDetails = ({ onUpdateUser, onViewUser, show, type, user }) => {
  const hideUser = () => onViewUser(null, type)
  const showUser = () => onViewUser(user, type)

  return (
    <>
      <Button
        className='float-right'
        variant='link'
        size='sm'
        onClick={showUser}>
        View
      </Button>

      <Modal size='lg' show={show} onHide={hideUser}>
        <Modal.Header closeButton>
          <Modal.Title>
            <User size={30} style={{marginRight: 10}} />
            {user.email}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {type === 'api' && (
            <>
              <ApiUserForm apiUser={user} />
              <ApiKeyList apiUser={user} isAdmin />
            </>
          )}
          {type === 'admin' && (
            <AdminUserForm adminUser={user} onUpdateUser={onUpdateUser} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={hideUser}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UserDetails
