import { NEXT_KEYCLOAK_AUTH_URL } from './config.constants';

export const Routes = {
	Home: '/',
	Dashboard: '/dashboard',
	Login: NEXT_KEYCLOAK_AUTH_URL,
	Inventory: '/inventory',
	Changes: '/changes',
	Stock: '/stock',
} as const;

export type RoutesType = (typeof Routes)[keyof typeof Routes];
