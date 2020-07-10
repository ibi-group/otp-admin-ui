import moment from 'moment'
import { Component } from 'react'
import { withAuth } from 'use-auth0-hooks'

import { secureFetch } from '../util'

class LogSummary extends Component {
  constructor (props) {
    super(props)
    this.state = {
      events: null,
      eventsError: null
    }
    // TODO fix babel plugin so we can use class properties
    // https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
    // https://nextjs.org/docs/advanced-features/customizing-babel-config
    this.handleFetchErrors = this.handleFetchErrors.bind(this)
  }

  async handleFetchErrors (force = false) {
    const { events, eventsError } = this.state
    if (!force && (events || eventsError)) {
      return
    }

    const { accessToken } = this.props.auth
    if (!accessToken) {
      return
    }
    const fetchedLogs = await secureFetch(`${process.env.API_BASE_URL}/api/admin/bugsnag/eventsummary`, accessToken)
    if (fetchedLogs) {
      this.setState({ events: fetchedLogs })
    }
  }

  async componentDidMount () {
    await this.handleFetchErrors()
  }

  async componentDidUpdate () {
    await this.handleFetchErrors()
  }

  render () {
    const { auth } = this.props
    const { events, eventsError } = this.state
    if (!auth.isAuthenticated) return null
    const hasEvents = events && events.length > 0
    console.log(events)
    return (
      <div>
        <h2>Error Events Summary</h2>
        <button onClick={this.handleFetchErrors}>Fetch errors</button>
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://app.bugsnag.com/'
        >
          Open Bugsnag console
        </a>
        {
          hasEvents && (
            <div>
              {eventsError && <pre>Error loading events: {eventsError}</pre>}
              <div>All error events recorded over the last two weeks:</div>
              <ul>
                {events.map((event, eventIndex) => {
                  return (
                    <li key={eventIndex}>
                      {event.errorId}
                    </li>
                  )
                })}
              </ul>
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
