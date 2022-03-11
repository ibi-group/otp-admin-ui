import React from 'react'
import { useRouter } from 'next/router'
import { Tab, Tabs } from 'react-bootstrap'

import { getActiveUserTypes } from '../util/ui'

import ErrorEventsDashboard from './ErrorEventsDashboard'
import RequestLogsDashboard from './RequestLogsDashboard'
import UserList from './UserList'

export default function AdminUserDashboard(): JSX.Element {
  const {
    push,
    query: { dashboard }
  } = useRouter()
  const { API_MANAGER_ENABLED } = process.env
  const activeUserTypes = getActiveUserTypes()

  return (
    <div>
      <Tabs
        activeKey={dashboard}
        className="mb-4"
        id="admin-dashboard-tabs"
        onSelect={(key) => push(key === '/' ? '/' : `/?dashboard=${key}`)}
        variant="pills"
      >
        <Tab eventKey="/" title="Home">
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            {activeUserTypes.map((item) => (
              <UserList key={item.value} summaryView type={item.value} />
            ))}
          </div>
          {API_MANAGER_ENABLED && <RequestLogsDashboard isAdmin summaryView />}
        </Tab>
        <Tab eventKey="errors" title="Errors">
          <ErrorEventsDashboard />
        </Tab>
        {API_MANAGER_ENABLED && (
          <Tab eventKey="requests" title="Request logs">
            <RequestLogsDashboard isAdmin />
          </Tab>
        )}
      </Tabs>
      </style>
    </div>
  )
}
