import moment from 'moment'
import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import { withAuth } from 'use-auth0-hooks'

async function secureFetch (url, accessToken, method = 'get', options = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-api-key': process.env.API_KEY
    },
    ...options
  })
  return res.json()
}

class LogSummary extends Component {
  constructor (props) {
    super(props)
    this.state = {
      logs: null,
      logsError: null
    }
    // TODO fix babel plugin so we can use class properties
    // https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
    // https://nextjs.org/docs/advanced-features/customizing-babel-config
    this.handleFetchLogs = this.handleFetchLogs.bind(this)
  }

  async handleFetchLogs (force = false) {
    const { logs, logsError } = this.state
    if (!force && (logs || logsError)) {
      return
    }

    const { accessToken } = this.props.auth
    if (!accessToken) {
      return
    }
    const fetchedLogs = await secureFetch(`${process.env.API_BASE_URL}/api/secure/logs`, accessToken)
    if (fetchedLogs) {
      this.setState({ logs: fetchedLogs })
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
    const { logs, logsError } = this.state
    if (!auth.isAuthenticated) return null
    const hasLogs = logs && logs.length > 0
    return (
      <div>
        <h2>Log Summary</h2>
        <button onClick={this.handleFetchLogs}>Fetch logs 🔄</button>
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://console.aws.amazon.com/apigateway/home?region=us-east-1#/usage-plans'
        >
          Open AWS console
        </a>
        {
          hasLogs && (
            <div>
              {logsError && <pre>Error loading logs: {logsError}</pre>}
              <div>All requests made over the last 30 days</div>
              {logs.map((plan, planIndex) => {
                const keyIds = Object.keys(plan.items)
                if (keyIds.length === 0) return null
                const startDate = moment(plan.startDate)
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

export default withAuth(LogSummary, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: process.env.AUTH0_SCOPE
})
