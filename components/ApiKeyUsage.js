import moment from 'moment'
import { Component } from 'react'
import { Button } from 'react-bootstrap'
import { withAuth } from 'use-auth0-hooks'

import { secureFetch } from '../util/middleware'
import { API_USER_URL } from '../util/constants'

/**
 * Shows API Key usage for a particular API Gateway usage plan.
 * @extends Component
 */
class ApiKeyUsage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      logs: null,
      logsError: null
    }
  }

  /**
   * Send a request that enables a user to view the API Key value.
   */
  _viewApiKey = () => {
    const {auth, plan} = this.props
    const { accessToken } = auth
    if (!accessToken) {
      return
    }
    const keyIds = Object.keys(plan.items)
    secureFetch(`${API_USER_URL}/apikey?apiKeyId=${keyIds[0]}`, accessToken)
      .then(result => {
        window.prompt('Copy and paste your API key to use in requests', result.data.value)
      })
  }

  render () {
    const { plan } = this.props
    // If there are no API key IDs for the usage plan, show nothing.
    const keyIds = Object.keys(plan.items)
    if (keyIds.length === 0) return null
    // Render the # of requests per API key on each day beginning
    // with the start date.
    const startDate = moment(plan.startDate)
    return (
      <div className='usage-list'>
        <h3>
          API Key: {keyIds[0]}{' '}
          <small>
            <Button
              onClick={this._viewApiKey}
              size='sm'
              variant='link'
            >
              view key
            </Button>
          </small>
        </h3>
        <ul>
          {plan.items[keyIds[0]].map((item, itemIndex) => {
            if (itemIndex > 0) startDate.add(1, 'days')
            return (
              <li key={itemIndex}>
                {startDate.format('MMM D')}: {item[0]} requests
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default withAuth(ApiKeyUsage, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: process.env.AUTH0_SCOPE
})
