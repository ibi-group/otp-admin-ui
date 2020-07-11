import { useRouter } from 'next/router'
import Select from 'react-select'

import ErrorEventsDashboard from '../components/ErrorEventsDashboard'
import RequestLogsDashboard from '../components/RequestLogsDashboard'

export default function AdminUserDashboard (props) {
  const { push, query: { dashboard } } = useRouter()
  const dashboardOptions = [
    // TODO: Remove Home?
    // TODO: Factor shared code with manage.js?
    {label: 'Home'}, // value is undefined to match missing query param
    {value: 'errors', label: 'Errors'},
    {value: 'requests', label: 'Request logs'}
  ]
  return (
    <div>
      <h1>Admin Dashboard</h1>
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
