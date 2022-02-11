import React, { Component } from 'react'
import { withAuth0, WithAuth0Props } from '@auth0/auth0-react'
import clone from 'clone'
import { Button } from 'react-bootstrap'

import { Plan } from '../types/graph'

import ApiKeyUsageChart from './ApiKeyUsageChart'

type Props = {
  isAdmin?: boolean
  logs?: Plan[]
  logsError?: string
  summaryView?: boolean
} & WithAuth0Props

type State = {
  aggregatedView?: boolean
}

/**
 * Shows API Key usage for all API Gateway usage plans found in logs prop.
 */
class ApiKeyUsage extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      aggregatedView: props.summaryView
    }
  }

  _getEmptyLogsMessage = () => (
    <p className="lead text-center">No usage logs found</p>
  )

  handleToggleAggregatedView = () => {
    this.setState({ aggregatedView: !this.state.aggregatedView })
    // TODO: add query param?
  }

  render() {
    const { isAdmin, logs, logsError, summaryView } = this.props
    const { aggregatedView } = this.state
    const hasLogs = logs && logs.length > 0
    if (!hasLogs) {
      return this._getEmptyLogsMessage()
    }
    let charts: JSX.Element[] | JSX.Element[] | null = null
    if (aggregatedView) {
      // Collect all per key request counts into single plan.
      let plan: Plan | null = null
      logs.forEach((p: Plan, i: number) => {
        if (!plan) plan = clone(p)
        else plan.result.items = { ...plan.result.items, ...p.result.items }
      })
      // @ts-ignore bad union type?
      charts = <ApiKeyUsageChart aggregatedView isAdmin={isAdmin} plan={plan} />
    } else {
      // @ts-ignore bad union type?
      charts = logs
        .map((plan: Plan, planIndex: number) => {
          // If there are no API key IDs for the usage plan, show nothing.
          const keyIds = Object.keys(plan.result.items)
          if (keyIds.length === 0) return null
          return keyIds.map((id) => (
            <ApiKeyUsageChart id={id} isAdmin={isAdmin} key={id} plan={plan} />
          ))
        })
        // Filter out any null charts
        .filter((c) => c)
    }
    return (
      <div className="mt-3">
        {logsError && <pre>Error loading logs: {logsError}</pre>}
        <p>All requests made over the last 30 days</p>
        <div>
          {isAdmin && !summaryView && (
            <Button className="mb-3" onClick={this.handleToggleAggregatedView}>
              Show {aggregatedView ? 'individual keys' : 'aggregated view'}
            </Button>
          )}
        </div>
        <div className="key-charts">
          {charts && charts.length === 0 ? this._getEmptyLogsMessage() : charts}
        </div>
      </div>
    )
  }
}

export default withAuth0(ApiKeyUsage)
