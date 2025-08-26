import path from 'node:path';
import { expect, test } from '@playwright/test';
import { URL } from '../../constants';

const EMPLOYEE_STATE = path.resolve(
	__dirname,
	'../../playwright/.auth/employee.json',
);

test.describe('Inventory Page for Employee User', () => {
	test.use({ storageState: EMPLOYEE_STATE });

	test.beforeEach(async ({ page }) => {
		if (!URL) {
			throw new Error('Missing environment variables');
		}

		await page.goto(`${URL}/inventory`, {
			waitUntil: 'load',
		});

		await page.waitForURL('**/inventory', { timeout: 10_000 });

		const table = page.getByRole('table');
		await expect(table.getByRole('caption')).toHaveText(/inventory products/i);
	});

	test('should allow adding products for employee users ', async ({ page }) => {
		const addButton = page.getByRole('button', { name: /add product/i });
		await expect(addButton).toBeVisible();
		await expect(addButton).toBeEnabled();

		await addButton.click();

		const dialog = page.getByRole('dialog', { name: /add new product/i });
		await expect(dialog).toBeVisible();

		await page.getByLabel('Product Name*').fill('Test Product Employee');
		await page.getByLabel('Description*').fill('Test Description Employee');
		await page.getByLabel('Category*').selectOption('ELECTRONICS');
		await page.getByLabel('Price*').fill('9.99');
		await page.getByLabel('Quantity*').fill('9');
		await page.getByLabel('Min Stock*').fill('10');

		await page.getByRole('button', { name: /create product/i }).click();

		const toast = page.getByRole('alert');
		await expect(toast).toBeVisible();

		await page.waitForTimeout(2_000);

		const table = page.getByRole('table');
		await expect(
			table.getByRole('row', { name: /Test Product Employee/i }),
		).toBeVisible();
	});

	test('search by product name', async ({ page }) => {
		await page
			.getByPlaceholder('Search products...')
			.fill('Test Product Employee');
		const rows = page.getByRole('row');
		await expect(rows).toHaveCount(2);
		await expect(
			page.getByRole('row', { name: /Test Product Employee/i }),
		).toBeVisible();
	});

	test('filter by min price', async ({ page }) => {
		await page.getByLabel('Min Price').fill('10');

		await expect(
			page.getByRole('row', { name: /Test Product Employee/i }),
		).toHaveCount(0);
	});

	test('filter by max price', async ({ page }) => {
		await page.getByLabel('Max Price').fill('19.99');
		await expect(
			page.getByRole('row', { name: /Test Product Employee/i }),
		).toBeVisible();
	});

	test('filter by category', async ({ page }) => {
		await page.getByLabel('Category').selectOption('ELECTRONICS');
		await expect(
			page.getByRole('row', { name: /Test Product Employee/i }),
		).toBeVisible();

		await page.getByLabel('Category').selectOption('BOOKS');
		await expect(
			page.getByRole('row', { name: /Test Product Employee/i }),
		).toHaveCount(0);
	});

	test('filter by low stock', async ({ page }) => {
		await page
			.getByRole('checkbox', { name: /low stock/i })
			.check({ force: true });
		await expect(
			page.getByRole('row', { name: /Test Product Employee/i }),
		).toHaveCount(1);
	});

	test('should allow editing products for employee users', async ({ page }) => {
		const editButton = page.getByRole('button', { name: /edit/i });
		await expect(editButton.first()).toBeVisible();
		await expect(editButton.first()).toBeEnabled();

		await editButton.first().click();
		const dialog = page.getByRole('dialog', { name: /edit product/i });
		await expect(dialog).toBeVisible();

		await expect(page.getByLabel('Product Name*')).toHaveValue(
			'Test Product Employee',
		);
		await page.getByLabel('Product Name*').fill('Test Product Employee Edited');

		await expect(page.getByLabel('Description*')).toHaveValue(
			'Test Description Employee',
		);
		await page
			.getByLabel('Description*')
			.fill('Test Description Employee Edited');

		await expect(page.getByLabel('Category*')).toHaveValue('ELECTRONICS');
		await page.getByLabel('Category*').selectOption('BOOKS');

		await expect(page.getByLabel('Price*')).toHaveValue('9.99');
		await page.getByLabel('Price*').fill('19.99');

		await expect(page.getByLabel('Quantity*')).toHaveValue('9');
		await page.getByLabel('Quantity*').fill('10');

		await expect(page.getByLabel('Minimum Stock*')).toHaveValue('10');
		await page.getByLabel('Minimum Stock*').fill('9');

		await page.getByRole('button', { name: /update product/i }).click();

		const toast = page.getByRole('alert');
		await expect(toast).toBeVisible();

		await page.waitForTimeout(2_000);

		const table = page.getByRole('table');
		await expect(
			table.getByRole('row', { name: /Test Product Employee/i }),
		).toBeVisible();
	});

	test('should not allow deleting products for employee users', async ({
		page,
	}) => {
		const deleteButton = page.getByRole('button', { name: /delete product/i });
		await expect(deleteButton.first()).toBeVisible();
		await expect(deleteButton.first()).toBeDisabled();
	});
});
