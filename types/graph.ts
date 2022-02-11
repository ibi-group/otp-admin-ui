import { ApiUser } from './user'

export type ApiKey = { startDate: number; items: { [key: string]: Requests } }
export type Plan = {
  apiUsers?: { [key: string]: ApiUser }
  result: ApiKey
}
export type GraphValue = {
  x: string | number | Date
  y: string | number | Date
}

export type Requests = [number, number]
