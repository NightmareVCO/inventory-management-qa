import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({
	path: path.resolve(__dirname, '../../.env'),
	debug: false,
	quiet: true,
});

export const LOGIN_PAGE = process.env.NEXT_KEYCLOAK_LOGIN_ID;
export const URL = process.env.PUBLIC_FRONTEND_URL;

export const USERNAME_ADMIN = process.env.PUBLIC_KEYCLOAK_ADMIN_USERNAME;
export const PASSWORD_ADMIN = process.env.PUBLIC_KEYCLOAK_ADMIN_PASSWORD;
export const USERNAME_EMPLOYEE = process.env.PUBLIC_KEYCLOAK_EMPLOYEE_USERNAME;
export const PASSWORD_EMPLOYEE = process.env.PUBLIC_KEYCLOAK_EMPLOYEE_PASSWORD;
export const USERNAME = process.env.PUBLIC_KEYCLOAK_USER_USERNAME;
export const PASSWORD = process.env.PUBLIC_KEYCLOAK_USER_PASSWORD;
