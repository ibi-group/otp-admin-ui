import { Button } from 'react-bootstrap'
import useSWR, { mutate } from 'swr'
import { useAuth } from 'use-auth0-hooks'

import ApiKeyUsage from './ApiKeyUsage'
import FetchMessage from './FetchMessage'
import { AUTH0_SCOPE } from '../util/constants'

const REQUEST_LOGS_URL = `${process.env.API_BASE_URL}/api/secure/logs`

function RequestLogsDashboard ({ isAdmin }) {
  const auth = useAuth({
    audience: process.env.AUTH0_AUDIENCE,
    scope: AUTH0_SCOPE
  })
  const result = useSWR(REQUEST_LOGS_URL)
  console.log(result.data)
  if (!auth.isAuthenticated) return null
  return (
    <div>
      <h2>Request Log Summary</h2>
      <div className='controls'>
        <Button className='mr-3' onClick={() => mutate(REQUEST_LOGS_URL)}>
          Fetch logs
        </Button>
        <FetchMessage result={result} />
        {isAdmin &&
          <a
            className='push'
            target='_blank'
            rel='noopener noreferrer'
            href='https://console.aws.amazon.com/apigateway/home?region=us-east-1#/usage-plans'
          >
            Open AWS console
          </a>
        }
      </div>
      <ApiKeyUsage
        isAdmin={isAdmin}
        logs={result.data}
        logsError={result.error} />
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

        a {
          text-decoration: none;
          color: blue;
        }

        a:hover {
          opacity: 0.6;
        }
      `}
      </style>
    </div>
  )
}

export default RequestLogsDashboard
