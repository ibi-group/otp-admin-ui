import { useRouter } from 'next/router'
import Select from 'react-select'
import { useAuth } from 'use-auth0-hooks'

import ErrorEventsDashboard from '../components/ErrorEventsDashboard'
import RequestLogsDashboard from '../components/RequestLogsDashboard'
import { AUTH0_SCOPE } from '../util/constants'

export default function Index () {
  const { isAuthenticated, isLoading } = useAuth({
    audience: process.env.AUTH0_AUDIENCE,
    scope: AUTH0_SCOPE
  })
  const { push, query: { dashboard } } = useRouter()
  if (!isLoading && !isAuthenticated) {
    return (
      <div>
        Please log in to view the Admin Dashboard.
      </div>
    )
  }
  const dashboardOptions = [
    // TODO: Remove Home?
    // TODO: Factor shared code with manage.js?
    {label: 'Home'}, // value is undefined to match missing query param
    {value: 'errors', label: 'Errors'},
    {value: 'requests', label: 'Request logs'}
  ]
  return (
    <div>
      <h1>Dashboard</h1>
      <Select
        placeholder='Select dashboard...'
        value={dashboardOptions.find(o => o.value === dashboard)}
        options={dashboardOptions}
        onChange={(option) => push(option.value ? `/?dashboard=${option.value}` : '/')}
      />
      {!dashboard &&
        <p>
          Please select a category above.
        </p>
      }
      {dashboard === 'errors' && <ErrorEventsDashboard />}
      {dashboard === 'requests' && <RequestLogsDashboard />}
      <style jsx>{`
          * {
            font-family: 'Arial';
          }
        `}
      </style>
    </div>
  )
}
