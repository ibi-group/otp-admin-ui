import { Sync } from '@styled-icons/fa-solid/Sync'
import moment from 'moment'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import useSWR, { mutate } from 'swr'

import FetchMessage from './FetchMessage'

const ERROR_EVENTS_URL = `${process.env.API_BASE_URL}/api/admin/bugsnag/eventsummary`

function ErrorEventsDashboard () {
  const [pageIndex, setPageIndex] = useState(0)
  const url = `${ERROR_EVENTS_URL}?page=${pageIndex}`
  const result = useSWR(url)
  const { data: events, error, isValidating } = result
  const hasEvents = events && events.data && events.data.length > 0
  const eventsCount = hasEvents ? events.data.length : 0
  return (
    <div>
      <h2>Error Events Summary</h2>
      <div className='controls'>
        <Button disabled={isValidating} className='mr-3' onClick={() => mutate(url)}>
          <Sync size={20} />
        </Button>
        <Button className='mr-3' disabled={pageIndex <= 0} onClick={() => setPageIndex(pageIndex - 1)}>Previous</Button>
        <Button className='mr-3' onClick={() => setPageIndex(pageIndex + 1)}>Next</Button>
        <FetchMessage result={result} />
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
              {eventsCount} error events recorded over the last two weeks
              (page {events.page + 1} of  {events.total / events.limit})
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
                {events.data
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

export default ErrorEventsDashboard
