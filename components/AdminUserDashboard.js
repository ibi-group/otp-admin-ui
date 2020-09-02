import { useRouter } from 'next/router'
import { Tab, Tabs } from 'react-bootstrap'

import ErrorEventsDashboard from './ErrorEventsDashboard'
import RequestLogsDashboard from './RequestLogsDashboard'

export default function AdminUserDashboard (props) {
  const { push, query: { dashboard } } = useRouter()
  return (
    <div>
      <Tabs
        id='admin-dashboard-tabs'
        className='mb-4'
        activeKey={dashboard}
        onSelect={(key) => push(key === '/' ? '/' : `/?dashboard=${key}`)}
        variant='pills'
      >
        <Tab eventKey='/' title='Home'>
          <p>
            Please select a category above.
          </p>
        </Tab>
        <Tab eventKey='errors' title='Errors'>
          <ErrorEventsDashboard />
        </Tab>
        <Tab eventKey='requests' title='Request logs'>
          <RequestLogsDashboard isAdmin />
        </Tab>
      </Tabs>
      <style jsx>{`
          * {
            font-family: 'Arial';
          }
        `}
      </style>
    </div>
  )
}
