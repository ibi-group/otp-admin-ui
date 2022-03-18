import 'expect-puppeteer'

import { server } from '../../jest-puppeteer.config'

jest.setTimeout(50000)

describe('end-to-end tests', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${server.port}`)
  })

  describe('A logged out user', () => {
    it('should see the main screen', async () => {
      await expect(page).toMatch('E2E') // "E2E" is in the title set in the e2e config
    })

    it('should be able to log in', async () => {
      await expect(page).toClick('button', { text: 'Log in' })
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
      try {
        await expect(page).toFillForm('form', {
          password: process.env.E2E_PASSWORD,
          username: process.env.E2E_USERNAME
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
    })
  })
  describe('An admin user', () => {
    const NEW_USERNAME = process.env.E2E_NEW_USERNAME_1
    if (!NEW_USERNAME) {
      throw new Error('NEW_USERNAME must be set!')
    }

    it('should be able to see the list of admin users', async () => {
      await expect(page).toClick('[data-id="Admin Users"]')
      await page.waitForNavigation({ waitUntil: 'networkidle2' })

      const { E2E_USERNAME } = process.env
      if (!E2E_USERNAME) {
        throw new Error('E2E_USERNAME must be set!')
      }
      await expect(page).toMatch(E2E_USERNAME)
    })
    it('should be able to add a CDP user', async () => {
      await expect(page).toClick('a', { text: 'CDP Users' })
      await page.waitForXPath("//*[h2 and contains(., 'List of CDP Users')]")
      page.on('dialog', async (dialog) => {
        await dialog.accept(NEW_USERNAME)
      })
      await expect(page).toClick('button', { text: 'Create user' })
      await page.waitForSelector('li.list-group-item', { timeout: 6000 })
      await expect(page).toMatch(NEW_USERNAME, { timeout: 6000 })
    })
    it('should be able to log out', async () => {
      await expect(page).toClick('button', { text: 'Log out' })
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
      await expect(page).toMatch('E2E') // "E2E" is in the title set in the e2e config
    })
    it('should be able to log in as a CDP user', async () => {
      // TODO: methodize
      await expect(page).toClick('button', { text: 'Log in' })
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
      try {
        await expect(page).toFillForm('form', {
          password: process.env.E2E_PASSWORD,
          username: NEW_USERNAME
        })
      } catch (error) {
        console.warn(error)
        console.warn(
          'You may have forgotten to set E2E_PASSWORD or E2E_USERNAME environment variables'
        )
      }
      await page.click('button[type="submit"]')

      await page.waitForNavigation({ waitUntil: 'networkidle2' })

      await expect(page).toMatch('Raw Request Data Download', { timeout: 6000 })
    })
  })
})
