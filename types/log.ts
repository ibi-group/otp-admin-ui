import { Requests } from './graph'
import { ApiUser } from './user'

export type Log = {
  apiUsers: { [key: string]: ApiUser }
  result: {
    endDate: string
    items: { [key: string]: Requests }
    position?: number
    startDate: string
    usagePlanId: string
  }
}
