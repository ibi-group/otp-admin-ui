import React, { Component } from 'react'

import Chart from './Chart'
import { GraphNumberValue } from '../types/graph'

export type StatsRecord = {
  date: number
  otpUsers?: number
  otpUsersWithTripRequests?: number
  tripRequests?: number
}

export type Props = {
  entityType: string
  records: StatsRecord[]
  series: keyof StatsRecord
}
/**
 * Renders a chart showing API Key usage (requests over time) for a particular
 * API key.
 */
class DailyStatsChart extends Component<Props> {
  _getSeries = (series: keyof StatsRecord): GraphNumberValue[] =>
    (this.props.records || []).map((value) => ({
      x: value.date.valueOf(),
      y: value[series] || 0
    }))

  render(): JSX.Element | null {
    const { entityType, records, series } = this.props
    if (!records.length) return null

    // Render the given series on each day beginning with the start date.
    const data = this._getSeries(series)
    return <Chart data={data} entityType={entityType} title={entityType} />
  }
}

export default DailyStatsChart
