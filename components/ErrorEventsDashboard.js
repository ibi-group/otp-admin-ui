import moment from 'moment'
import useSWR from 'swr'

import FetchMessage from './FetchMessage'

function ErrorEventsDashboard () {
  const { data: events, error } = useSWR(`${process.env.API_BASE_URL}/api/admin/bugsnag/eventsummary`)
  const hasEvents = events && events.length > 0
  const MAX_EVENTS_TO_DISPLAY = 100
  return (
    <div>
      <h2>Error Events Summary</h2>
      <div className='controls'>
        <FetchMessage data={events} error={error} />
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
            {error && <pre>Error loading events: {error}</pre>}
            <p>
              {events.length} error events recorded over the last two weeks
              {events.length > MAX_EVENTS_TO_DISPLAY && ` (showing first ${MAX_EVENTS_TO_DISPLAY})`}
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
                  // FIXME: Add pagination to server/UI.
                  .filter((event, index) => index <= MAX_EVENTS_TO_DISPLAY)
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

export default ErrorEventsDashboard
