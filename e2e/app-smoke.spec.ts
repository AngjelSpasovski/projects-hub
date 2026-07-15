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

  await expect(page.getByText('Overview of the small apps that will be migrated and added to this repo.')).toBeVisible();
  await expect(page.getByText('29 project(s)')).toBeVisible();

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
  await expect(page.getByText('29 project(s)')).toBeVisible();
});

test('theme switcher applies every theme without layout overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 820 });
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByText('29 project(s)')).toBeVisible();

  const themes = [
    { label: 'Realm', value: 'realm' },
    { label: 'White', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Blue', value: 'blue' }
  ];

  for (const theme of themes) {
    await page.getByRole('button', { name: new RegExp(theme.label) }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme.value);
    await expect(page.getByRole('button', { name: new RegExp(theme.label) })).toHaveClass(/active/);

    const shellMetrics = await page.locator('.admin-shell').evaluate((element) => ({
      bodyOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      shellHeight: element.clientHeight,
      shellScrollHeight: element.scrollHeight
    }));

    expect(shellMetrics.bodyOverflow).toBeLessThanOrEqual(1);
    expect(shellMetrics.shellScrollHeight).toBeLessThanOrEqual(shellMetrics.shellHeight + 1);
    await expect(page.locator('.project-card').first()).toBeVisible();
  }

  await page.getByRole('link', { name: 'Weather App', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Weather App', exact: true })).toBeVisible();

  for (const theme of themes) {
    await page.getByRole('button', { name: new RegExp(theme.label) }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme.value);
    await expect(page.locator('.project-workspace')).toBeVisible();
    await expect(page.locator('.project-live')).toBeVisible();

    const workspaceMetrics = await page.locator('.admin-shell').evaluate((element) => ({
      bodyOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      shellHeight: element.clientHeight,
      shellScrollHeight: element.scrollHeight
    }));

    expect(workspaceMetrics.bodyOverflow).toBeLessThanOrEqual(1);
    expect(workspaceMetrics.shellScrollHeight).toBeLessThanOrEqual(workspaceMetrics.shellHeight + 1);
  }
});

test('language switch renders Macedonian catalog labels', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'MK' }).click();

  await expect(page.getByRole('button', { name: /Детално/ })).toBeVisible();
  await expect(page.getByText('29 проект(и)')).toBeVisible();
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

  await page.getByPlaceholder('Search projects, tags, or categories').fill('keyboard events');
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

test('catalog summaries use show more dialog only for long card text', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();

  await expect(page.getByRole('button', { name: 'Show more' }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Show more' }).first().click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Randomized JavaScript challenge');

  const dialogBody = page.locator('.summary-dialog-content');
  await expect(dialogBody).toBeVisible();
  await expect(dialogBody).toHaveCSS('overflow-y', 'auto');
  await expect(page.locator('.p-dialog-mask')).toHaveCSS('backdrop-filter', /blur/);

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  await page.getByRole('button', { name: /List/ }).click();
  await expect(page.getByRole('button', { name: 'Show more' })).toHaveCount(0);
});

test('admin shell keeps chrome fixed while dashboard catalog scrolls', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 560 });
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByText('29 project(s)')).toBeVisible();

  const header = page.locator('.app-header');
  const sidebar = page.locator('.app-sidebar');
  const footer = page.locator('.app-footer');
  const main = page.locator('.admin-main');
  const catalog = page.locator('.project-catalog');
  const controls = page.locator('.catalog-controls');

  const headerTop = (await header.boundingBox())?.y;
  const sidebarTop = (await sidebar.boundingBox())?.y;
  const footerBottom = await footer.evaluate((element) => window.innerHeight - element.getBoundingClientRect().bottom);
  const controlsTop = (await controls.boundingBox())?.y;

  expect(await main.evaluate((element) => element.scrollHeight <= element.clientHeight + 1)).toBe(true);
  expect(await catalog.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);

  await catalog.evaluate((element) => {
    element.scrollTop = 600;
  });

  await expect.poll(async () => catalog.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  expect((await header.boundingBox())?.y).toBe(headerTop);
  expect((await sidebar.boundingBox())?.y).toBe(sidebarTop);
  expect((await controls.boundingBox())?.y).toBe(controlsTop);
  await expect.poll(async () => footer.evaluate((element) => Math.round(window.innerHeight - element.getBoundingClientRect().bottom))).toBe(
    Math.round(footerBottom ?? 0)
  );
});

test('dashboard keeps the catalog scroll position at the catalog bottom', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 560 });
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByText('29 project(s)')).toBeVisible();

  const catalog = page.locator('.project-catalog');

  await catalog.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });

  const initialBottomDistance = await catalog.evaluate((element) => element.scrollHeight - element.clientHeight - element.scrollTop);
  expect(initialBottomDistance).toBeLessThanOrEqual(2);

  await page.waitForTimeout(600);

  const finalBottomDistance = await catalog.evaluate((element) => element.scrollHeight - element.clientHeight - element.scrollTop);
  expect(finalBottomDistance).toBeLessThanOrEqual(8);
});

