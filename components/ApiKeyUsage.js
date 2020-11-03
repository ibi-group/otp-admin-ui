import clone from 'clone'
import { Component } from 'react'
import { Button } from 'react-bootstrap'
import { withAuth } from 'use-auth0-hooks'

import ApiKeyUsageChart from './ApiKeyUsageChart'

/**
 * Shows API Key usage for all API Gateway usage plans found in logs prop.
 */
class ApiKeyUsage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      aggregatedView: props.summaryView
    }
  }

  _getEmptyLogsMessage = () => <p className='lead text-center'>No usage logs found</p>

  _toggleAggregatedView = () => {
    this.setState({aggregatedView: !this.state.aggregatedView})
    // TODO: add query param?
  }

  render () {
    const { isAdmin, logs, logsError, summaryView } = this.props
    const { aggregatedView } = this.state
    const hasLogs = logs && logs.length > 0
    if (!hasLogs) {
      return this._getEmptyLogsMessage()
    }
    let charts
    if (aggregatedView) {
      // Collect all per key request counts into single plan.
      let plan
      logs.forEach((p, i) => {
        if (!plan) plan = clone(p)
        else plan.result.items = {...plan.result.items, ...p.result.items}
      })
      charts = (
        <ApiKeyUsageChart
          aggregatedView
          isAdmin={isAdmin}
          plan={plan} />
      )
    } else {
      charts = (
        logs
          .map((plan, planIndex) => {
            // If there are no API key IDs for the usage plan, show nothing.
            const keyIds = Object.keys(plan.result.items)
            if (keyIds.length === 0) return null
            return keyIds.map(id => (
              <ApiKeyUsageChart
                key={id}
                id={id}
                isAdmin={isAdmin}
                plan={plan} />
            ))
          })
          // Filter out any null charts
          .filter(c => c)
      )
    }
    return (
      <div className='mt-3'>
        {logsError && <pre>Error loading logs: {logsError}</pre>}
        <p>All requests made over the last 30 days</p>
        <div>
          {isAdmin && !summaryView &&
            <Button className='mb-3' onClick={this._toggleAggregatedView}>
              Show {aggregatedView ? 'individual keys' : 'aggregated view'}
            </Button>
          }
        </div>
        <div className='key-charts'>
          {charts.length === 0
            ? this._getEmptyLogsMessage()
            : charts
          }
        </div>
      </div>
    )
  }
}

export default withAuth(ApiKeyUsage, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: process.env.AUTH0_SCOPE
})
