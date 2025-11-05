import React, { Component } from 'react'
import { withAuth0, WithAuth0Props } from '@auth0/auth0-react'
import moment from 'moment'
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

import { GraphValue } from '../types/graph'

export type StatsRecord = {
  date: number
  otpUsers?: number
  otpUsersWithTripRequests?: number
  tripRequests?: number
}

export type Props = WithAuth0Props & {
  entityType: string
  records: StatsRecord[]
  series: keyof StatsRecord
}
/**
 * Renders a chart showing API Key usage (requests over time) for a particular
 * API key.
 */
class DailyStatsChart extends Component<Props, { value: GraphValue | null }> {
  constructor(props: Props) {
    super(props)
    this.state = {
      value: null
    }
  }

  handleClearValue = () => {
    this.setState({ value: null })
  }

  /**
   * Format series data for chart component.
   */
  _getSeries = (series: keyof StatsRecord) => {
    let rangeMax = 0
    const ONE_DAY_MILLIS = 86400000
    // Format request data for chart component.
    const chartData: RectSeriesPoint[] =
      this.props.records.map((value, i) => {
        const begin = value.date.valueOf()
        const y = value[series] || 0
        const end = begin + ONE_DAY_MILLIS
        if (y > rangeMax) rangeMax = y
        return { x: end, x0: begin, y, y0: 0 }
      }) || []

      return {
        chartData,
        rangeMax,
      }
  }

  handleSetValue: RVValueEventHandler<RectSeriesPoint> = (
    data: RectSeriesPoint
  ) => {
    this.setState({ value: data })
  }

  render() {
    if (this.props.records.length === 0) return null

    const days = 30
    const { value } = this.state
    const ONE_DAY_MILLIS = 86400000
    const startDate = moment(this.props.records[0].date)

    // Render the # of requests per API key on each day beginning
    // with the start date.
    const otpUsersSeries = this._getSeries(this.props.series)
    const timestamp = startDate.valueOf()
    let rangeMax = otpUsersSeries.rangeMax
    const maxY = rangeMax === 0 ? 10 : Math.ceil(rangeMax / 10) * 10
    return (
      <div className="usage-list" style={{ display: 'inline-block' }}>
        <h3>{this.props.entityType}</h3>
        <XYPlot
          height={300}
          style={{ overflow: 'initial' }}
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
            data={otpUsersSeries.chartData}
            onValueMouseOut={this.handleClearValue} // Update value on mouse over/out.
            onValueMouseOver={this.handleSetValue}
            style={{ stroke: '#fff' }}
          />
        </XYPlot>
        <p style={{ textAlign: 'center' }}>
          {value ? (
            <>
              {moment(value.x).format('MMM DD')}: {value.y} {this.props.entityType}
            </>
          ) : (
            <>[Hover over bars to see values.]</>
          )}
        </p>
      </div>
    )
  }
}

export default withAuth0(DailyStatsChart)
