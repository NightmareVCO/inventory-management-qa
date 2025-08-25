import fs from 'node:fs';
import path from 'node:path';
import { expect, test as setup } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({
	path: path.resolve(__dirname, '../../.env.local'),
	debug: false,
	quiet: true
});

const PERM_FILE = path.join(__dirname, '../../playwright/.auth/employee.json');

const LOGIN_PAGE = process.env.NEXT_KEYCLOAK_LOGIN_ID;
const USERNAME = process.env.PUBLIC_KEYCLOAK_EMPLOYEE_USERNAME;
const PASSWORD = process.env.PUBLIC_KEYCLOAK_EMPLOYEE_PASSWORD;
const URL = process.env.PUBLIC_FRONTEND_URL;

if (!LOGIN_PAGE || !USERNAME || !PASSWORD || !URL) {
	throw new Error('Missing environment variables for Keycloak authentication');
}

setup('authenticate as user with employee permission', async ({ page }) => {
	await page.goto(LOGIN_PAGE);

	await page.fill('input#username', USERNAME);
	await page.fill('input#password', PASSWORD);

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
