import React, { Component, ReactNode } from 'react'
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

import { GraphNumberValue, GraphValue } from '../types/graph'

export type Props = {
  data: GraphNumberValue[]
  entityType: string
  title: ReactNode
}
/**
 * Renders a chart with presets and default behaviors (e.g. hover over data to show value).
 */
class Chart extends Component<Props, { value: GraphValue | null }> {
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
   * Extract the ranges of the data provided.
   */
  _getBounds = () => {
    const ONE_DAY_MILLIS = 86400000
    let rangeMax = 0
    let startDateMillis = Number.MAX_VALUE
    let endDateMillis = 0

    const chartData = this.props.data.map(({ x, y }): RectSeriesPoint => {
      // End the x range one millisecond before so that the bar
      // doesn't bleed into the next day and the chart doesn't associate the bar with the next day.
      const end = x + ONE_DAY_MILLIS - 1
      if (y > rangeMax) rangeMax = y
      if (startDateMillis > x) startDateMillis = x
      if (endDateMillis < end) endDateMillis = end
      return { x: end, x0: x, y, y0: 0 }
    })

    return {
      chartData,
      endDateMillis,
      rangeMax,
      startDateMillis
    }
  }

  handleSetValue: RVValueEventHandler<RectSeriesPoint> = (
    data: RectSeriesPoint
  ) => {
    this.setState({ value: data })
  }

  render() {
    const { data, entityType, title } = this.props
    if (data.length === 0) return null

    const days = 30
    const { value } = this.state
    const ONE_DAY_MILLIS = 86400000

    const { chartData, endDateMillis, rangeMax, startDateMillis } =
      this._getBounds()

    const renderedTitle = typeof title === 'string' ? <h3>{title}</h3> : title

    // Round up max y value to the nearest 10
    const maxY = rangeMax === 0 ? 10 : Math.ceil(rangeMax / 10) * 10
    return (
      <div className="usage-list" style={{ display: 'inline-block' }}>
        {renderedTitle}
        <XYPlot
          height={300}
          style={{ overflow: 'initial' }}
          width={600}
          xDomain={[
            startDateMillis,
            // Display at least 30 days if data spans over less than 30 days.
            Math.max(startDateMillis + days * ONE_DAY_MILLIS, endDateMillis)
          ]}
          yDomain={[0, maxY]}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickFormat={(d) => moment(d).format('MMM DD')} />
          <YAxis />
          <VerticalRectSeries
            data={chartData}
            onValueMouseOut={this.handleClearValue} // Update value on mouse over/out.
            onValueMouseOver={this.handleSetValue}
            style={{ stroke: '#fff' }}
          />
        </XYPlot>
        <p style={{ textAlign: 'center' }}>
          {value ? (
            <>
              {moment(value.x).format('MMM DD')}: {value.y} {entityType}
            </>
          ) : (
            <>[Hover over bars to see values.]</>
          )}
        </p>
      </div>
    )
  }
}

export default Chart
