export type ApiKey = {
  keyId: string
  name: string
  value: string
}
export type ApiUser = {
  apiKeys: ApiKey[]
  appName: string
  appPurpose: string
  appUrl: string
  auth0UserId: string
  company: string
  dateCreated: number
  email: string
  hasConsentedToTerms: boolean
  id: string
  isDatatoolsUser: boolean
  lastUpdated: number
  name: string
}
