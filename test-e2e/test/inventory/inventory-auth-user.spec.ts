import { expect, test } from '@playwright/test';
import { URL } from '../../constants';

test.describe('Inventory Page for Normal User', () => {
	test.beforeEach(async ({ page }) => {
		if (!URL) {
			throw new Error('Missing environment variables');
		}

		await page.goto(`${URL}/inventory`, {
			waitUntil: 'load',
		});

		const table = page.getByRole('table');
		await expect(table.getByRole('caption')).toHaveText(/inventory products/i);
	});

	test('should not allow adding products for normal users ', async ({
		page,
	}) => {
		const addButton = page.getByRole('button', { name: /add product/i });
		await expect(addButton).toBeVisible();
		await expect(addButton).toBeDisabled();
	});

	test('should not allow editing products for normal users', async ({
		page,
	}) => {
		const editButton = page.getByRole('button', { name: /edit/i });
		await expect(editButton.first()).toBeVisible();
		await expect(editButton.first()).toBeDisabled();
	});

	test('should not allow deleting products for normal users', async ({
		page,
	}) => {
		const deleteButton = page.getByRole('button', { name: /delete product/i });
		await expect(deleteButton.first()).toBeVisible();
		await expect(deleteButton.first()).toBeDisabled();
	});
});