test('desktop catalog and project workspaces fit without nested scrollbars', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByText('29 project(s)')).toBeVisible();

  const routes = [
    'tic-tac-toe',
    'calculator',
    'hang-man',
    'weather',
    'music-event',
    'javascript-quiz',
    'todo-list',
    'expense-tracker',
    'technical-documentation',
    'movie-search',
    'rest-countries',
    'currency-converter',
    'quotes-api',
    'sticky-notes',
    'grocery-list',
    'project-planner',
    'odd-even',
    'dev-logger',
    'recipe-book',
    'flashcards',
    'timer',
    'digital-clock',
    'tip-calculator',
    'memory-game',
    'math-4-kids',
    'music-player',
    'photo-book',
    'client-panel',
    'chat-app'
  ];

  for (const route of routes) {
    await page.goto(`/admin/projects/${route}`);
    await expect(page.locator('.project-live')).toBeVisible();
    const liveMetrics = await page.locator('.project-live').evaluate((element) => ({
      fits: element.scrollHeight <= element.clientHeight + 1,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight
    }));

    expect(
      liveMetrics.fits,
      `${route}: clientHeight=${liveMetrics.clientHeight}, scrollHeight=${liveMetrics.scrollHeight}`
    ).toBe(true);
  }
});

test('project detail remains responsive on compact desktop and mobile viewports', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  for (const route of ['tic-tac-toe', 'calculator', 'hang-man']) {
    await page.goto(`/admin/projects/${route}`);
    await expect(page.locator('.project-live')).toBeVisible();

    expect(
      await page.locator('.project-live').evaluate((element) => ({
        fitsY: element.scrollHeight <= element.clientHeight + 1,
        fitsX: element.scrollWidth <= element.clientWidth + 1
      }))
    ).toMatchObject({ fitsY: true, fitsX: true });
  }

  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of ['tic-tac-toe', 'calculator', 'hang-man', 'weather']) {
    await page.goto(`/admin/projects/${route}`);
    await expect(page.locator('.project-workspace')).toBeVisible();

    expect(
      await page.locator('.project-workspace').evaluate((element) => ({
        bodyOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        workspaceOverflowX: element.scrollWidth - element.clientWidth
      }))
    ).toMatchObject({ bodyOverflowX: 0, workspaceOverflowX: 0 });
  }
});

test('mini project refinements keep core interactions stable', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('projects-hub-language', 'en'));
  await page.goto('/');
  await expect(page.getByText('29 project(s)')).toBeVisible();

  await page.goto('/admin/projects/calculator');
  await page.getByRole('button', { name: '9', exact: true }).click();
  await page.locator('.calculator-key').nth(3).click();
  await expect(page.locator('output')).toHaveText('3');
  await page.getByRole('button', { name: 'C', exact: true }).click();
  await page.getByRole('button', { name: '5', exact: true }).click();
  await page.getByRole('button', { name: '%', exact: true }).click();
  await expect(page.locator('output')).toHaveText('0.05');

  await page.goto('/admin/projects/weather');
  await page.getByRole('button', { name: 'Test error state' }).click();
  await expect(page.getByRole('heading', { name: 'Weather data unavailable' })).toBeVisible();
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByText('Weather data unavailable')).toBeHidden();

  await page.goto('/admin/projects/music-event');
  await page.getByRole('button', { name: 'Details' }).first().click();
  await expect(page.getByRole('dialog', { name: 'Jazz Night' })).toBeVisible();
  await expect(page.locator('.p-dialog-mask')).toHaveCSS('backdrop-filter', /blur/);
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog', { name: 'Jazz Night' })).toBeHidden();

  await page.goto('/admin/projects/hang-man');
  await page.getByRole('button', { name: 'A', exact: true }).click();
  await page.getByRole('button', { name: 'MK', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Restart round?' })).toBeVisible();
  await page.getByRole('button', { name: 'Change language' }).click();
  await expect(page.getByRole('dialog', { name: 'Restart round?' })).toBeHidden();

  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.goto('/admin/projects/tic-tac-toe');
  await page.locator('.cell').first().click();
  await page.getByRole('button', { name: 'Restart game' }).click();
  await expect(page.getByRole('dialog', { name: 'Restart current game?' })).toBeVisible();
  await page.getByRole('button', { name: 'Keep playing' }).click();
  await expect(page.getByRole('dialog', { name: 'Restart current game?' })).toBeHidden();
  await page.getByRole('button', { name: 'Reset score' }).first().click();
  await expect(page.getByRole('dialog', { name: 'Reset match score?' })).toBeVisible();
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

test('To-Do List supports task CRUD, filters, and persistence', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'To-Do List', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'To-Do List', exact: true })).toBeVisible();
  await expect(page.locator('.project-live')).toBeVisible();

  await page.getByPlaceholder('Example: publish project update').fill('Prepare LinkedIn post');
  await page.getByPlaceholder('Add a short note or context').fill('Mention the new Angular To-Do List.');
  await page.getByLabel('Priority').selectOption('high');
  await page.getByRole('button', { name: 'Add task' }).click();

  await expect(page.getByRole('heading', { name: 'Prepare LinkedIn post' })).toBeVisible();
  await expect(page.locator('.priority.high').first()).toBeVisible();

  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.getByPlaceholder('Example: publish project update').fill('Prepare portfolio update');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('heading', { name: 'Prepare portfolio update' })).toBeVisible();

  await page.getByRole('button', { name: 'Mark task done' }).first().click();
  await page.getByRole('button', { name: 'Completed' }).click();
  await expect(page.getByRole('heading', { name: 'Prepare portfolio update' })).toBeVisible();

  await expect.poll(async () => page.evaluate(() => localStorage.getItem('projects-hub-todo-list'))).toContain(
    'Prepare portfolio update'
  );

  await page.getByRole('button', { name: 'Delete' }).first().click();
  await expect(page.getByRole('heading', { name: 'Prepare portfolio update' })).toBeHidden();
});

