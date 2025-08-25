// playwright.config.ts
import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
	testDir: './test',
	timeout: 60_000,

	use: {
		headless: true,
		viewport: { width: 1920, height: 1080 },
		actionTimeout: 30_000,
		navigationTimeout: 60_000,
	},

	projects: [
		{
			name: 'setup-admin',
			testMatch: ['**/_setup/global-setup-admin.ts'],
		},
		{
			name: 'setup-employee',
			testMatch: ['**/_setup/global-setup-employee.ts'],
		},
		{
			name: 'setup-user',
			testMatch: ['**/_setup/global-setup-user.ts'],
		},
		{
			name: 'e2e-admin',
			dependencies: ['setup-admin'],
			testMatch: ['**/*-admin.spec.ts'],
			use: {
				storageState: path.resolve(__dirname, 'playwright/.auth/admin.json'),
			},
		},
		{
			name: 'e2e-employee',
			dependencies: ['setup-employee'],
			testMatch: ['**/*-employee.spec.ts'],
			use: {
				storageState: path.resolve(__dirname, 'playwright/.auth/employee.json'),
			},
		},
		{
			name: 'e2e-user',
			dependencies: ['setup-user'],
			testMatch: ['**/*-user.spec.ts'],
			use: {
				storageState: path.resolve(__dirname, 'playwright/.auth/user.json'),
			},
		},
	],

	reporter: [['list'], ['html', { open: 'never' }]],
	retries: 3,
});


	// projects: [
  //   // ——— SETUP PROJECTS ———
  //   {
  //     name: 'setup-admin',
  //     testMatch: ['**/_setup/global-setup-admin.ts'],
  //   },
  //   {
  //     name: 'setup-employee',
  //     testMatch: ['**/_setup/global-setup-employee.ts'],
  //   },
  //   {
  //     name: 'setup-user',
  //     testMatch: ['**/_setup/global-setup-user.ts'],
  //   },

  //   // ——— ADMIN SUITE ———
  //   {
  //     name: 'e2e-admin-chromium',
  //     dependencies: ['setup-admin'],
  //     testMatch: ['**/*-admin.spec.ts'],
  //     use: {
  //       storageState: path.resolve(__dirname, 'playwright/.auth/admin.json'),
  //       browserName: 'chromium',
  //     },
  //   },
  //   {
  //     name: 'e2e-admin-firefox',
  //     dependencies: ['setup-admin'],
  //     testMatch: ['**/*-admin.spec.ts'],
  //     use: {
  //       storageState: path.resolve(__dirname, 'playwright/.auth/admin.json'),
  //       browserName: 'firefox',
  //     },
  //   },
  //   {
  //     name: 'e2e-admin-webkit',
  //     dependencies: ['setup-admin'],
  //     testMatch: ['**/*-admin.spec.ts'],
  //     use: {
  //       storageState: path.resolve(__dirname, 'playwright/.auth/admin.json'),
  //       browserName: 'webkit',
  //     },
  //   },

  //   // ——— EMPLOYEE SUITE ———
  //   {
  //     name: 'e2e-employee-chromium',
  //     dependencies: ['setup-employee'],
  //     testMatch: ['**/*-employee.spec.ts'],
  //     use: {
  //       storageState: path.resolve(__dirname, 'playwright/.auth/employee.json'),
  //       browserName: 'chromium',
  //     },
  //   },
  //   {
  //     name: 'e2e-employee-firefox',
  //     dependencies: ['setup-employee'],
  //     testMatch: ['**/*-employee.spec.ts'],
  //     use: {
  //       storageState: path.resolve(__dirname, 'playwright/.auth/employee.json'),
  //       browserName: 'firefox',
  //     },
  //   },
  //   {
  //     name: 'e2e-employee-webkit',
  //     dependencies: ['setup-employee'],
  //     testMatch: ['**/*-employee.spec.ts'],
  //     use: {
  //       storageState: path.resolve(__dirname, 'playwright/.auth/employee.json'),
  //       browserName: 'webkit',
  //     },
  //   },

  //   // ——— USER SUITE ———
  //   {
  //     name: 'e2e-user-chromium',
  //     dependencies: ['setup-user'],
  //     testMatch: ['**/*-user.spec.ts'],
  //     use: {
  //       storageState: path.resolve(__dirname, 'playwright/.auth/user.json'),
  //       browserName: 'chromium',
  //     },
  //   },
  //   {
  //     name: 'e2e-user-firefox',
  //     dependencies: ['setup-user'],
  //     testMatch: ['**/*-user.spec.ts'],
  //     use: {
  //       storageState: path.resolve(__dirname, 'playwright/.auth/user.json'),
  //       browserName: 'firefox',
  //     },
  //   },
  //   {
  //     name: 'e2e-user-webkit',
  //     dependencies: ['setup-user'],
  //     testMatch: ['**/*-user.spec.ts'],
  //     use: {
  //       storageState: path.resolve(__dirname, 'playwright/.auth/user.json'),
  //       browserName: 'webkit',
  //     },
  //   },
  // ],

	// 	projects: [
	// 	{
	// 		name: 'setup-admin',
	// 		testMatch: ['**/_setup/global-setup-admin.ts'],
	// 	},
	// 	{
	// 		name: 'setup-employee',
	// 		testMatch: ['**/_setup/global-setup-employee.ts'],
	// 	},
	// 	{
	// 		name: 'setup-user',
	// 		testMatch: ['**/_setup/global-setup-user.ts'],
	// 	},
	// 	{
	// 		name: 'e2e-admin',
	// 		dependencies: ['setup-admin'],
	// 		testMatch: ['**/*-admin.spec.ts'],
	// 		use: {
	// 			storageState: path.resolve(__dirname, 'playwright/.auth/admin.json'),
	// 		},
	// 	},
	// 	{
	// 		name: 'e2e-employee',
	// 		dependencies: ['setup-employee'],
	// 		testMatch: ['**/*-employee.spec.ts'],
	// 		use: {
	// 			storageState: path.resolve(__dirname, 'playwright/.auth/employee.json'),
	// 		},
	// 	},
	// 	{
	// 		name: 'e2e-user',
	// 		dependencies: ['setup-user'],
	// 		testMatch: ['**/*-user.spec.ts'],
	// 		use: {
	// 			storageState: path.resolve(__dirname, 'playwright/.auth/user.json'),
	// 		},
	// 	},
	// ],