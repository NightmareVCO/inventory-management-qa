import fs from 'node:fs';
import path from 'node:path';
import { expect, test as setup } from '@playwright/test';
import {
	LOGIN_PAGE,
	PASSWORD_ADMIN,
	URL,
	USERNAME_ADMIN,
} from '../../constants';

const PERM_FILE = path.join(__dirname, '../../playwright/.auth/admin.json');

setup('authenticate as user with admin permission', async ({ page }) => {
	if (!LOGIN_PAGE || !USERNAME_ADMIN || !PASSWORD_ADMIN || !URL) {
		throw new Error(
			'Missing environment variables for Keycloak authentication',
		);
	}

	await page.goto(LOGIN_PAGE);

	await page.fill('input#username', USERNAME_ADMIN);
	await page.fill('input#password', PASSWORD_ADMIN);

	await page.click('button[type="submit"]');

	await page.waitForURL(URL, {
		timeout: 60_000,
		waitUntil: 'networkidle',
	});

	const name = /go to inventory/i;
	const cta = page
		.getByRole('button', { name })
		.or(page.getByRole('link', { name }));

	await expect(cta).toBeVisible();

	const dir = path.dirname(PERM_FILE);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

	await page.context().storageState({
		path: PERM_FILE,
		indexedDB: true,
	});
});
