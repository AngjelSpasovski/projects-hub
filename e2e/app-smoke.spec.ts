import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
});

test('dashboard catalog supports view switching and project navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN' }).click();

  await expect(page.getByRole('heading', { name: 'Project Catalog' })).toBeVisible();
  await expect(page.getByText('6 project(s)')).toBeVisible();

  await page.getByRole('button', { name: /Detailed/ }).click();
  await expect(page.getByText('Difficulty').first()).toBeVisible();

  await page.getByRole('button', { name: /List/ }).click();
  await expect(page.getByRole('button', { name: /List/ })).toHaveClass(/active/);

  await page.getByRole('link', { name: 'Calculator', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Calculator', exact: true })).toBeVisible();
  await expect(page.locator('.project-workspace')).toBeVisible();
  await expect(page.locator('.project-workspace > .project-detail')).toBeVisible();
  await expect(page.locator('.project-workspace > .project-live .calculator-page')).toBeVisible();
  await expect(page.locator('.project-workspace .project-live .surface-panel')).toHaveCount(0);

  await page.getByRole('link', { name: /Dashboard/ }).click();
  await expect(page.getByRole('heading', { name: 'Project Catalog' })).toBeVisible();
});

test('language switch renders Macedonian catalog labels', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'MK' }).click();

  await expect(page.getByRole('heading', { name: 'Каталог на проекти' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Детално/ })).toBeVisible();
  await expect(page.getByText('Калкулатор').first()).toBeVisible();
});

test('mobile sidebar opens and closes after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();

  const menuButton = page.getByRole('button', { name: 'Open navigation' });
  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

  await page.getByRole('complementary').getByRole('link', { name: /Weather App/ }).click();

  await expect(page.getByRole('heading', { name: 'Weather App', exact: true })).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
});

test('catalog keeps filtered cards compact and tag overlay above cards', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();

  await page.getByPlaceholder('Search projects, tags, or categories').fill('cal');
  await expect(page.getByText('1 project(s)')).toBeVisible();

  const cardBox = await page.locator('.project-card').first().boundingBox();
  expect(cardBox?.width).toBeLessThan(430);

  await page.getByPlaceholder('Search projects, tags, or categories').fill('');

  const categoryHeight = await page.locator('.catalog-dropdown').first().evaluate((element) => element.getBoundingClientRect().height);
  const tagsHeight = await page.locator('.tag-filter').evaluate((element) => element.getBoundingClientRect().height);
  const sortHeight = await page.locator('.catalog-dropdown').nth(1).evaluate((element) => element.getBoundingClientRect().height);

  expect(Math.abs(categoryHeight - tagsHeight)).toBeLessThanOrEqual(2);
  expect(Math.abs(sortHeight - tagsHeight)).toBeLessThanOrEqual(2);

  await page.locator('.tag-filter').click();

  const overlay = page.locator('.p-multiselect-overlay').first();
  await expect(overlay).toBeVisible();
  await expect(overlay.locator('.p-multiselect-filter')).toBeVisible();
  await expect(overlay.locator('.p-multiselect-filter')).toHaveAttribute('placeholder', 'Search');

  const overlayZIndex = await overlay.evaluate((element) => Number(getComputedStyle(element).zIndex));
  const cardZIndex = await page.locator('.project-card').first().evaluate((element) => {
    const value = getComputedStyle(element).zIndex;
    return value === 'auto' ? 0 : Number(value);
  });

  expect(overlayZIndex).toBeGreaterThan(cardZIndex);
});

test('admin shell keeps chrome fixed while main content scrolls', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();

  const header = page.locator('.app-header');
  const sidebar = page.locator('.app-sidebar');
  const footer = page.locator('.app-footer');
  const main = page.locator('.admin-main');

  const headerTop = (await header.boundingBox())?.y;
  const sidebarTop = (await sidebar.boundingBox())?.y;
  const footerBottom = await footer.evaluate((element) => window.innerHeight - element.getBoundingClientRect().bottom);

  await main.evaluate((element) => {
    element.scrollTop = 600;
  });

  await expect.poll(async () => main.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  expect((await header.boundingBox())?.y).toBe(headerTop);
  expect((await sidebar.boundingBox())?.y).toBe(sidebarTop);
  await expect.poll(async () => footer.evaluate((element) => Math.round(window.innerHeight - element.getBoundingClientRect().bottom))).toBe(
    Math.round(footerBottom ?? 0)
  );
});

test('desktop catalog and project workspaces fit without nested scrollbars', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByText('6 project(s)')).toBeVisible();

  expect(await page.locator('.admin-main').evaluate((element) => element.scrollHeight <= element.clientHeight + 1)).toBe(true);

  const routes = ['tic-tac-toe', 'calculator', 'hang-man', 'weather', 'music-event', 'javascript-quiz'];

  for (const route of routes) {
    await page.goto(`/admin/projects/${route}`);
    await expect(page.locator('.project-live')).toBeVisible();
    expect(
      await page.locator('.project-live').evaluate((element) => ({
        fits: element.scrollHeight <= element.clientHeight + 1,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight
      }))
    ).toMatchObject({ fits: true });
  }
});

test('JavaScript Quiz completes a randomized workflow and answer review', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'JavaScript Quiz', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'JavaScript Quiz', exact: true })).toBeVisible();
  await expect(page.locator('.project-cover')).toBeVisible();
  expect(await page.locator('.project-cover').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(
    true
  );
  expect(await page.locator('.admin-main').evaluate((element) => element.scrollHeight <= element.clientHeight + 1)).toBe(true);
  await page.getByRole('button', { name: 'Start quiz' }).click();
  expect(await page.locator('.project-live').evaluate((element) => element.scrollHeight <= element.clientHeight + 1)).toBe(true);

  for (let question = 0; question < 6; question += 1) {
    await page.locator('.answer-option').first().click();
    await page.getByRole('button', { name: /Next question|Finish quiz/ }).click();
  }

  await expect(page.getByRole('heading', { name: 'Quiz complete' })).toBeVisible();
  await expect(page.getByText(/You answered \d of 6 questions correctly\./)).toBeVisible();
  await page.getByRole('button', { name: 'Review answers' }).click();
  await expect(page.getByRole('heading', { name: 'Answer review' })).toBeVisible();
  await expect(page.locator('.review-item')).toHaveCount(6);
});
