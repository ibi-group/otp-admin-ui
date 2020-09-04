import useSWR from 'swr'
import { useAuth0 } from '@auth0/auth0-react'

import ApiKeyUsage from './ApiKeyUsage'
import FetchMessage from './FetchMessage'

function RequestLogsDashboard ({ isAdmin }) {
  const auth = useAuth0()
  const { data: logs, error } = useSWR(`${process.env.API_BASE_URL}/api/secure/logs`)
  if (!auth.isAuthenticated) return null
  return (
    <div>
      <h2>Request Log Summary</h2>
      <div className='controls'>
        <FetchMessage data={logs} error={error} />
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
      <ApiKeyUsage isAdmin={isAdmin} logs={logs} logsError={error} />
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