test('Expense Tracker supports entries, filters, chart, and persistence', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Expense Tracker', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Expense Tracker', exact: true })).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
  expect(await page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => canvas.width > 0 && canvas.height > 0)).toBe(
    true
  );

  await page.getByPlaceholder('Example: lunch, salary, course').fill('Client invoice');
  await page.getByLabel('Type').selectOption('income');
  await page.getByLabel('Amount').fill('450');
  await page.getByRole('button', { name: 'Add entry' }).click();

  await expect(page.getByRole('heading', { name: 'Client invoice' })).toBeVisible();
  await expect(page.getByText('€1,070.00')).toBeVisible();

  await page.getByRole('button', { name: 'Income' }).click();
  await expect(page.getByRole('heading', { name: 'Client invoice' })).toBeVisible();

  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.getByPlaceholder('Example: lunch, salary, course').fill('Client invoice paid');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('heading', { name: 'Client invoice paid' })).toBeVisible();

  await expect.poll(async () => page.evaluate(() => localStorage.getItem('projects-hub-expense-tracker'))).toContain(
    'Client invoice paid'
  );
});

test('Technical Documentation filters architecture guidance', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Technical Documentation', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Technical Documentation', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Application architecture' })).toBeVisible();

  await page.getByPlaceholder('Search architecture, i18n, tests, or files').fill('i18n');
  await expect(page.getByRole('button', { name: /Translations/ })).toBeVisible();
  await expect(page.getByText('src/assets/i18n/en.json')).toBeVisible();

  await page.getByPlaceholder('Search architecture, i18n, tests, or files').fill('no-match');
  await expect(page.getByText('No documentation sections found')).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.getByRole('heading', { name: 'Application architecture' })).toBeVisible();
});

test('Project Planner supports creation, selection, and lane movement', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('projects-hub-language', 'en'));
  await page.goto('/admin/projects/project-planner');

  await expect(page.getByRole('heading', { name: 'Project Planner', exact: true })).toBeVisible();
  await expect(page.getByText('Active projects')).toBeVisible();
  await expect(page.getByText('Finished projects')).toBeVisible();

  await page.locator('#planner-title').fill('Migrate sidebar tree');
  await page.locator('#planner-description').fill('Convert the legacy navigation into grouped Angular state.');
  await page.getByRole('button', { name: 'Add project' }).click();

  const createdCard = page.locator('.planner-card').filter({ hasText: 'Migrate sidebar tree' });
  await expect(createdCard).toBeVisible();
  await expect(page.getByText('Project details')).toBeVisible();
  await expect(page.locator('.planner-info').getByRole('heading', { name: 'Migrate sidebar tree' })).toBeVisible();

  await createdCard.getByRole('button', { name: 'Finish' }).click();
  await expect(page.locator('.lane-finished').filter({ hasText: 'Migrate sidebar tree' })).toBeVisible();

  await page
    .locator('.lane-finished .planner-card')
    .filter({ hasText: 'Migrate sidebar tree' })
    .getByRole('button', { name: 'Activate' })
    .click();
  await expect(page.locator('.lane-active').filter({ hasText: 'Migrate sidebar tree' })).toBeVisible();

  await page.locator('#planner-title').fill('');
  await page.getByRole('button', { name: 'Add project' }).click();
  await expect(page.getByText('Project title is required.')).toBeVisible();
});

test('Odd Even supports manual generation and reset', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('projects-hub-language', 'en'));
  await page.goto('/admin/projects/odd-even');

  await expect(page.getByRole('heading', { name: 'Odd/Even Counter', exact: true })).toBeVisible();
  await expect(page.getByText('No odd numbers yet.')).toBeVisible();
  await expect(page.getByText('No even numbers yet.')).toBeVisible();

  await page.getByRole('button', { name: 'Step' }).click();
  await page.getByRole('button', { name: 'Step' }).click();
  await page.getByRole('button', { name: 'Step' }).click();

  await expect(page.getByText('Odd - 1')).toBeVisible();
  await expect(page.getByText('Even - 2')).toBeVisible();
  await expect(page.getByText('Odd - 3')).toBeVisible();
  await expect(page.locator('.stats-grid article').first().locator('strong')).toHaveText('3');

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByText('No odd numbers yet.')).toBeVisible();
  await expect(page.getByText('No even numbers yet.')).toBeVisible();
});

