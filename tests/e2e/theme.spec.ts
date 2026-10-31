import { expect, test } from '@playwright/test'
import { cv, uiText } from '../helpers/cv'
import { waitForScrollReady } from './scroll-helpers'

test.describe('theme controls', () => {
  test('theme switch toggles dark mode and persists after reload', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)

    const html = page.locator('html')
    await expect(html).not.toHaveClass(/\bdark\b/)

    await page.locator('#themeSwitch').click()

    await expect(html).toHaveClass(/\bdark\b/)
    await expect(page.locator('#themeSwitch')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('#themeSwitch')).toHaveAccessibleName(uiText('theme.lightLabel'))
    await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe('dark')

    await page.reload()

    await expect(html).toHaveClass(/\bdark\b/)
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark')
  })

  test('palette selection updates data-theme and persists after reload', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)

    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', cv.basics.theme)

    await page.selectOption('#themeSelect', 'blue')

    await expect(html).toHaveAttribute('data-theme', 'blue')
    await expect.poll(() => page.evaluate(() => localStorage.getItem('data-theme'))).toBe('blue')

    await page.reload()

    await expect(html).toHaveAttribute('data-theme', 'blue')
    expect(await page.evaluate(() => localStorage.getItem('data-theme'))).toBe('blue')
  })

  test('blocked storage does not break theme controls or accessible state', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.addInitScript(() => {
      Storage.prototype.getItem = () => {
        throw new DOMException('Storage is blocked', 'SecurityError')
      }
      Storage.prototype.setItem = () => {
        throw new DOMException('Storage is blocked', 'SecurityError')
      }
    })
    await page.goto('./')
    await waitForScrollReady(page)
    await page.locator('#themeSwitch').click()
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
    await expect(page.locator('#themeSwitch')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('#themeSwitch')).toHaveAccessibleName(uiText('theme.lightLabel'))

    await page.selectOption('#themeSelect', 'green')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'green')
    await expect(page.locator('#themeSelect')).toHaveValue('green')
    await page.locator('#themeSwitch').click()
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)
    await expect(page.locator('#themeSwitch')).toHaveAttribute('aria-pressed', 'false')
    expect(errors).toEqual([])
  })

  test('follows repeated system changes until the user chooses a mode', async ({ page }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    const html = page.locator('html')
    await expect(html).not.toHaveClass(/\bdark\b/)
    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(html).toHaveClass(/\bdark\b/)
    await expect(page.locator('#themeSwitch')).toHaveAttribute('aria-pressed', 'true')
    await page.emulateMedia({ colorScheme: 'light' })
    await expect(html).not.toHaveClass(/\bdark\b/)

    await page.locator('#themeSwitch').click()
    await expect(html).toHaveClass(/\bdark\b/)
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.emulateMedia({ colorScheme: 'light' })
    await expect(html).toHaveClass(/\bdark\b/)
    await expect(page.locator('#themeSwitch')).toHaveAccessibleName(uiText('theme.lightLabel'))
  })
})
