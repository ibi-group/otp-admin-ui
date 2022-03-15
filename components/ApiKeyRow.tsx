import React, { Component } from 'react'
import { Key } from '@styled-icons/fa-solid/Key'
import { Button, ListGroup } from 'react-bootstrap'

import { ApiKey } from '../types/user'

type Props = {
  isAdmin?: boolean
  apiKey: ApiKey
  deleteKey: (apiKey: ApiKey) => void
}

/**
 * Shows an individual API key with management features (create, delete). Delete
 * is only permitted for admin users.
 */
export default class ApiKeyRow extends Component<Props> {
  handleDeleteKey = (): void => {
    const { apiKey, deleteKey } = this.props
    const message = `Are you sure you want to delete API key ${apiKey.keyId}?`
    if (!window.confirm(message)) {
      return
    }
    deleteKey(apiKey)
  }

  handleViewApiKey = (): void => {
    const { apiKey } = this.props
    window.prompt('Copy and paste the API key to use in requests', apiKey.value)
  }

  render(): JSX.Element {
    const { apiKey, isAdmin } = this.props
    return (
      <ListGroup.Item as="li">
        <Key size={20} style={{ marginRight: 10 }} />
        {apiKey.name} ({apiKey.keyId}){' '}
        {isAdmin && (
          <Button
            className="float-right"
            onClick={this.handleDeleteKey}
            size="sm"
            variant="link"
          >
            Delete
          </Button>
        )}
        <Button
          className="float-right"
          onClick={this.handleViewApiKey}
          size="sm"
          variant="link"
        >
          View key
        </Button>
      </ListGroup.Item>
    )
  }
}
