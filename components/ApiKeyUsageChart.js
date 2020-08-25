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
 * Shows API Key usage for a particular API Gateway usage plan.
 * @extends Component
 */
class ApiKeyUsage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: null
    }
  }

  _clearValue = (data, event) => {
    this.setState({value: null})
  }

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
    const { date, id, plan } = this.props
    const { value } = this.state
    const ONE_DAY = 86400000
    const startDate = moment(date)
    const userForKey = plan.apiUsers[id]
    // Render the # of requests per API key on each day beginning
    // with the start date.
    const requestsForKey = plan.result.items[id]
    const timestamp = startDate.valueOf()
    let rangeMax = 0
    const DATA = requestsForKey
      .map((value, i) => {
        if (i > 0) startDate.add(1, 'days')
        const begin = startDate.valueOf()
        const y = value[0]
        const end = begin + ONE_DAY
        if (y > rangeMax) rangeMax = y
        return ({x0: begin, x: end, y})
      })
    const maxY = rangeMax === 0 ? 10 : Math.ceil(rangeMax / 10) * 10
    return (
      <div className='usage-list'>
        <h3>
          {id}
          {userForKey &&
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
        </h3>
        <p>
          {userForKey ? userForKey.email : '[No app found for key]'}
        </p>
        <XYPlot
          xDomain={[timestamp - 2 * ONE_DAY, timestamp + 30 * ONE_DAY]}
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
            data={DATA}
            onValueMouseOut={this._clearValue}
            onValueMouseOver={this._setValue}
            style={{stroke: '#fff'}} />
        </XYPlot>
        <p>
          {value
            ? <>
              {moment(value.x).format('MMM DD')}: {value.y} requests
            </>
            : <>
              [Hover over individual bars to see values.]
            </>
          }
        </p>
      </div>
    )
  }
}

export default withAuth(ApiKeyUsage, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: process.env.AUTH0_SCOPE
})
