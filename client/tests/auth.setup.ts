import path from 'node:path';
import { expect, test as setup } from '@playwright/test';

const PERM_FILE = path.join(__dirname, '../playwright/.auth/user.json');

const LOGIN_PAGE = process.env.NEXT_KEYCLOAK_LOGIN_ID;

setup('authenticate with Keycloak', async ({ page }) => {
	await page.goto(LOGIN_PAGE);

	await page.fill('input#username', process.env.PUBLIC_KEYCLOAK_USER ?? '');
	await page.fill('input#password', process.env.PUBLIC_KEYCLOAK_PASSWORD ?? '');

	await page.click('button[type="submit"]');
	await page.waitForURL('http://localhost:3000/');
	await expect(
		page.locator('button:has-text("Go to Inventory")'),
	).toBeVisible();

	await page.context().storageState({ path: PERM_FILE });
});
