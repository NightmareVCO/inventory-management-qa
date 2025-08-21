import path from 'node:path';
import { expect, test as setup } from '@playwright/test';

const NO_PERM_FILE = path.join(
	__dirname,
	'../playwright/.auth/user-no-perm.json',
);

const LOGIN_PAGE = process.env.NEXT_KEYCLOAK_LOGIN_ID;

setup('authenticate as user without permission', async ({ page }) => {
	await page.goto(LOGIN_PAGE);

	await page.fill(
		'input#username',
		process.env.PUBLIC_KEYCLOAK_USER_NO_ROLE ?? '',
	);
	await page.fill(
		'input#password',
		process.env.PUBLIC_KEYCLOAK_USER_NO_ROLE ?? '',
	);

	await page.click('button[type="submit"]');
	await page.waitForURL('http://localhost:3000/');

	await expect(page.locator('button:has-text("Welcome")')).toBeVisible();

	await page.context().storageState({ path: NO_PERM_FILE, indexedDB: true });
});
