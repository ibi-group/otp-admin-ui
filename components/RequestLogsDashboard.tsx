import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { ExternalLinkAlt } from '@styled-icons/fa-solid/ExternalLinkAlt'
import { Sync } from '@styled-icons/fa-solid/Sync'
import { Button } from 'react-bootstrap'
import useSWR, { mutate } from 'swr'

import { Plan } from '../types/graph'

import ApiKeyUsage from './ApiKeyUsage'
import FetchMessage from './FetchMessage'

const REQUEST_LOGS_URL = `${process.env.API_BASE_URL}/api/secure/logs`
const USAGE_ID = process.env.USAGE_ID || null

type Props = {
  isAdmin?: boolean
  summaryView?: boolean
}

function RequestLogsDashboard({
  isAdmin,
  summaryView
}: Props): JSX.Element | null {
  const auth = useAuth0()
  const result = useSWR(REQUEST_LOGS_URL)
  const { data: swrData = {} } = result
  const { isValidating } = swrData
  if (!auth.isAuthenticated) return null
  return (
    <div>
      {summaryView ? null : (
        <>
          <h2>Request Log Summary</h2>
          {isAdmin && (
            <p>
              <a
                className="push"
                href="https://console.aws.amazon.com/apigateway/home?region=us-east-1#/usage-plans"
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLinkAlt className="mr-1 mb-1" size={20} />
                Open AWS console
              </a>
            </p>
          )}
          <div className="controls">
            <Button
              className="mr-3"
              disabled={isValidating}
              onClick={() => mutate(REQUEST_LOGS_URL)}
            >
              <Sync size={20} />
            </Button>
            <FetchMessage result={result} />
          </div>
        </>
      )}
      <ApiKeyUsage
        isAdmin={isAdmin}
        logs={result.data?.data?.filter(
          (l: Plan) => USAGE_ID === null || l.result.usagePlanId === USAGE_ID
        )}
        logsError={result.error}
        summaryView={summaryView}
      />
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

export default RequestLogsDashboard
