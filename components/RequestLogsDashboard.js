import moment from 'moment'
import { Component } from 'react'
import { Button } from 'react-bootstrap'
import { withAuth } from 'use-auth0-hooks'

import ApiKeyUsage from './ApiKeyUsage'
import { secureFetch } from '../util/middleware'

class RequestLogsDashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      logs: null,
      logsError: null
    }
  }

  handleFetchLogs = async (force = false) => {
    const { logs, logsError } = this.state
    if (!force && (logs || logsError)) {
      return
    }

    const { accessToken } = this.props.auth
    if (!accessToken) {
      return
    }
    const fetchedLogs = await secureFetch(`${process.env.API_BASE_URL}/api/secure/logs`, accessToken)

    if (fetchedLogs.status === 'success') {
      this.setState({
        logs: fetchedLogs.data,
        fetchMessage: `Updated at ${moment().format('h:mm:ss a')}`
      })
    } else {
      this.setState({
        fetchMessage: `Failed to update!`
      })
    }
  }

  async componentDidMount () {
    await this.handleFetchLogs()
  }

  async componentDidUpdate () {
    await this.handleFetchLogs()
  }

  render () {
    const { auth, isAdmin } = this.props
    const { logs, logsError, fetchMessage } = this.state
    if (!auth.isAuthenticated) return null
    const hasLogs = logs && logs.length > 0
    return (
      <div>
        <h2>Request Log Summary</h2>
        <div className='controls'>
          <Button onClick={this.handleFetchLogs}>
            Fetch logs
          </Button>
          {fetchMessage && <span className='fetchMessage'>{fetchMessage}</span>}
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
        {
          hasLogs && (
            <div>
              {logsError && <pre>Error loading logs: {logsError}</pre>}
              <p>All requests made over the last 30 days</p>
              {logs.map((plan, planIndex) => {
                return <ApiKeyUsage key={planIndex} plan={plan} />
              })
              }
            </div>
          )
        }
        <style jsx>{`
          .controls {
            align-items: center;
            display: flex;
          }
          .fetchMessage {
            margin-left: 5px;
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
}

export default withAuth(RequestLogsDashboard, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: process.env.AUTH0_SCOPE
})
