import moment from 'moment'
import { Component } from 'react'
import { Button } from 'react-bootstrap'
import { withAuth } from 'use-auth0-hooks'

import { secureFetch } from '../util/middleware'

class ErrorEventsDashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      events: null,
      eventsError: null
    }
  }

  handleFetchErrors = async (force = false) => {
    const { events, eventsError } = this.state
    if (!force && (events || eventsError)) {
      return
    }

    const { accessToken } = this.props.auth
    if (!accessToken) {
      return
    }
    const url = `${process.env.API_BASE_URL}/api/admin/bugsnag/eventsummary`
    const fetchedErrorEvents = await secureFetch(url, accessToken)
    if (fetchedErrorEvents.status === 'sucess') {
      this.setState({
        events: fetchedErrorEvents.data,
        fetchMessage: `Updated at ${moment().format('h:mm:ss a')}`
      })
    } else {
      this.setState({
        fetchMessage: `Failed to update!`
      })
    }
  }

  async componentDidMount () {
    await this.handleFetchErrors()
  }

  render () {
    const { auth } = this.props
    const { events, eventsError, fetchMessage } = this.state
    if (!auth.isAuthenticated) return null
    const hasEvents = events && events.length > 0
    return (
      <div>
        <h2>Error Events Summary</h2>
        <div className='controls'>
          <Button onClick={this.handleFetchErrors}>
            Fetch errors
          </Button>
          {fetchMessage && <span className='fetchMessage'>{fetchMessage}</span>}
          <a
            className='push'
            target='_blank'
            rel='noopener noreferrer'
            href='https://app.bugsnag.com/'
          >
            Open Bugsnag console
          </a>
        </div>
        {hasEvents
          ? (
            <div>
              {eventsError && <pre>Error loading events: {eventsError}</pre>}
              <p>
                All error events recorded over the last two weeks:
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Error</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {/* TODO: Pending a refactor of the backend Bugsnag code, this
                    should split up the errors according to the project they are
                    assigned to.
                  */}
                  {events
                    .sort((a, b) => moment(b.received) - moment(a.received))
                    .map((event, eventIndex) => {
                      // TODO: these fields are subject to change pending backend
                      // changes.
                      return (
                        <tr key={eventIndex}>
                          <td>{event.projectName}</td>
                          <td>
                            {event.exceptions.map((e, i) =>
                              <span key={i}>{e.errorClass}: {e.message}</span>)
                            }
                          </td>
                          <td>{moment(event.received).format('D MMM HH:mm')}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          )
          : 'No errors reported in the last two weeks.'
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
          td {
            padding-right: 10px;
          }
        `}
        </style>
      </div>
    )
  }
}

export default withAuth(ErrorEventsDashboard, {
  audience: process.env.AUTH0_AUDIENCE,
  scope: process.env.AUTH0_SCOPE
})
