import { OAuthError } from '@auth0/auth0-react'

import { USER_TYPE } from '../util/constants'

export type ApiKey = {
  keyId: string
  name: string
  value: string
}

export type AbstractUser = {
  auth0UserId?: string
  dateCreated?: number
  email?: string
  id?: string
  isDataToolsUser?: boolean
  lastUpdated?: number
  name: string
}

export type AdminUser = AbstractUser & {
  subscriptions?: string[]
}

export type ApiUser = AbstractUser & {
  apiKeys?: ApiKey[]
  appName: string
  appPurpose: string
  appUrl: string
  company: string
  hasConsentedToTerms: boolean
}

export type CDPUser = AbstractUser & {
  buckets?: string[]
}

export type Subscription = {
  label: string
  value: string
}
export type AuthError = OAuthError

export type HandleSignup = () => void

export type OnDeleteUser = (user: AbstractUser, type: USER_TYPE) => void
export type OnUpdateUserArgs = {
  isSelf?: boolean
  type: USER_TYPE
  user: ApiUser | AdminUser
}
export type OnUpdateUser = (args: OnUpdateUserArgs) => Promise<void>
export type OnViewUser = (user?: AbstractUser | null, type?: USER_TYPE) => void
