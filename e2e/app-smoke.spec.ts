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
  await expect(page.getByText('5 project(s)')).toBeVisible();

  await page.getByRole('button', { name: /Detailed/ }).click();
  await expect(page.getByText('Difficulty').first()).toBeVisible();

  await page.getByRole('button', { name: /List/ }).click();
  await expect(page.getByRole('button', { name: /List/ })).toHaveClass(/active/);

  await page.getByRole('link', { name: 'Calculator', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Interactive Calculator' })).toBeVisible();

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
