import { USER_TYPE } from '../util/constants'

export type ApiKey = {
  keyId: string
  name: string
  value: string
}
export type ApiUser = {
  apiKeys?: ApiKey[]
  appName: string
  appPurpose: string
  appUrl: string
  auth0UserId?: string
  company: string
  dateCreated?: number
  email?: string
  hasConsentedToTerms: boolean
  id?: string
  isDataToolsUser?: boolean
  lastUpdated?: number
  name: string
  subscriptions?: string[]
}

export type Subscription = {
  label: string
  value: string
}

export type HandleSignup = () => void

export type OnDeleteUser = (user: ApiUser, type: USER_TYPE) => void
export type OnUpdateUserArgs = {
  isSelf?: boolean
  type: USER_TYPE
  user: ApiUser
}
export type OnUpdateUser = (args: OnUpdateUserArgs) => Promise<void>
export type OnViewUser = (user?: ApiUser | null, type?: USER_TYPE) => void
