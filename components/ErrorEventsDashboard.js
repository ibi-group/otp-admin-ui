import { ExternalLinkAlt } from '@styled-icons/fa-solid/ExternalLinkAlt'
import moment from 'moment'
import { useState } from 'react'
import useSWR from 'swr'

import PageControls from './PageControls'

const ERROR_EVENTS_URL = `${process.env.API_BASE_URL}/api/admin/bugsnag/eventsummary`

function ErrorEventsDashboard () {
  const [offset, setOffset] = useState(0)
  const limit = 40
  const url = `${ERROR_EVENTS_URL}?offset=${offset}&limit=${limit}`
  const result = useSWR(url)
  const { data: events } = result
  const hasEvents = events && events.data && events.data.length > 0
  return (
    <div>
      <h2>
        Error Events Summary
      </h2>
      <h5>
        <a
          className='push'
          target='_blank'
          rel='noopener noreferrer'
          href='https://app.bugsnag.com/'
        >
          <ExternalLinkAlt className='mr-1 mb-1' size={20} />
          Open Bugsnag console
        </a>
      </h5>
      <PageControls
        limit={limit}
        offset={offset}
        setOffset={setOffset}
        showSkipButtons
        result={result} />
      {hasEvents
        ? (
          <div>
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
                        <td className='component'>{event.projectName}</td>
                        <td className='details'>
                          {event.exceptions.map((e, i) =>
                            <span key={i}><strong>{e.errorClass}</strong>: {e.message}</span>)
                          }
                        </td>
                        <td className='date'>{moment(event.received).format('D MMM h:mm a')}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
            <PageControls
              limit={limit}
              offset={offset}
              setOffset={setOffset}
              showSkipButtons
              result={result} />
          </div>
        )
        : 'No errors reported in the last two weeks.'
      }
      <style jsx>{`
        .push {
          margin-left: auto;
        }
        td {
          padding-right: 10px;
        }
        td.component {
          vertical-align: top;
          font-size: x-small;
          white-space: nowrap;
        }
        td.details {
           overflow: hidden;
           text-overflow: ellipsis;
           display: -webkit-box;
           -webkit-line-clamp: 2; /* number of lines to show */
           -webkit-box-orient: vertical;
        }
        td.date {
          white-space: nowrap;
        }
      `}
      </style>
    </div>
  )
}

export default ErrorEventsDashboard
