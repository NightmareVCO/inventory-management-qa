import path from 'node:path';
import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(__dirname, '../../.env.local'),
});

const URL = process.env.PUBLIC_FRONTEND_URL;
if (!URL) throw new Error('Missing environment variables');

const EMPLOYEE_STATE = path.resolve(
  __dirname,
  '../../playwright/.auth/employee.json',
);

test.describe('Stock Page Low-Stock Behavior', () => {
  test.use({ storageState: EMPLOYEE_STATE });

  test('shows low-stock toast when stock dips below threshold', async ({ page }) => {
    await page.goto(`${URL}/inventory`, { waitUntil: 'load' });

    await page.getByRole('button', { name: /add product/i }).click();
    const dlg = page.getByRole('dialog', { name: /add new product/i });
    await dlg.getByLabel('Product Name*').fill('Test Product Employee');
    await dlg.getByLabel('Description*').fill('Test Description Employee');
    await dlg.getByLabel('Category*').selectOption('ELECTRONICS');
    await dlg.getByLabel('Price*').fill('9.99');
    await dlg.getByLabel('Quantity*').fill('9');
    await dlg.getByLabel('Min Stock*').fill('10');
    await dlg.getByRole('button', { name: /create product/i }).click();
    await page.getByRole('alert').waitFor({ state: 'visible' });

    await page.goto(`${URL}/stock`, { waitUntil: 'load' });
    await page.waitForURL('**/stock');

    const cards = page.locator('div', {
      hasText: 'Test Product Employee',
      has: page.getByRole('button', { name: '+' })
    });

    const card = cards.first();
    await expect(card).toBeVisible();

    const plus = card.getByRole('button', { name: '+' }).first();
    const minus = card.getByRole('button', { name: '-' }).first();
    await plus.click();
    await plus.click();
    await minus.click();
    await minus.click();

    const toast = page.locator('div.chakra-alert', {
      hasText: /Low Stock on Test Product Employee/i
    });
    await expect(toast).toBeVisible();
  });

  test('notification menu contains low-stock alert', async ({ page }) => {
    await page.goto(`${URL}/stock`, { waitUntil: 'load' });

    const cards = page.locator('div', {
      hasText: 'Test Product Employee',
      has: page.getByRole('button', { name: '+' })
    });

    const card = cards.first();
    await expect(card).toBeVisible();

    const plus = card.getByRole('button', { name: '+' }).first();
    const minus = card.getByRole('button', { name: '-' }).first();
    await plus.click();
    await plus.click();
    await minus.click();
    await minus.click();

    await page.getByRole('button', { name: /notifications?/i }).click();
    const menuItem = page
      .getByRole('menuitem')
      .filter({ hasText: /Test Product Employee.*is low on stock/i });
    await expect(menuItem).toBeVisible();
  });
});