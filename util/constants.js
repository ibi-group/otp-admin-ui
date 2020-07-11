export const AUTH0_SCOPE = ''

export const ADMIN_USER_URL = `${process.env.API_BASE_URL}/api/admin/user`
export const API_USER_URL = `${process.env.API_BASE_URL}/api/secure/application`
export const OTP_USER_URL = `${process.env.API_BASE_URL}/api/secure/user`

export const USER_TYPES = [
  {value: 'admin', label: 'Admin Users', url: ADMIN_USER_URL},
  {value: 'api', label: 'Third Party API Applications', url: API_USER_URL},
  {value: 'otp', label: 'OpenTripPlanner Users', url: OTP_USER_URL}
]