test('Dev Logger supports validated CRUD and filtering', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('projects-hub-language', 'en'));
  await page.goto('/admin/projects/dev-logger');

  await expect(page.getByRole('heading', { name: 'Dev Logger', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'New log' })).toBeVisible();

  await page.getByRole('button', { name: 'Add log' }).click();
  await expect(page.getByText('Log text is required.')).toBeVisible();

  await page.getByPlaceholder('Example: validate migration output').fill('Review logger migration');
  await page.locator('#dev-log-level').selectOption('warning');
  await page.getByRole('button', { name: 'Add log' }).click();
  await expect(page.getByText('Review logger migration')).toBeVisible();

  await page.getByPlaceholder('Search logs or levels').fill('legacy');
  await expect(page.getByText('Legacy service dependency removed from migrated logger.')).toBeVisible();
  await expect(page.getByText('Review logger migration')).toBeHidden();

  await page.getByPlaceholder('Search logs or levels').fill('');
  await page.getByRole('button', { name: 'Warnings' }).click();
  await expect(page.getByText('Review logger migration')).toBeVisible();
  await expect(page.getByText('Initial Angular migration review completed.')).toBeHidden();
});

test('Movie Search supports search, pagination, selection, and retry state', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Movie Search', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Movie Search', exact: true })).toBeVisible();
  await expect(page.locator('.movie-card')).toHaveCount(4);

  await page.getByPlaceholder('Search title, director, or cast').fill('orbit');
  await expect(page.getByRole('button', { name: /Orbit Nine/ })).toBeVisible();
  await expect(page.getByText('Selected movie')).toBeVisible();

  await page.getByPlaceholder('Search title, director, or cast').fill('');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('button', { name: /Harbor Code/ })).toBeVisible();

  await page.getByRole('button', { name: 'Test error' }).click();
  await expect(page.getByRole('heading', { name: 'Movie data unavailable' })).toBeVisible();
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByRole('heading', { name: 'Movie data unavailable' })).toBeHidden();
  await expect(page.locator('.movie-card')).toHaveCount(4);
});

test('REST Countries supports search, region filters, favorites, and retry state', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'REST Countries', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'REST Countries', exact: true })).toBeVisible();
  await expect(page.locator('.country-card')).toHaveCount(8);

  await page.getByPlaceholder('Search country, capital, or code').fill('tokyo');
  await expect(page.getByRole('button', { name: /Japan/ })).toBeVisible();
  await expect(page.getByText('Japanese yen')).toBeVisible();

  await page.getByRole('button', { name: 'Add favorite' }).click();
  await expect(page.getByRole('button', { name: 'Remove favorite' })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('projects-hub-rest-countries-favorites'))).toContain(
    'JPN'
  );

  await page.getByPlaceholder('Search country, capital, or code').fill('');
  await page.getByLabel('Region').selectOption('africa');
  await expect(page.locator('.country-card')).toHaveCount(2);

  await page.getByRole('button', { name: 'Test error' }).click();
  await expect(page.getByRole('heading', { name: 'Country data unavailable' })).toBeVisible();
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByRole('heading', { name: 'Country data unavailable' })).toBeHidden();
});

test('Currency Converter supports validation, swap, stale, and retry state', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Currency Converter', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Currency Converter', exact: true })).toBeVisible();
  await expect(page.locator('.conversion-result > strong')).toHaveText('MKD\u00a07,688');

  await page.getByLabel('Amount').fill('10');
  await page.getByLabel('To').selectOption('USD');
  await expect(page.locator('.conversion-result > strong')).toHaveText('$10.80');

  await page.getByRole('button', { name: 'Swap' }).click();
  await expect(page.getByText('1 USD =')).toBeVisible();

  await page.getByLabel('Amount').fill('0');
  await expect(page.getByText('Enter an amount greater than zero.')).toBeVisible();

  await page.getByRole('button', { name: 'Mark stale' }).click();
  await expect(page.locator('.rate-grid article.stale strong')).toHaveText('Stale');

  await page.getByRole('button', { name: 'Test error' }).click();
  await expect(page.getByRole('heading', { name: 'Exchange rates unavailable' })).toBeVisible();
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByRole('heading', { name: 'Exchange rates unavailable' })).toBeHidden();
});

test('Quotes API supports typewriter quotes, favorites, and retry state', async ({ page }) => {
  await page.addInitScript(() => {
    window.matchMedia = () =>
      ({
        addEventListener: () => undefined,
        addListener: () => undefined,
        dispatchEvent: () => false,
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        removeEventListener: () => undefined,
        removeListener: () => undefined
      }) as MediaQueryList;
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Quotes API', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Quotes API', exact: true })).toBeVisible();
  await expect(page.locator('blockquote span')).not.toBeEmpty();

  await page.getByRole('button', { name: 'Add favorite' }).click();
  await expect(page.getByRole('button', { name: 'Remove favorite' })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('projects-hub-quotes-api-favorites'))).toContain('[');

  const firstQuote = await page.locator('blockquote span').innerText();
  await page.getByRole('button', { name: 'Next quote' }).click();
  await expect.poll(async () => page.locator('blockquote span').innerText()).not.toBe(firstQuote);

  await page.getByRole('button', { name: 'Test error' }).click();
  await expect(page.getByRole('heading', { name: 'Quotes unavailable' })).toBeVisible();
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByRole('heading', { name: 'Quotes unavailable' })).toBeHidden();
});

