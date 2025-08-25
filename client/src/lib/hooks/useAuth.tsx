import { NEXT_PUBLIC_KEYCLOAK_REALM_BACKEND } from '@lib/constants/config.constants';
import { Roles } from '@lib/constants/roles.constants';
import { Routes } from '@lib/constants/routes.constants';
import { useKeycloak } from '@react-keycloak/web';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type UseAuthProps = {
	redirectAfterLogin?: string;
};

const REALM_BACKEND = NEXT_PUBLIC_KEYCLOAK_REALM_BACKEND;
const PUBLIC_ROUTES = [Routes.Home, Routes.Inventory];
const EMPLOYEE_ROUTES = [Routes.Stock];
const ADMIN_ROUTES = [Routes.Changes, Routes.Dashboard];

export default function useAuth({ redirectAfterLogin }: UseAuthProps) {
	const router = useRouter();
	const { keycloak, initialized } = useKeycloak();
	const [isAuthChecking, setIsAuthChecking] = useState(true);

	const currentUser = useMemo(() => {
		return {
			name: keycloak?.tokenParsed?.given_name ?? 'No Name',
			lastName: keycloak?.tokenParsed?.family_name ?? 'No Last Name',
			role: keycloak?.resourceAccess?.[REALM_BACKEND]?.roles || [],
			email: keycloak?.tokenParsed?.email ?? 'No Email',
		};
	}, [keycloak.tokenParsed, keycloak.resourceAccess]);

	const isAuthenticated = useMemo(() => {
		return keycloak.authenticated;
	}, [keycloak.authenticated]);

	const hasBasePermission = useMemo(() => {
		if (!keycloak.resourceAccess) return false;

		const inventoryBackend = keycloak.resourceAccess[REALM_BACKEND];
		if (!inventoryBackend || !inventoryBackend.roles) return false;

		return (
			inventoryBackend.roles.includes(Roles.Admin) ||
			inventoryBackend.roles.includes(Roles.Employee)
		);
	}, [keycloak.resourceAccess]);

	const hasAdminPermission = useMemo(() => {
		if (!keycloak.resourceAccess) return false;

		const inventoryBackend = keycloak.resourceAccess[REALM_BACKEND];
		if (!inventoryBackend || !inventoryBackend.roles) return false;

		return inventoryBackend.roles.includes(Roles.Admin);
	}, [keycloak.resourceAccess]);

	const goToLogin = useCallback(() => {
		keycloak.login({
			redirectUri: window.location.origin + redirectAfterLogin,
		});
	}, [keycloak.login, redirectAfterLogin]);

	const logout = useCallback(() => {
		keycloak.logout({
			redirectUri: window.location.origin + Routes.Home,
		});
	}, [keycloak.logout]);

	useEffect(() => {
		if (!initialized) {
			setIsAuthChecking(true);
			return;
		}

		const verifyPublicRoute = (currentLocation: string) => {
			return PUBLIC_ROUTES.includes(
				currentLocation as (typeof PUBLIC_ROUTES)[number],
			);
		};

		const verifyEmployeeRoute = (currentLocation: string) => {
			return EMPLOYEE_ROUTES.includes(
				currentLocation as (typeof EMPLOYEE_ROUTES)[number],
			);
		};

		const verifyAdminRoute = (currentLocation: string) => {
			return ADMIN_ROUTES.includes(
				currentLocation as (typeof ADMIN_ROUTES)[number],
			);
		};

		const verifyAuthenticatedUser = (
			currentLocation: string,
			origin: string,
		) => {
			if (isAuthenticated) return;

			sessionStorage.setItem('redirectAfterLogin', currentLocation);

			keycloak.login({
				redirectUri: origin + redirectAfterLogin,
			});
			return;
		};

		const checkAuthAndPermissions = async () => {
			try {
				const currentLocation = window.location.pathname;
				const origin = window.location.origin;

				if (verifyPublicRoute(currentLocation)) {
					setIsAuthChecking(false);
					return;
				}

				verifyAuthenticatedUser(currentLocation, origin);

				if (verifyEmployeeRoute(currentLocation)) {
					if (hasBasePermission) {
						setIsAuthChecking(false);
						return;
					}

					router.push(Routes.Inventory);
					return;
				}

				if (verifyAdminRoute(currentLocation)) {
					if (!hasAdminPermission) {
						router.push(Routes.Inventory);
						return;
					}
				}

				setIsAuthChecking(false);
			} catch (error) {
				console.error('Error checking auth:', error);
				setIsAuthChecking(false);
			}
		};

		checkAuthAndPermissions();
	}, [
		initialized,
		keycloak,
		router,
		redirectAfterLogin,
		hasBasePermission,
		hasAdminPermission,
		isAuthenticated,
	]);

	const shouldFetch = !isAuthChecking && initialized;
	const token = keycloak.token;

	return {
		isAuthChecking,
		shouldFetch,
		token,
		isAuthenticated,
		hasPermission: hasBasePermission,
		hasAdminPermission,
		currentUser,
		goToLogin,
		logout,
	};
}
