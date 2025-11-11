import React, { Component } from 'react'

import Chart from './Chart'

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
  _getSeries = (series: keyof StatsRecord) =>
    (this.props.records || []).map((value) => ({
      x: value.date.valueOf(),
      y: value[series] || 0
    }))

  render() {
    const { entityType, records, series } = this.props
    if (records.length === 0) return null

    // Render the given series on each day beginning with the start date.
    const data = this._getSeries(series)
    return <Chart data={data} entityType={entityType} title={entityType} />
  }
}

export default DailyStatsChart