test('Sticky Notes supports create, search, pin, edit, delete, and persistence', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Sticky Notes', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Sticky Notes', exact: true })).toBeVisible();
  await expect(page.locator('.note-card')).toHaveCount(3);

  await page.getByPlaceholder('Example: portfolio idea').fill('Portfolio checklist');
  await page.getByPlaceholder('Add a short note or reminder').fill('Add the unique sticky marker to the portfolio notes.');
  await page.getByRole('button', { name: 'Rose note' }).click();
  await page.getByRole('button', { name: 'Add note' }).click();

  await expect(page.getByRole('heading', { name: 'Portfolio checklist' })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('projects-hub-sticky-notes'))).toContain(
    'Portfolio checklist'
  );

  await page.getByPlaceholder('Search notes').fill('unique sticky marker');
  await expect(page.locator('.note-card')).toHaveCount(1);

  await page.getByRole('button', { name: 'Pin' }).click();
  await expect(page.getByRole('button', { name: 'Unpin' })).toBeVisible();

  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByPlaceholder('Example: portfolio idea').fill('Updated portfolio checklist');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('heading', { name: 'Updated portfolio checklist' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('heading', { name: 'Updated portfolio checklist' })).toBeHidden();
});

test('Grocery List supports quantities, categories, filters, and persistence', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Grocery List', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Grocery List', exact: true })).toBeVisible();
  await expect(page.locator('.grocery-item')).toHaveCount(3);

  await page.getByPlaceholder('Example: coffee beans').fill('Almond milk');
  await page.getByLabel('Quantity').fill('3');
  await page.getByLabel('Category').first().selectOption('dairy');
  await page.getByRole('button', { name: 'Add item' }).click();

  await expect(page.getByRole('heading', { name: 'Almond milk' })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('projects-hub-grocery-list'))).toContain(
    'Almond milk'
  );

  await page.getByLabel('Grocery filters').getByRole('button', { name: 'Active' }).click();
  await expect(page.getByRole('heading', { name: 'Almond milk' })).toBeVisible();

  await page.getByLabel('Category').nth(1).selectOption('dairy');
  await expect(page.locator('.grocery-item')).toHaveCount(2);

  await page.getByRole('button', { name: 'Mark item purchased' }).first().click();
  await page.getByLabel('Grocery filters').getByRole('button', { name: 'Purchased', exact: true }).click();
  await expect(page.locator('.grocery-item.purchased')).toHaveCount(1);

  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.getByPlaceholder('Example: coffee beans').fill('Updated almond milk');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('heading', { name: 'Updated almond milk' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete' }).first().click();
  await expect(page.getByRole('heading', { name: 'Updated almond milk' })).toBeHidden();
});

test('Recipe Book supports recipe selection, creation, and shopping transfer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Recipe Book', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Recipe Book', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Summer Pasta' })).toBeVisible();

  await page.getByPlaceholder('Search recipes or categories').fill('chicken');
  await page.getByRole('button', { name: /Chicken Rice Bowl/ }).click();
  await expect(page.getByRole('heading', { name: 'Chicken Rice Bowl' })).toBeVisible();

  await page.getByRole('button', { name: 'Add ingredients' }).click();
  await expect(page.locator('.shopping-list strong').filter({ hasText: 'Chicken breast' })).toBeVisible();

  await page.getByPlaceholder('Example: herb omelette').fill('Herb Omelette');
  await page.getByPlaceholder('Short recipe context').fill('Fast breakfast recipe with herbs.');
  await page.getByPlaceholder('Example: tomatoes').fill('Eggs');
  await page.getByRole('button', { name: 'Add recipe' }).click();
  await expect(page.getByRole('heading', { name: 'Herb Omelette' })).toBeVisible();
});

test('Flashcards supports reveal, deck creation, review, and persistence', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Flashcards', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Flashcards', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Flashcard review' })).toBeVisible();

  await page.getByRole('button', { name: 'Reveal answer' }).click();
  await expect(page.locator('.study-card .answer-panel').getByText('A signal stores reactive state')).toBeVisible();
  await page.getByRole('button', { name: 'Known' }).click();
  await expect(page.getByText('1 / 1')).toBeVisible();

  await page.getByPlaceholder('Example: Angular').fill('Portfolio');
  await page.getByPlaceholder('Example: What is a signal?').fill('What keeps this demo persistent?');
  await page.getByPlaceholder('Short answer or explanation').fill('LocalStorage keeps cards available after reloads.');
  await page.getByRole('button', { name: 'Add card' }).click();

  await expect(page.getByRole('button', { name: 'Portfolio' })).toBeVisible();
  await expect(page.locator('.card-list').getByRole('heading', { name: 'What keeps this demo persistent?' })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('projects-hub-flashcards'))).toContain(
    'What keeps this demo persistent?'
  );
});

