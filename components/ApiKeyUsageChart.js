import { Key } from '@styled-icons/fa-solid/Key'
import moment from 'moment'
import { Component } from 'react'
import { Button } from 'react-bootstrap'
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalRectSeries
} from 'react-vis'
import { withAuth } from 'use-auth0-hooks'

/**
 * Renders a chart showing API Key usage (requests over time) for a particular
 * API key.
 */
class ApiKeyUsageChart extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: null
    }
  }

  _clearValue = (data, event) => {
    this.setState({value: null})
  }

  _getChartTitle = () => {
    const { aggregatedView, isAdmin } = this.props
    // Do not show chart title for non-admin users.
    if (!isAdmin) return null
    const defaultTitle = aggregatedView ? 'Total Requests' : 'Unknown Application'
    const defaultUser = aggregatedView ? 'All users' : '[no user]'
    const apiUser = this._getApiUser()
    return (
      <>
        <h3>
          {apiUser
            ? <>
              {apiUser.appName}{' '}
              (<a
                target='_blank'
                rel='noopener noreferrer'
                href={apiUser.appUrl}>link</a>)
            </>
            : defaultTitle
          }
        </h3>
        <p>
          {apiUser
            ? `by ${apiUser.email}`
            : defaultUser
          }
        </p>
      </>
    )
  }

  _getRequestData = () => {
    const { aggregatedView, id, plan } = this.props
    let requestData
    // Track keys encountered to ensure we're not duplicating keys that are
    // assigned to more than one usage plan.
    const keysEncountered = []
    if (aggregatedView) {
      // Sum up all requests for keys.
      const keyIds = Object.keys(plan.result.items)
      keyIds.forEach((key, i) => {
        if (plan.result.items[key] && keysEncountered.indexOf(key) === -1) {
          keysEncountered.push(key)
          const requestsForKey = [...plan.result.items[key]]
          if (!requestData) {
            requestData = requestsForKey
          } else {
            requestData = requestData.map((value, valIndex) => {
              const copy = {...value}
              copy[0] += requestsForKey[valIndex][0]
              return copy
            })
          }
        }
      })
    } else {
      requestData = plan.result.items[id]
    }
    return requestData
  }

  _getApiUser = () => this.props.aggregatedView
    ? null
    : this.props.plan.apiUsers[this.props.id]

  _setValue = (data, event) => {
    this.setState({value: data})
  }

  _viewApiKey = () => {
    const { id, plan } = this.props
    const userForKey = plan.apiUsers[id]
    const key = userForKey.apiKeys.find(key => key.keyId === id)
    window.prompt('Copy and paste the API key to use in requests', key.value)
  }

  render () {
    const { aggregatedView, id, plan } = this.props
    const { value } = this.state
    const ONE_DAY_MILLIS = 86400000
    const startDate = moment(plan.result.startDate)
    if (!aggregatedView && !id) {
      console.warn('Cannot show non-aggregated view if id prop is undefined.')
      return null
    }
    const apiUser = this._getApiUser()
    // Render the # of requests per API key on each day beginning
    // with the start date.
    const requestData = this._getRequestData()
    const timestamp = startDate.valueOf()
    let rangeMax = 0
    // Format request data for chart component.
    const CHART_DATA = requestData
      .map((value, i) => {
        if (i > 0) startDate.add(1, 'days')
        const begin = startDate.valueOf()
        const y = value[0]
        const end = begin + ONE_DAY_MILLIS
        if (y > rangeMax) rangeMax = y
        return ({x0: begin, x: end, y})
      })
    const maxY = rangeMax === 0 ? 10 : Math.ceil(rangeMax / 10) * 10
    return (
      <div className='usage-list' style={{display: 'inline-block'}}>
        {this._getChartTitle()}
        <p>
          {id && <span><Key size={20} style={{marginRight: 10}} />{id}</span>}
          {apiUser &&
            <small>
              <Button
                onClick={this._viewApiKey}
                size='sm'
                variant='link'
              >
                click to view key
              </Button>
            </small>
          }
        </p>
        <XYPlot
          xDomain={[timestamp - 2 * ONE_DAY_MILLIS, timestamp + 30 * ONE_DAY_MILLIS]}
          // Round up max y value to the nearest 10
          yDomain={[0, maxY]}
          xType='time'
          width={300}
          height={300}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <VerticalRectSeries
            data={CHART_DATA}
            // Update value on mouse over/out.
            onValueMouseOut={this._clearValue}
            onValueMouseOver={this._setValue}
            style={{stroke: '#fff'}} />
        </XYPlot>
        <p style={{textAlign: 'center'}}>
          {value
            ? <>
              {moment(value.x).format('MMM DD')}: {value.y} requests
            </>
            : <>
              [Hover over bars to see values.]
            </>
          }
        </p>
      </div>
    )
  }
}

export default withAuth(ApiKeyUsageChart, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: process.env.AUTH0_SCOPE
})
