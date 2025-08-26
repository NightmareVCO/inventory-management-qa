import path from 'node:path';
import { expect, test } from '@playwright/test';
import { URL } from '../../constants';

if (!URL) throw new Error('Missing environment variables');

const ADMIN_STATE = path.resolve(
	__dirname,
	'../../playwright/.auth/admin.json',
);

test.describe('Stock Page Low-Stock Behavior', () => {
	test.use({ storageState: ADMIN_STATE });

	test.beforeEach(async () => {
		if (!URL) {
			throw new Error('Missing environment variables');
		}
	});

	test('shows low-stock toast when stock dips below threshold', async ({
		page,
	}) => {
		await page.goto(`${URL}/inventory`, { waitUntil: 'load' });

		await page.getByRole('button', { name: /add product/i }).click();
		const dlg = page.getByRole('dialog', { name: /add new product/i });
		await dlg.getByLabel('Product Name*').fill('Test Product Admin');
		await dlg.getByLabel('Description*').fill('Test Description Admin');
		await dlg.getByLabel('Category*').selectOption('ELECTRONICS');
		await dlg.getByLabel('Price*').fill('9.99');
		await dlg.getByLabel('Quantity*').fill('9');
		await dlg.getByLabel('Min Stock*').fill('10');
		await dlg.getByRole('button', { name: /create product/i }).click();
		await page.getByRole('alert').waitFor({ state: 'visible' });

		await page.goto(`${URL}/stock`, { waitUntil: 'load' });
		await page.waitForURL('**/stock');

		const cards = page.locator('div', {
			hasText: 'Test Product Admin',
			has: page.getByRole('button', { name: '+' }),
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
			hasText: /Low Stock on Test Product Admin/i,
		});
		await expect(toast).toBeVisible();
	});

	test('notification menu contains low-stock alert', async ({ page }) => {
		await page.goto(`${URL}/stock`, { waitUntil: 'load' });

		const cards = page.locator('div', {
			hasText: 'Test Product Admin',
			has: page.getByRole('button', { name: '+' }),
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
			.filter({ hasText: /Test Product Admin.*is low on stock/i });
		await expect(menuItem).toBeVisible();
	});
});