test('Timer supports custom countdown, pause, resume, completion, and persistence', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Timer', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Timer', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Focus timer' })).toBeVisible();

  await page.getByLabel('Minutes').fill('0');
  await page.getByLabel('Seconds').fill('3');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.locator('output')).toHaveText('00:03');
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('projects-hub-timer'))).toContain(
    '"selectedSeconds":3'
  );

  const timerActions = page.locator('.timer-actions');

  await timerActions.getByRole('button', { name: /Start$/ }).click();
  await expect.poll(async () => page.locator('output').innerText()).toBe('00:02');
  await timerActions.getByRole('button', { name: /Pause$/ }).click();
  const pausedTime = await page.locator('output').innerText();
  await page.waitForTimeout(1200);
  await expect(page.locator('output')).toHaveText(pausedTime);

  await timerActions.getByRole('button', { name: /Resume$/ }).click();
  await expect(page.getByText('Timer complete')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Completed').first()).toBeVisible();
});

test('Digital Clock supports timezone, 12-hour mode, refresh, and persistence', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Digital Clock', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Digital Clock', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Current time' })).toBeVisible();
  await expect(page.locator('output')).toHaveText(/\d{2}:\d{2}:\d{2}/);

  await page.getByRole('button', { name: '12-hour' }).click();
  await expect(page.getByText('12-hour').first()).toBeVisible();

  await page.getByLabel('Timezone').selectOption('Asia/Tokyo');
  await expect(page.getByText('Tokyo').first()).toBeVisible();
  await page.getByRole('button', { name: 'Refresh' }).click();

  await expect.poll(async () => page.evaluate(() => localStorage.getItem('projects-hub-digital-clock'))).toContain(
    '"timezone":"Asia/Tokyo"'
  );
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('projects-hub-digital-clock'))).toContain('"mode":"12"');
});

test('Tip Calculator supports split totals, validation, presets, and reset', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Tip Calculator', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Tip Calculator', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Payment split' })).toBeVisible();
  await expect(page.locator('output')).toHaveText('$49.86');

  await page.getByPlaceholder('Example: 84.50').fill('120');
  await page.getByRole('button', { name: /20%/ }).click();
  await page.getByPlaceholder('Example: 2').fill('3');

  await expect(page.locator('output')).toHaveText('$48.00');
  await expect(page.getByText('Tip total').locator('..').getByText('$24.00')).toBeVisible();
  await expect(page.getByText('Tip / person').locator('..').getByText('$8.00')).toBeVisible();

  await page.getByPlaceholder('Example: 84.50').fill('0');
  await expect(page.getByText('Enter a bill amount greater than zero.')).toBeVisible();
  await expect(page.locator('output')).toHaveText('$0.00');

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('output')).toHaveText('$49.86');
});

test('Memory Game supports difficulty, matching, completion, and reset', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Memory Game', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Memory Game', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Find every pair' })).toBeVisible();
  await expect(page.locator('.memory-card')).toHaveCount(16);

  await page.getByRole('button', { name: 'Fruits' }).click();
  await expect(page.getByRole('dialog', { name: 'Restart this round?' })).toBeVisible();
  await expect(page.getByText('Changing the card set will start a new round and reset the timer.')).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('.memory-card[data-pair="apple"]')).toHaveCount(0);

  await page.getByRole('button', { name: 'Fruits' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.locator('.memory-card[data-pair="apple"]')).toHaveCount(2);

  await page.getByRole('button', { name: 'Mixed' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.locator('.memory-card[data-pair="red-car"]')).toHaveCount(2);

  await page.getByRole('button', { name: 'Letters' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByRole('button', { name: /12 Easy/ }).click();
  await expect(page.locator('.memory-card')).toHaveCount(12);

  const easyPairs = ['angular', 'typescript', 'forms', 'signals', 'routes', 'tests'];

  for (const pair of easyPairs) {
    const pairCards = page.locator(`.memory-card[data-pair="${pair}"]`);
    await pairCards.nth(0).click();
    await pairCards.nth(1).click();
  }

  await expect(page.getByText('Board complete')).toBeVisible();
  await expect(page.getByText('6 / 6')).toBeVisible();
  await expect(page.getByText('6').first()).toBeVisible();

  await page.getByRole('button', { name: 'New round' }).click();
  await expect(page.getByText('Board complete')).toBeHidden();
  await expect(page.locator('.memory-card.matched')).toHaveCount(0);
});

test('Math 4 Kids supports operations, scoring, feedback, and restart', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Math 4 Kids', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Math 4 Kids', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Solve the problem' })).toBeVisible();
  await expect(page.locator('.problem-line strong').nth(0)).toHaveText('5');
  await expect(page.locator('.problem-line b').nth(0)).toHaveText('+');
  await expect(page.locator('.problem-line strong').nth(1)).toHaveText('7');

  await page.getByPlaceholder('Type the result').fill('12');
  await page.getByRole('button', { name: 'Check' }).click();
  await expect(page.getByText('Correct. A new problem is ready.')).toBeVisible();
  await expect(page.getByText('1 / 1')).toBeVisible();

  await page.getByPlaceholder('Type the result').fill('999');
  await page.getByRole('button', { name: 'Check' }).click();
  await expect(page.getByText('Not quite. The correct answer is 6.')).toBeVisible();
  await expect(page.getByText('1 / 2')).toBeVisible();

  await page.getByRole('button', { name: 'Multiplication' }).click();
  await expect(page.locator('.problem-line strong').nth(0)).toHaveText('3');
  await expect(page.locator('.problem-line b').nth(0)).toHaveText('x');
  await expect(page.locator('.problem-line strong').nth(1)).toHaveText('1');
  await expect(page.getByText('0 / 0')).toBeVisible();

  await page.getByRole('button', { name: 'Challenge' }).click();
  await expect(page.getByRole('button', { name: /50 Challenge/ })).toHaveClass(/active/);

  await page.getByRole('button', { name: 'Restart' }).click();
  await expect(page.getByText('Round 1')).toBeVisible();
  await expect(page.getByText('0 / 0')).toBeVisible();
});

test('Music Player supports playlist search, playback state, favorites, and external link', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Music Player', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Music Player', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Current track' })).toBeVisible();
  await expect(page.locator('.now-playing')).toContainText('Midnight Focus');
  await expect(page.getByText('Paused')).toBeVisible();

  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.getByText('Playing')).toBeVisible();

  await page.getByPlaceholder('Search title, artist, or mood').fill('coding');
  await expect(page.getByText('Quiet Code')).toBeVisible();
  await expect(page.getByText('Sunrise Drive')).toBeHidden();

  await page.getByText('Quiet Code').click();
  await expect(page.locator('.now-playing')).toContainText('Quiet Code');

  await page.locator('.track-row.active .favorite-button').click();
  await expect(page.getByText('1 favorite track(s) saved locally.')).toBeVisible();

  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.getByText('Sunrise Drive')).toBeVisible();

  await expect(page.getByRole('link', { name: 'Open on YouTube' })).toHaveAttribute('target', '_blank');
});

