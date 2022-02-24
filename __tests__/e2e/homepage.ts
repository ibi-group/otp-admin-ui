import 'expect-puppeteer'
import { server } from '../../jest-puppeteer.config'
jest.setTimeout(30000)

describe('A logged out user', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${server.port}`)
  })

  it('should see the main screen', async () => {
    await expect(page).toMatch('E2E')
  })

  it('should be able to log in', async () => {
    await expect(page).toClick('button', { text: 'Log in' })
    await page.waitForNavigation({ waitUntil: 'networkidle2' })
    await expect(page).toFillForm('form', {
      password: 'TODO: pull from env',
      username: 'TODO: pull from env'
    })
    await page.click('button[type="submit"]')

    await page.waitForNavigation({ waitUntil: 'networkidle2' })

    // FIXME: continue adventure
    await expect(page).toMatch('Something went wrong while logging in.')
  })
})
