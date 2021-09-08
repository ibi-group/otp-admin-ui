import { Key } from '@styled-icons/fa-solid/Key'
import { Component } from 'react'
import { Button, ListGroup } from 'react-bootstrap'

/**
 * Shows an individual API key with management features (create, delete). Delete
 * is only permitted for admin users.
 */
export default class ApiKeyRow extends Component {
  _deleteKey = () => {
    const { apiKey, deleteKey } = this.props
    const message = `Are you sure you want to delete API key ${apiKey.keyId}?`
    if (!window.confirm(message)) {
      return
    }
    deleteKey(apiKey)
  }

  _viewApiKey = () => {
    const { apiKey } = this.props
    window.prompt('Copy and paste the API key to use in requests', apiKey.value)
  }

  render () {
    const { apiKey, isAdmin } = this.props
    return (
      <ListGroup.Item as='li'>
        <Key size={20} style={{marginRight: 10}} />
        {apiKey.name} ({apiKey.keyId}){' '}
        {isAdmin &&
          <Button
            className='float-right'
            onClick={this._deleteKey}
            size='sm'
            variant='link'
          >
            Delete
          </Button>
        }
        <Button
          className='float-right'
          onClick={this._viewApiKey}
          size='sm'
          variant='link'
        >
          View key
        </Button>
      </ListGroup.Item>
    )
  }
}