test('Photo Book supports gallery filtering, view switching, slider, and keyboard navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Photo Book', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Photo Book', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Photo detail' })).toBeVisible();
  await expect(page.locator('.hero-photo')).toContainText('Mountain Light');
  await expect(page.getByText('7 / 7')).toBeVisible();

  await page.locator('.category-grid').getByRole('button', { name: 'City', exact: true }).click();
  await expect(page.getByText('2 / 7')).toBeVisible();
  await expect(page.locator('.hero-photo')).toContainText('Old Bazaar Walk');

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('.hero-photo')).toContainText('Stone Bridge');

  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('.hero-photo')).toContainText('Old Bazaar Walk');

  await page.getByRole('button', { name: 'Start slideshow' }).click();
  await expect(page.getByRole('button', { name: 'Stop slideshow' })).toBeVisible();
  await page.getByRole('button', { name: 'Stop slideshow' }).click();
  await expect(page.getByRole('button', { name: 'Start slideshow' })).toBeVisible();

  await page.locator('.category-grid').getByRole('button', { name: 'People', exact: true }).click();
  await expect(page.getByText('1 / 7')).toBeVisible();
  await expect(page.locator('.hero-photo')).toContainText('Macedonia Basketball 2011');

  await page.locator('.category-grid').getByRole('button', { name: 'All', exact: true }).click();
  await page.getByPlaceholder('Search title, location, or category').fill('center');
  await expect(page.locator('.hero-photo')).toContainText('Stone Bridge');

  await page.getByRole('button', { name: /List/ }).click();
  await expect(page.locator('.photo-list')).toHaveClass(/list/);

  await page.getByPlaceholder('Search title, location, or category').fill('missing');
  await expect(page.getByText('No photos found')).toBeVisible();

  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.getByText('7 / 7')).toBeVisible();
});

test('Client Panel supports local client CRUD workflow', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('projects-hub-client-panel'));
  await page.reload();
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Client Panel', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Client Panel', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Client overview' })).toBeVisible();

  await page.getByRole('button', { name: 'Review' }).click();
  await expect(page.locator('.client-table-row').filter({ hasText: 'Marko Stojanov' })).toBeVisible();
  await expect(page.locator('.client-table-row').filter({ hasText: 'Ana Petrova' })).toBeHidden();
  await page.getByRole('button', { name: 'All' }).click();

  await page.getByPlaceholder('Search name, email, phone, or status').fill('zzzz');
  await expect(page.locator('.client-overview').getByText('No clients match this view')).toBeVisible();
  await page.locator('.client-overview').getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.client-table-row').filter({ hasText: 'Ana Petrova' })).toBeVisible();

  await page.locator('.client-table-row').filter({ hasText: 'Ana Petrova' }).click();
  await expect(page.getByRole('heading', { name: 'Ana Petrova' })).toBeVisible();

  await page.getByRole('button', { name: 'List' }).click();
  await expect(page.getByRole('heading', { name: 'Client overview' })).toBeVisible();
  await page.locator('.client-table-row').filter({ hasText: 'Ana Petrova' }).click();
  await expect(page.getByRole('heading', { name: 'Ana Petrova' })).toBeVisible();

  await page.getByRole('button', { name: 'Add client' }).click();
  await page.locator('input[name="firstName"]').fill('Sara');
  await page.locator('input[name="lastName"]').fill('Ilievska');
  await page.locator('input[name="email"]').fill('sara@example.com');
  await page.locator('input[name="phone"]').fill('+389 71 111 222');
  await page.locator('input[name="balance"]').fill('300');
  await page.getByRole('button', { name: 'Save client' }).click();

  await expect(page.getByRole('heading', { name: 'Sara Ilievska' })).toBeVisible();

  await page.getByRole('button', { name: 'Edit' }).click();
  await page.locator('input[name="balance"]').fill('950');
  await page.getByRole('button', { name: 'Save client' }).click();
  await expect(page.locator('.detail-grid')).toContainText('$950');

  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('dialog', { name: 'Delete client?' })).toBeVisible();
  await page.getByRole('dialog', { name: 'Delete client?' }).getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('heading', { name: 'Sara Ilievska' })).toBeHidden();

  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('.client-table-row').filter({ hasText: 'Ana Petrova' })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('heading', { name: 'Client overview' })).toBeVisible();
  const hasClientPanelOverflow = await page.locator('.client-panel-page').evaluate((element) => {
    return element.scrollWidth > element.clientWidth + 1;
  });
  expect(hasClientPanelOverflow).toBe(false);
});

