import { withAuth0 } from '@auth0/auth0-react'
import { Component } from 'react'
import { Button, ListGroup } from 'react-bootstrap'

import ApiKeyRow from './ApiKeyRow'
import { secureFetchHandleErrors } from '../util/middleware'
import { API_USER_URL } from '../util/constants'

// Max keys that an API user is allowed to create for themselves (an admin can
// create more)
const API_KEY_LIMIT = 2

/**
 * Shows a list of API keys with management features (create, delete) for a
 * particular ApiUser.
 */
class ApiKeyList extends Component {
  constructor (props) {
    super(props)
    // FIXME: Come up with a better way to update user on API key create/delete.
    this.state = {
      apiUser: props.apiUser
    }
  }

  _createKey = () => {
    const {isAdmin} = this.props
    let usagePlanId
    if (isAdmin) {
      // If admin is creating API key, allow them to provide a usage plan ID.
      usagePlanId = window.prompt('Please provide a usage plan ID for the new key (or leave empty to use system default).')
      // If user presses cancel, skip create key request.
      if (usagePlanId === null) return
    }
    this._makeKeyRequest({method: 'post', usagePlanId})
  }

  _deleteKey = (apiKey) => this._makeKeyRequest({method: 'delete', keyId: apiKey.keyId})

  _makeKeyRequest = async ({method, keyId, usagePlanId}) => {
    const { apiUser, auth0 } = this.props
    if (!apiUser) {
      console.warn('Cannot delete API key without userId.')
      return
    }
    const { getAccessTokenSilently } = auth0
    const accessToken = await getAccessTokenSilently()

    let url = `${API_USER_URL}/${apiUser.id}/apikey`
    if (keyId) url += `/${keyId}`
    if (usagePlanId) url += `?usagePlanId=${usagePlanId}`
    const result = await secureFetchHandleErrors(url, accessToken, method)
    if (result.status === 'error') {
      return window.alert(result.message)
    }
    this._updateUser(result.data)
  }

  // FIXME: We need to fix updating the API user in parent components. Perhaps
  // we need some global state management: https://github.com/vercel/next.js/tree/canary/examples/with-redux
  // Or, we should move this key request function higher up.
  _updateUser = (apiUser) => this.setState({apiUser})

  render () {
    const {isAdmin} = this.props
    const {apiUser} = this.state
    const {apiKeys} = apiUser
    const keyLimitReached = !isAdmin && apiKeys.length >= API_KEY_LIMIT
    // FIXME: env variable not working.
    const supportEmail = process.env.SUPPORT_EMAIL || 'help@example.com'
    return (
      <div className='mb-5'>
        <ListGroup>
          {apiKeys.length > 0
            ? apiKeys.map(apiKey => {
              return (
                <ApiKeyRow
                  apiKey={apiKey}
                  isAdmin={isAdmin}
                  deleteKey={this._deleteKey}
                  key={apiKey.keyId} />
              )
            })
            : <p>No API keys found.</p>
          }
        </ListGroup>
        <div className='mt-3'>
          <Button
            disabled={keyLimitReached}
            onClick={this._createKey}>
            Create new key
          </Button>
          {keyLimitReached
            ? <div className='small mt-3 align-middle'>
              <p>
                Default API key limit reached (max = {API_KEY_LIMIT})! Cannot
                create more keys for your account.
              </p>
              <p>
                Email <a target='_blank' href={`mailto:${supportEmail}`}>{supportEmail}</a>{' '}
                to increase your request limits or additional API keys.
              </p>
            </div>
            : null
          }
        </div>
      </div>
    )
  }
}

export default withAuth0(ApiKeyList, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: process.env.AUTH0_SCOPE
})
