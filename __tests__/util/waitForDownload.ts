import fs from 'fs'

/**
 * Method which waits for a download to complete by waiting for a given filename
 */
export function waitForDownload(downloadedFileName: string): Promise<void> {
  let waitAttempts = 0

  return new Promise((resolve, reject) => {
    const check = setInterval(() => {
      const downloadingFiles = fs.readdirSync('/tmp')
      const downloadedFileFound = !!downloadingFiles.find((file) => {
        // In some cases the file downloads before this is fired.
        // In this case, check for the completed download
        return (
          file.includes(downloadedFileName) && !file.includes('.crdownload')
        )
      })

      if (downloadedFileFound) {
        clearInterval(check)
        resolve()
      }

      if (waitAttempts++ > 75) {
        clearInterval(check)
        reject(new Error('failed to find crdownload file!'))
      }
    }, 100)
  })
}