test('Chat App supports room search, sending, offline state, and persistence', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('projects-hub-chat-app'));
  await page.reload();
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Chat App', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Chat App', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Rooms' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Product Team' })).toBeVisible();

  await page.getByPlaceholder('Search rooms or topics').fill('support');
  await expect(page.getByRole('button', { name: /Support Desk/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Product Team/ })).toBeHidden();

  await page.getByRole('button', { name: /Support Desk/ }).click();
  await expect(page.getByRole('heading', { name: 'Support Desk' })).toBeVisible();

  await page.getByPlaceholder('Write a message for this room').fill('Local chat demo is working.');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('.message-bubble.mine').filter({ hasText: 'Local chat demo is working.' })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('projects-hub-chat-app'))).toContain(
    'Local chat demo is working.'
  );

  await page.getByRole('button', { name: 'Online demo' }).click();
  await expect(page.getByRole('button', { name: 'Offline demo' })).toBeVisible();
  await page.getByPlaceholder('Write a message for this room').fill('Should not send while offline.');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('Turn the demo connection online before sending.')).toBeVisible();

  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.getByRole('button', { name: /Product Team/ })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.chat-page')).toBeVisible();
  const hasChatOverflow = await page.locator('.chat-page').evaluate((element) => {
    return element.scrollWidth > element.clientWidth + 1;
  });
  expect(hasChatOverflow).toBe(false);
});

test('Chat App stays visually stable across themes and mobile layout', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 820 });
  await page.goto('/');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('link', { name: 'Chat App', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Chat App', exact: true })).toBeVisible();
  await expect(page.locator('.chat-shell')).toBeVisible();

  const themes = [
    { label: 'Realm', value: 'realm' },
    { label: 'White', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Blue', value: 'blue' }
  ];

  for (const theme of themes) {
    await page.getByRole('button', { name: new RegExp(theme.label) }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme.value);
    await expect(page.locator('.room-panel')).toBeVisible();
    await expect(page.locator('.conversation')).toBeVisible();
    await expect(page.locator('.message-bubble').first()).toBeVisible();

    const metrics = await page.locator('.chat-page').evaluate((element) => ({
      bodyOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      pageOverflowX: element.scrollWidth - element.clientWidth,
      roomRowHeights: Array.from(element.querySelectorAll('.room-row')).map((row) =>
        Math.round((row as HTMLElement).getBoundingClientRect().height)
      ),
      searchHeight: Math.round((element.querySelector('.search-field') as HTMLElement).getBoundingClientRect().height),
      shellHeight: element.querySelector('.chat-shell')?.clientHeight ?? 0,
      shellScrollHeight: element.querySelector('.chat-shell')?.scrollHeight ?? 0
    }));

    expect(metrics.bodyOverflowX).toBeLessThanOrEqual(1);
    expect(metrics.pageOverflowX).toBeLessThanOrEqual(1);
    expect(metrics.searchHeight).toBeLessThanOrEqual(100);
    expect(Math.max(...metrics.roomRowHeights)).toBeLessThanOrEqual(96);
    expect(Math.max(...metrics.roomRowHeights) - Math.min(...metrics.roomRowHeights)).toBeLessThanOrEqual(8);
    expect(metrics.shellScrollHeight).toBeLessThanOrEqual(metrics.shellHeight + 1);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.chat-shell')).toBeVisible();

  const mobileMetrics = await page.locator('.chat-page').evaluate((element) => ({
    bodyOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    pageOverflowX: element.scrollWidth - element.clientWidth,
    shellColumns: getComputedStyle(element.querySelector('.chat-shell') as HTMLElement).gridTemplateColumns,
    sendButtonWidth: (element.querySelector('.message-form .btn') as HTMLElement).getBoundingClientRect().width,
    formContentWidth: (() => {
      const form = element.querySelector('.message-form') as HTMLElement;
      const styles = getComputedStyle(form);
      return form.clientWidth - Number.parseFloat(styles.paddingLeft) - Number.parseFloat(styles.paddingRight);
    })()
  }));

  expect(mobileMetrics.bodyOverflowX).toBeLessThanOrEqual(1);
  expect(mobileMetrics.pageOverflowX).toBeLessThanOrEqual(1);
  expect(mobileMetrics.shellColumns.split(' ').length).toBe(1);
  expect(mobileMetrics.sendButtonWidth).toBeGreaterThan(mobileMetrics.formContentWidth - 2);
});
