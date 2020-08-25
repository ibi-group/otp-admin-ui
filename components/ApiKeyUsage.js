import { Component } from 'react'
import { withAuth } from 'use-auth0-hooks'

import ApiKeyUsageChart from './ApiKeyUsageChart'

/**
 * Shows API Key usage for all API Gateway usage plans found in logs prop.
 * @extends Component
 */
class ApiKeyUsage extends Component {
  render () {
    const { logs, logsError } = this.props
    const hasLogs = logs && logs.length > 0
    if (!hasLogs) {
      return (
        <p>No usage logs found</p>
      )
    }
    return (
      <div>
        {logsError && <pre>Error loading logs: {logsError}</pre>}
        <p>All requests made over the last 30 days</p>
        {logs.map((plan, planIndex) => {
          // If there are no API key IDs for the usage plan, show nothing.
          const keyIds = Object.keys(plan.result.items)
          if (keyIds.length === 0) return null
          return (
            <div className='usage-plan'>
              {keyIds.map(id => <ApiKeyUsageChart key={id} id={id} plan={plan} />)}
            </div>
          )
        })
        }
      </div>
    )
  }
}

export default withAuth(ApiKeyUsage, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: process.env.AUTH0_SCOPE
})
