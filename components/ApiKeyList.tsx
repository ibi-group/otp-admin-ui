import React, { Component } from 'react'
import { withAuth0, WithAuth0Props } from '@auth0/auth0-react'
import { Alert, Button, ListGroup } from 'react-bootstrap'

import { secureFetch } from '../util/middleware'
import { API_USER_URL } from '../util/constants'
import { ApiUser, ApiKey } from '../types/user'

import ApiKeyRow from './ApiKeyRow'
import EmailForApiKeyMessage from './EmailForApiKeyMessage'

type Props = {
  isAdmin?: boolean
  apiUser: ApiUser
} & WithAuth0Props
// Max keys that an API user is allowed to create for themselves (an admin can
// create more)
const API_KEY_LIMIT = 2

/**
 * Shows a list of API keys with management features (create, delete) for a
 * particular ApiUser.
 */
class ApiKeyList extends Component<
  Props,
  {
    apiUser: ApiUser
  }
> {
  constructor(props: Props) {
    super(props)
    // FIXME: Come up with a better way to update user on API key create/delete.
    this.state = {
      apiUser: props.apiUser
    }
  }

  handleCreateKey = () => {
    const { isAdmin } = this.props
    let usagePlanId
    if (isAdmin) {
      // If admin is creating API key, allow them to provide a usage plan ID.
      usagePlanId = window.prompt(
        'Please provide a usage plan ID for the new key (or leave empty to use system default).'
      )
      // If user presses cancel, skip create key request.
      if (usagePlanId === null) return
    }
    this._makeKeyRequest({ method: 'POST', usagePlanId })
  }

  _deleteKey = (apiKey: ApiKey) =>
    this._makeKeyRequest({ keyId: apiKey.keyId, method: 'DELETE' })

  _makeKeyRequest = async ({
    keyId,
    method,
    usagePlanId
  }: {
    keyId?: string
    method: FetchOptions['method']
    usagePlanId?: string
  }) => {
    const { apiUser, auth0 } = this.props
    if (!apiUser) {
      console.warn('Cannot delete API key without userId.')
      return
    }

    let url = `${API_USER_URL}/${apiUser.id}/apikey`
    if (keyId) url += `/${keyId}`
    if (usagePlanId) url += `?usagePlanId=${usagePlanId}`
    const result = await secureFetch(url, auth0, method)
    if (result.status === 'error') {
      return window.alert(result.message)
    }
    this._updateUser(result.data)
  }

  // FIXME: We need to fix updating the API user in parent components. Perhaps
  // we need some global state management: https://github.com/vercel/next.js/tree/canary/examples/with-redux
  // Or, we should move this key request function higher up.
  _updateUser = (apiUser: ApiUser) => this.setState({ apiUser })

  render() {
    const { isAdmin } = this.props
    const { apiUser } = this.state
    const { apiKeys } = apiUser
    if (!apiKeys) return null

    const keyLimitReached = !isAdmin && apiKeys.length >= API_KEY_LIMIT
    return (
      <div className="mb-5">
        <ListGroup>
          {apiKeys.length > 0 ? (
            apiKeys.map((apiKey) => {
              return (
                <ApiKeyRow
                  apiKey={apiKey}
                  deleteKey={this._deleteKey}
                  isAdmin={isAdmin}
                  key={apiKey.keyId}
                />
              )
            })
          ) : (
            <p>No API keys found.</p>
          )}
        </ListGroup>
        <div className="mt-3">
          <Button disabled={keyLimitReached} onClick={this.handleCreateKey}>
            Create new key
          </Button>
          {keyLimitReached ? (
            <Alert className="mt-3" variant="warning">
              <Alert.Heading>API Key Limit Reached!</Alert.Heading>
              <p>
                Default API key limit reached (max = {API_KEY_LIMIT})! Cannot
                create more keys for your account.
              </p>
              <EmailForApiKeyMessage />
            </Alert>
          ) : null}
        </div>
      </div>
    )
  }
}

export default withAuth0(ApiKeyList)
