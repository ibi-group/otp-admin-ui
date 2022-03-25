import 'expect-puppeteer'

import { server } from '../../jest-puppeteer.config'
import { dateFormatterOptions } from '../../util/constants'
import { waitForDownload } from '../util/waitForDownload'

jest.setTimeout(50000)
const NEW_CDP_USERNAME = process.env.E2E_NEW_USERNAME_1
const dialogHandler = jest.fn((dialog) => dialog.accept(NEW_CDP_USERNAME))

describe('end-to-end tests', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${server.port}`)
    page.on('dialog', dialogHandler)
  })

  describe('A logged out user', () => {
    it('should see the main screen', async () => {
      await expect(page).toMatch('E2E') // "E2E" is in the title set in the e2e config
    })
    // TODO: sign up as api user (need to figure out a good way to bypass email verification)
    // pre-creating a user is not possible, as sign up creates a new auth0 user
  })
  // TODO: Making requests/creating an api key is currently not tested to avoid making a lot of
  // aws requests.

  describe('An API user', () => {
    it('should be able to log in', async () => {
      await expect(page).toClick('button', { text: 'Log in' })
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
      try {
        await expect(page).toFillForm('form', {
          password: process.env.E2E_PASSWORD,
          username: process.env.E2E_USERNAME_API
        })
      } catch (error) {
        console.warn(error)
        console.warn(
          'You may have forgotten to set E2E_PASSWORD or E2E_USERNAME_API environment variables'
        )
      }
      await page.click('button[type="submit"]')

      await page.waitForNavigation({ waitUntil: 'networkidle2' })

      await expect(page).toMatch('API Key Instructions', { timeout: 15000 })
      await page.waitForTimeout(1500)
      await expect(page).toMatch('No usage logs found', { timeout: 15000 })
    })

    it('should be able to *attempt* to create a new API key', async () => {
      await page.waitForTimeout(750)
      await expect(page).toClick('button', { text: 'Create new key' })
      await page.waitForTimeout(750)
      expect(dialogHandler).toHaveBeenCalled()
    })

    it('should be able to see their details', async () => {
      await expect(page).toClick('a', { text: 'My Account' })
      await page.waitForTimeout(500)
      expect(
        await page.$eval('[name="appPurpose"]', (input) => {
          return input.getAttribute('value')
        })
      ).toEqual('e2e test app purpose') // set in mongo seed
    })

    it('should be able to log out', async () => {
      await expect(page).toClick('button', { text: 'Log out' })
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
      await expect(page).toMatch('E2E') // "E2E" is in the title set in the e2e config
    })
  })
  describe('An admin user', () => {
    const { E2E_USERNAME } = process.env
    if (!E2E_USERNAME) {
      throw new Error('E2E_USERNAME must be set!')
    }

    it('should be able to log in', async () => {
      await expect(page).toClick('button', { text: 'Log in' })
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
      try {
        await expect(page).toFillForm('form', {
          password: process.env.E2E_PASSWORD,
          username: E2E_USERNAME
        })
      } catch (error) {
        console.warn(error)
        console.warn(
          'You may have forgotten to set E2E_PASSWORD or E2E_USERNAME environment variables'
        )
      }
      await page.click('button[type="submit"]')

      await page.waitForNavigation({ waitUntil: 'networkidle2' })

      await expect(page).toMatch('Admin Users', { timeout: 15000 })
      await expect(page).toMatch('Connected Data Platform', { timeout: 15000 })
    })

    if (!NEW_CDP_USERNAME) {
      throw new Error('NEW_USERNAME must be set!')
    }

    it('should be able to see the list of admin users', async () => {
      await expect(page).toClick('[data-id="Admin Users"]')
      await page.waitForNavigation({ waitUntil: 'networkidle2' })

      await page.waitForTimeout(2000)
      await expect(page).toMatch(E2E_USERNAME)
    })
    it('should be able to see the list of api users', async () => {
      await expect(page).toClick('#admin-dashboard-tabs-tab-api')

      const { E2E_USERNAME_API } = process.env
      if (!E2E_USERNAME_API) {
        throw new Error('E2E_USERNAME_API must be set!')
      }
      await page.waitForTimeout(2000)
      await expect(page).toMatch(E2E_USERNAME_API)
    })
    it('should be able to edit an api user', async () => {
      // Only one API user!
      await page.waitForTimeout(500)
      const [viewButton] = await page.$x("//*[text() = 'View']")
      if (viewButton) {
        await viewButton.click()
      }
      await page.waitForTimeout(750)
      await expect(page).toMatch('Developer name')
      expect(
        await page.$eval('[name="appPurpose"]', (input) => {
          return input.getAttribute('value')
        })
      ).toEqual('e2e test app purpose') // set in mongo seed
      await expect(page).toClick('.close')
      await page.waitForTimeout(500)
    })

    it('should be able to add a CDP user', async () => {
      await expect(page).toClick('a', { text: 'CDP Users' })
      await page.waitForXPath("//*[h2 and contains(., 'List of CDP Users')]")
      await page.waitForTimeout(500)
      await expect(page).toClick('button', { text: 'Create user' })
      await page.waitForSelector('li.list-group-item', { timeout: 9000 })
      await expect(page).toMatch(NEW_CDP_USERNAME, { timeout: 9000 })
    })

    it('should be able to their see their own account details', async () => {
      await expect(page).toClick('a', { text: 'My Account' })
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
      await expect(page).toMatch('ADMIN')
      await expect(page).toMatch(E2E_USERNAME)
    })

    it('should be able to log out', async () => {
      await expect(page).toClick('button', { text: 'Log out' })
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
      await expect(page).toMatch('E2E') // "E2E" is in the title set in the e2e config
    })
  })

  describe('A CDP user', () => {
    it('should be able to log in', async () => {
      // TODO: methodize
      await expect(page).toClick('button', { text: 'Log in' })
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
      try {
        await expect(page).toFillForm('form', {
          password: process.env.E2E_PASSWORD,
          username: NEW_CDP_USERNAME
        })
      } catch (error) {
        console.warn(error)
        console.warn(
          'You may have forgotten to set E2E_PASSWORD or E2E_NEW_USERNAME_1 environment variables'
        )
      }
      await page.click('button[type="submit"]')

      await page.waitForNavigation({ waitUntil: 'networkidle2' })

      await page.waitForTimeout(1000)
      await expect(page).toMatch('Raw Request Data Download', { timeout: 6000 })
    })

    const dateFormatter = new Intl.DateTimeFormat('en-US', dateFormatterOptions)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const todaysUploadString = dateFormatter.format(yesterday)

    it('should see the file that the middleware uploaded', async () => {
      await expect(page).toMatch(todaysUploadString)
    })
    it('should be able to download a CDP zip file', async () => {
      const cdpsession = await page.target().createCDPSession()
      await cdpsession.send('Browser.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: '/tmp'
      })

      await expect(page).toClick('div', { text: todaysUploadString })

      await waitForDownload('anon-trip-data')
      await expect(page).toMatch('You last downloaded', { timeout: 6000 })
    })
  })
})
