import { Key } from '@styled-icons/fa-solid/Key'
import { Component } from 'react'
import { Button, ListGroup } from 'react-bootstrap'

export default class ApiKeyRow extends Component {
  _deleteKey = () => this.props.deleteKey(this.props.apiKey)

  _viewApiKey = () => {
    const { apiKey } = this.props
    window.prompt('Copy and paste the API key to use in requests', apiKey.value)
  }

  render () {
    const { apiKey, isAdmin } = this.props
    return (
      <ListGroup.Item as='li'>
        <Key size={20} style={{marginRight: 10}} />
        {apiKey.keyId}{' '}
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
