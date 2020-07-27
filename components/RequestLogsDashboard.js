import moment from 'moment'
import { Component } from 'react'
import { Button } from 'react-bootstrap'
import { withAuth } from 'use-auth0-hooks'

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
    const { auth } = this.props
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
          <a
            className='push'
            target='_blank'
            rel='noopener noreferrer'
            href='https://console.aws.amazon.com/apigateway/home?region=us-east-1#/usage-plans'
          >
            Open AWS console
          </a>
        </div>
        {
          hasLogs && (
            <div>
              {logsError && <pre>Error loading logs: {logsError}</pre>}
              <p>All requests made over the last 30 days</p>
              {logs.map((plan, planIndex) => {
                // If there are no API key IDs for the usage plan, show nothing.
                const keyIds = Object.keys(plan.items)
                if (keyIds.length === 0) return null
                // Render the # of requests per API key on each day beginning
                // with the start date.
                const startDate = moment(plan.startDate)
                // TODO: Move this into its own component if the API key usage
                // becomes much larger.
                return (
                  <div className='usage-list'>
                    <h3>API Key: {keyIds[0]}</h3>
                    <ul key={planIndex}>
                      {plan.items[keyIds[0]].map((item, itemIndex) => {
                        if (itemIndex > 0) startDate.add(1, 'days')
                        return (
                          <li key={itemIndex}>
                            {startDate.format('MMM D')}: {item[0]} requests
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
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
