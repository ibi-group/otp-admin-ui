import React from 'react'
import { useRouter } from 'next/router'
import { Tab, Tabs } from 'react-bootstrap'

import {
  getActiveUserTypes,
  isApiManagerEnabled,
  isCdpManagerEnabled
} from '../util/ui'

import CDPUserDashboard from './CDPUserDashboard'
import ErrorEventsDashboard from './ErrorEventsDashboard'
import RequestLogsDashboard from './RequestLogsDashboard'
import UserList from './UserList'

export default function AdminUserDashboard(): JSX.Element {
  const {
    push,
    query: { dashboard }
  } = useRouter()
  const hasApiManager = isApiManagerEnabled()
  const hasCdpManager = isCdpManagerEnabled()
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
          {hasApiManager && <RequestLogsDashboard isAdmin summaryView />}
        </Tab>
        <Tab eventKey="errors" title="Errors">
          <ErrorEventsDashboard />
        </Tab>
        {hasApiManager && (
          <Tab eventKey="requests" title="Request logs">
            <RequestLogsDashboard isAdmin />
          </Tab>
        )}
        {hasCdpManager && (
          <Tab eventKey="cdp" title="Connected Data Platform">
            <CDPUserDashboard />
          </Tab>
        )}
      </Tabs>
    </div>
  )
}
