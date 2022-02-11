export type Exception = {
  errorClass: string
  message: string
}
export type Event = {
  received: number
  projectName: string
  exceptions?: Exception[]
}
