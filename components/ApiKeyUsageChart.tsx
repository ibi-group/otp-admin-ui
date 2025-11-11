import React, { Component } from 'react'
import { withAuth0, WithAuth0Props } from '@auth0/auth0-react'
import { Key } from '@styled-icons/fa-solid/Key'
import clone from 'clone'
import moment from 'moment'
import { Button } from 'react-bootstrap'

import { Requests, Plan, GraphNumberValue } from '../types/graph'

import Chart from './Chart'

export type Props = {
  aggregatedView?: boolean
  id?: string
  isAdmin?: boolean
  plan: Plan | null
} & WithAuth0Props
/**
 * Renders a chart showing API Key usage (requests over time) for a particular
 * API key.
 */
class ApiKeyUsageChart extends Component<Props> {
  _renderChartTitle = () => {
    const { aggregatedView, isAdmin } = this.props
    // Do not show chart title for non-admin users.
    if (!isAdmin) return null
    // TODO: Right now, the "unknown" keys are the ones we've created outside
    // the otp-admin-ui flow (i.e., we created them manually in the AWS
    // console and used them in otp-react-redux). I think it might be more
    // appropriate to handle this on the server side (e.g., filtering out keys
    // if they don't match user accounts), but that's TBD.
    const defaultTitle = aggregatedView
      ? 'Total Requests'
      : 'Unknown Application'
    const defaultUser = aggregatedView ? 'All users' : '[no user]'
    const apiUser = this._getApiUser()
    return (
      <>
        <h3>
          {apiUser ? (
            <>
              {apiUser.appName} (
              <a
                href={apiUser.appUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                link
              </a>
              )
            </>
          ) : (
            defaultTitle
          )}
        </h3>
        <p>{apiUser ? `by ${apiUser.email}` : defaultUser}</p>
      </>
    )
  }

  _getRequestData = () => {
    const { aggregatedView, id, plan } = this.props
    if (!plan) return
    let requestData: Requests | undefined
    // Track keys encountered to ensure we're not duplicating keys that are
    // assigned to more than one usage plan.
    const keysEncountered: string[] = []
    if (aggregatedView) {
      // Sum up all requests for keys.
      const keyIds = Object.keys(plan.result.items)
      keyIds.forEach((key, i) => {
        if (plan.result.items[key] && keysEncountered.indexOf(key) === -1) {
          keysEncountered.push(key)
          const requestsForKey = clone(plan.result.items[key])
          if (!requestData) {
            requestData = requestsForKey
          } else {
            // @ts-expect-error assuming array length is 2
            requestData = requestData.map((value, valIndex) => {
              // @ts-expect-error convert array to object
              const copy = { ...value }
              // @ts-expect-error assuming array length is >0
              copy[0] += requestsForKey[valIndex][0]
              return copy
            })
          }
        }
      })
    } else if (id) {
      requestData = plan.result.items[id]
    }
    return requestData
  }

  _renderKeyInfo = () => {
    const { id } = this.props
    if (!id) return null
    const apiUser = this._getApiUser()
    const keyName = apiUser?.apiKeys?.find(
      (key: { keyId: string }) => key.keyId === id
    )?.name
    return (
      <p>
        <span>
          <Key size={20} style={{ marginRight: 10 }} />
          {keyName ? `${keyName} (${id})` : id}
        </span>
        {apiUser && (
          <small>
            <Button onClick={this.handleViewApiKey} size="sm" variant="link">
              click to view key
            </Button>
          </small>
        )}
      </p>
    )
  }

  _getApiUser = () =>
    this.props.aggregatedView
      ? null
      : (this.props.id && this.props?.plan?.apiUsers?.[this.props.id]) || null

  handleViewApiKey = () => {
    const { id, plan } = this.props
    if (!id || !plan) return
    const userForKey = plan.apiUsers?.[id]
    const key = userForKey?.apiKeys?.find(
      (key: { keyId: string }) => key.keyId === id
    )

    if (!key) {
      window.alert('Could not find API key!')
      return
    }

    window.prompt('Copy and paste the API key to use in requests', key.value)
  }

  render() {
    const { aggregatedView, id, plan } = this.props
    const startDate = moment(plan?.result.startDate)
    if (!aggregatedView && !id) {
      console.warn('Cannot show non-aggregated view if id prop is undefined.')
      return null
    }
    // Render the # of requests per API key on each day beginning
    // with the start date.
    const requestData = this._getRequestData()
    // Format request data for chart component.
    const CHART_DATA: GraphNumberValue[] =
      requestData?.map((value, i) => {
        if (i > 0) startDate.add(1, 'days')
        // @ts-ignore TYPESCRIPT TODO: what is going on here?
        return { x: startDate.valueOf(), y: value[0] }
      }) || []
    return (
      <Chart
        data={CHART_DATA}
        entityType="requests"
        title={
          <>
            {this._renderChartTitle()}
            {this._renderKeyInfo()}
          </>
        }
      />
    )
  }
}

export default withAuth0(ApiKeyUsageChart)
