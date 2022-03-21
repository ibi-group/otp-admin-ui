import fs from 'fs'

/**
 * Method which waits for a download to complete by monitoring the presence of
 * .crdownload files
 */
export function waitForDownload(downloadedFileName: string): Promise<void> {
  let crdownloadFilesSeen = false
  let waitAttempts = 0

  return new Promise((resolve, reject) => {
    setInterval(() => {
      const downloadingFiles = fs.readdirSync('/tmp')
      const crdownloadFilesPresent = !!downloadingFiles.find((file) => {
        // In some cases the file downloads before this is fired.
        // In this case, check for the completed download
        return file.includes('.crdownload') || file === downloadedFileName
      })

      if (crdownloadFilesPresent && !crdownloadFilesSeen) {
        crdownloadFilesSeen = true
      }
      if (!crdownloadFilesPresent && crdownloadFilesSeen) {
        resolve()
      }

      if (waitAttempts++ > 30) {
        reject(new Error('failed to find crdownload file!'))
      }
    }, 100)
  })
}
