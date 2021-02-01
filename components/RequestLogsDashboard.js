import { useAuth0 } from '@auth0/auth0-react'
import { ExternalLinkAlt } from '@styled-icons/fa-solid/ExternalLinkAlt'
import { Sync } from '@styled-icons/fa-solid/Sync'
import { Button } from 'react-bootstrap'
import useSWR, { mutate } from 'swr'

import ApiKeyUsage from './ApiKeyUsage'
import FetchMessage from './FetchMessage'
import { AUTH0_SCOPE } from '../util/constants'

const REQUEST_LOGS_URL = `${process.env.API_BASE_URL}/api/secure/logs`

function RequestLogsDashboard ({ isAdmin, summaryView }) {
  const auth = useAuth0({
    audience: process.env.AUTH0_AUDIENCE,
    scope: AUTH0_SCOPE
  })
  const result = useSWR(REQUEST_LOGS_URL)
  const { data: swrData = {} } = result
  const { isValidating } = swrData
  if (!auth.isAuthenticated) return null
  return (
    <div>
      {summaryView
        ? null
        : <>
          <h2>Request Log Summary</h2>
          {isAdmin &&
            <p>
              <a
                className='push'
                target='_blank'
                rel='noopener noreferrer'
                href='https://console.aws.amazon.com/apigateway/home?region=us-east-1#/usage-plans'
              >
                <ExternalLinkAlt className='mr-1 mb-1' size={20} />Open AWS console
              </a>
            </p>
          }
          <div className='controls'>
            <Button
              disabled={isValidating}
              className='mr-3'
              onClick={() => mutate(REQUEST_LOGS_URL)}
            >
              <Sync size={20} />
            </Button>
            <FetchMessage result={result} />
          </div>
        </>
      }
      <ApiKeyUsage
        isAdmin={isAdmin}
        logs={result.data}
        logsError={result.error}
        summaryView={summaryView} />
      <style jsx>{`
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
