import type { Locator, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { cv } from '../helpers/cv'
import { goToSection, waitForScrollReady } from './scroll-helpers'

async function pointAt(page: Page, control: Locator): Promise<{ x: number, y: number }> {
  await expect(control).toBeInViewport()
  const box = await control.boundingBox()
  expect(box).not.toBeNull()
  const point = { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 }
  await page.mouse.move(point.x, point.y)
  return point
}

async function assertCursorAboveChrome(page: Page, control: Locator): Promise<void> {
  const point = await pointAt(page, control)
  const cursor = page.locator('.cursor')
  await expect(cursor).toHaveClass(/\bis-visible\b/)
  await expect(cursor).toHaveCSS('opacity', '1')
  await expect(cursor).toHaveCSS('pointer-events', 'none')
  await expect.poll(() => page.locator('[data-cursor-ring]').evaluate((element, target) => {
    const rect = element.getBoundingClientRect()
    return Math.hypot(rect.x + rect.width / 2 - target.x, rect.y + rect.height / 2 - target.y)
  }, point)).toBeLessThan(0.5)
  expect(await control.evaluate((element, target) => element.contains(document.elementFromPoint(target.x, target.y)), point)).toBe(true)
  expect(await page.evaluate(target => document.elementsFromPoint(target.x, target.y).some(element => Boolean(element.closest('.cursor'))), point)).toBe(false)
  expect(await cursor.evaluate(element => element.parentElement === document.body)).toBe(true)
  const layers = await page.evaluate(() => ({
    cursor: Number(getComputedStyle(document.querySelector('.cursor')!).zIndex),
    topbar: Number(getComputedStyle(document.querySelector('.topbar')!).zIndex),
  }))
  expect(layers.cursor).toBeGreaterThan(layers.topbar)
}

async function assertIndicatorAligned(page: Page, link: Locator): Promise<void> {
  const indicator = page.locator('[data-dock-indicator]')
  await expect(indicator).toBeVisible()
  await expect.poll(async () => {
    const target = await link.boundingBox()
    const current = await indicator.boundingBox()
    if (!target || !current)
      return Number.POSITIVE_INFINITY
    return Math.abs(current.x - target.x) + Math.abs(current.width - target.width)
  }).toBeLessThan(4)
}

test.describe('floating navigation and cursor', () => {
  test('cursor stays above the floating chrome without intercepting pointer actions', async ({ page, isMobile }) => {
    test.skip(isMobile || !cv.site.features.cursor, 'Custom cursor needs a fine pointer and the enabled feature')
    await page.goto('./')
    await waitForScrollReady(page)
    await page.mouse.move(400, 220)
    await expect(page.locator('html')).toHaveClass(/\bcursor-enabled\b/)

    for (const selector of ['.topbar__nav a[href="#about"]', '[data-index-open]', '#themeSwitch'])
      await assertCursorAboveChrome(page, page.locator(selector))

    const theme = await pointAt(page, page.locator('#themeSwitch'))
    await page.mouse.click(theme.x, theme.y)
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
    await expect(page.locator('#themeSwitch')).toHaveAttribute('aria-pressed', 'true')
    await expect.poll(() => page.locator('#themeSelect').evaluate((element) => {
      const rect = element.getBoundingClientRect()
      return element.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2))
    })).toBe(true)

    await pointAt(page, page.locator('#themeSelect'))
    await expect(page.locator('html')).not.toHaveClass(/\bcursor-enabled\b/)
    await expect(page.locator('#themeSelect')).not.toHaveCSS('cursor', 'none')
    await assertCursorAboveChrome(page, page.locator('[data-index-open]'))

    const index = await pointAt(page, page.locator('[data-index-open]'))
    await page.mouse.click(index.x, index.y)
    await expect(page.locator('#indexDialog')).toBeVisible()
    await expect(page.locator('html')).not.toHaveClass(/\bcursor-enabled\b/)
    await expect(page.locator('.cursor')).not.toHaveClass(/\bis-visible\b/)
    await page.keyboard.press('Escape')
    await expect(page.locator('#indexDialog')).toBeHidden()
    await assertCursorAboveChrome(page, page.locator('.topbar__nav a[href="#about"]'))
  })

  test('floating navigation remains inset and tracks the real active section', async ({ page, isMobile }) => {
    await page.goto('./')
    await waitForScrollReady(page)
    const topbar = page.locator('.topbar')
    await expect(topbar).toHaveCSS('position', 'fixed')
    await expect(topbar).toHaveAttribute('data-dock-state', 'top')
    await goToSection(page, 'about')
    await expect(topbar).toHaveAttribute('data-dock-state', 'scrolled')
    const box = await topbar.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThan(0)
    expect(box!.y).toBeGreaterThan(0)
    expect(box!.x + box!.width).toBeLessThan(page.viewportSize()!.width)
    await expect(page.locator('[data-index-open]')).toBeInViewport()

    if (!isMobile) {
      const active = page.locator('.topbar__nav [aria-current="location"]')
      await expect(active).toHaveCount(1)
      await expect(active).toHaveAttribute('href', '#about')
      await assertIndicatorAligned(page, active)
      const project = await pointAt(page, page.locator('.topbar__nav a[href="#projects"]'))
      await assertIndicatorAligned(page, page.locator('.topbar__nav a[href="#projects"]'))
      await page.mouse.click(project.x, project.y)
      await expect(page.locator('#projects')).toBeFocused()
      await expect(active).toHaveAttribute('href', '#projects')
      await assertIndicatorAligned(page, active)
      await expect(page.locator('#projects-title')).toBeInViewport()
    }

    await goToSection(page, 'contact')
    await expect(topbar).toBeInViewport()
    await expect(page.locator('#contact-title')).toBeInViewport()
  })
})
