export type Exception = {
  errorClass: string
  message: string
}
export type Event = {
  received: number
  projectName: string
  exceptions?: Exception[]
}

export type CDPFile = {
  key: string
  size: number
}

export type ConvertedMD = { markdown: string }

export type FileNameParserResponse = {
  dateFormatterOptions: Intl.DateTimeFormatOptions
  timestamp: number
} | null
