import 'expect-puppeteer'
import { server } from '../jest-puppeteer.config'

describe('Google', () => {
  beforeAll(async () => {
    await page.goto('https://google.com')
  })

  it('should display "google" text on page', async () => {
    await expect(page).toMatch('google')
  })
})

describe('does it load?', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${server.port}`)
  })

  it('should show the main screen', async () => {
    await expect(page).toMatch('ui')
  })
})
