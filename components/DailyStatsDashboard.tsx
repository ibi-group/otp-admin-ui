import React from 'react'
import { Button } from 'react-bootstrap'
import { Sync } from '@styled-icons/fa-solid/Sync'
import { useAuth0 } from '@auth0/auth0-react'
import useSWR, { mutate } from 'swr'

import DailyStatsChart from './DailyStatsChart'
import FetchMessage from './FetchMessage'

const DAILY_STATS_URL = `${process.env.API_BASE_URL}/api/secure/dailystats`

function DailyStatsDashboard(): JSX.Element | null {
  const auth = useAuth0()
  const result = useSWR(DAILY_STATS_URL)
  if (!auth.isAuthenticated) return null
  const { data: swrData = {}, isValidating } = result
  const { data } = swrData
  return (
    <div>
      <h2>Daily Stats</h2>
      <div className="controls">
        <Button
          className="mr-3"
          disabled={isValidating}
          onClick={() => mutate(DAILY_STATS_URL)}
        >
          <Sync size={20} />
        </Button>
        <FetchMessage result={result} />
      </div>

      {(!isValidating && (
        <DailyStatsChart records={data?.data || []} />
      ))}
      <style jsx>
        {`
          .controls {
            align-items: center;
            display: flex;
          }
          .push {
            margin-left: auto;
          }
          .usage-list {
            display: inline-block;
            margin: 5px;
          }

          ul {
            padding: 0;
          }

          li {
            list-style: none;
            margin: 5px 0;
          }
        `}
      </style>
    </div>
  )
}

export default DailyStatsDashboard
