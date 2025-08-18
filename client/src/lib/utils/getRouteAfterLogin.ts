import { Routes } from '@lib/constants/routes.constants';

export const getRouteAfterLogin = (route: string): string => {
	switch (route) {
		case 'inventory':
			return Routes.Inventory;
		case 'home':
			return Routes.Home;
		case 'changes':
			return Routes.Changes;
		default:
			return Routes.Home;
	}
};
