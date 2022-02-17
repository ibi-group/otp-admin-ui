import React, { Component } from 'react'
import { withAuth0, WithAuth0Props } from '@auth0/auth0-react'
import { Key } from '@styled-icons/fa-solid/Key'
import clone from 'clone'
import moment from 'moment'
import { Button } from 'react-bootstrap'
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalRectSeries,
  RectSeriesPoint,
  RVValueEventHandler
} from 'react-vis'

import { GraphValue, Requests, Plan } from '../types/graph'

export type Props = {
  aggregatedView?: boolean
  isAdmin?: boolean
  id?: string
  plan: Plan | null
} & WithAuth0Props
/**
 * Renders a chart showing API Key usage (requests over time) for a particular
 * API key.
 */
class ApiKeyUsageChart extends Component<Props, { value: GraphValue | null }> {
  constructor(props: Props) {
    super(props)
    this.state = {
      value: null
    }
  }

  handleClearValue = () => {
    this.setState({ value: null })
  }

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

  handleSetValue: RVValueEventHandler<RectSeriesPoint> = (
    data: RectSeriesPoint
  ) => {
    this.setState({ value: data })
  }

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
    const { value } = this.state
    const ONE_DAY_MILLIS = 86400000
    const startDate = moment(plan?.result.startDate)
    if (!aggregatedView && !id) {
      console.warn('Cannot show non-aggregated view if id prop is undefined.')
      return null
    }
    // Render the # of requests per API key on each day beginning
    // with the start date.
    const requestData = this._getRequestData()
    const timestamp = startDate.valueOf()
    let rangeMax = 0
    // Format request data for chart component.
    const CHART_DATA: RectSeriesPoint[] =
      requestData?.map((value, i) => {
        if (i > 0) startDate.add(1, 'days')
        const begin = startDate.valueOf()
        // @ts-ignore TYPESCRIPT TODO: what is going on here?
        const y = value[0]
        const end = begin + ONE_DAY_MILLIS
        if (y > rangeMax) rangeMax = y
        return { x: end, x0: begin, y, y0: 0 }
      }) || []
    const maxY = rangeMax === 0 ? 10 : Math.ceil(rangeMax / 10) * 10
    return (
      <div className="usage-list" style={{ display: 'inline-block' }}>
        {this._renderChartTitle()}
        {this._renderKeyInfo()}
        <XYPlot
          height={300}
          width={600} // Round up max y value to the nearest 10
          xDomain={[
            timestamp - 2 * ONE_DAY_MILLIS,
            timestamp + 30 * ONE_DAY_MILLIS
          ]}
          yDomain={[0, maxY]}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickFormat={(d) => moment(d).format('MMM DD')} />
          <YAxis />
          <VerticalRectSeries
            data={CHART_DATA}
            onValueMouseOut={this.handleClearValue} // Update value on mouse over/out.
            onValueMouseOver={this.handleSetValue}
            style={{ stroke: '#fff' }}
          />
        </XYPlot>
        <p style={{ textAlign: 'center' }}>
          {value ? (
            <>
              {moment(value.x).format('MMM DD')}: {value.y} requests
            </>
          ) : (
            <>[Hover over bars to see values.]</>
          )}
        </p>
      </div>
    )
  }
}

export default withAuth0(ApiKeyUsageChart)
