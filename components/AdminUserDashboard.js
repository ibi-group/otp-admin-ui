import { useRouter } from 'next/router'
import { Tab, Tabs } from 'react-bootstrap'

import ErrorEventsDashboard from './ErrorEventsDashboard'
import RequestLogsDashboard from './RequestLogsDashboard'
import UserList from './UserList'
import { USER_TYPES } from '../util/constants'

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
          <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
            {USER_TYPES.map(item => (
              <UserList key={item.value} summaryView type={item.value} />
            ))}
          </div>
          <RequestLogsDashboard isAdmin summaryView />
        </Tab>
        <Tab eventKey='errors' title='Errors'>
          {/*<ErrorEventsDashboard />*/}
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
