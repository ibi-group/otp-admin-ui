import type { Browser } from 'puppeteer'
// Waiting for download to complete via chrome download page courtesy of https://stackoverflow.com/a/71193897
export async function waitForDownload(browser: Browser): Promise<boolean> {
  const dmPage = await browser.newPage()
  await dmPage.goto('chrome://downloads/')

  await dmPage.bringToFront()
  await dmPage.waitForFunction(
    () => {
      try {
        const donePath = document
          ?.querySelector('downloads-manager')
          ?.shadowRoot?.querySelector('#frb0')
          ?.shadowRoot?.querySelector('#pauseOrResume')
        if ((donePath as HTMLButtonElement).innerText !== 'Pause') {
          return true
        }
      } catch {
        return false
      }
    },
    { timeout: 0 }
  )
  return false
}
