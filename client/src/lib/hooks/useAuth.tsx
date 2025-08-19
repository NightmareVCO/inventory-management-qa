import { Roles } from '@lib/constants/roles.constants';
import { Routes } from '@lib/constants/routes.constants';
import { useKeycloak } from '@react-keycloak/web';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type UseAuthProps = {
	redirectAfterLogin: string;
};

const REALM_BACKEND =
	process.env.NEXT_KEYCLOAK_REALM_BACKEND || 'inventory-backend';

const PUBLIC_ROUTES = [Routes.Home, Routes.Inventory];

export default function useAuth({ redirectAfterLogin }: UseAuthProps) {
	const router = useRouter();
	const { keycloak, initialized } = useKeycloak();
	const [isAuthChecking, setIsAuthChecking] = useState(true);

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

	useEffect(() => {
		if (!initialized) {
			setIsAuthChecking(true);
			return;
		}

		const checkAuthAndPermissions = async () => {
			try {
				const currentLocation = window.location.pathname;
				const origin = window.location.origin;

				if (
					PUBLIC_ROUTES.includes(
						currentLocation as (typeof PUBLIC_ROUTES)[number],
					)
				) {
					setIsAuthChecking(false);
					return;
				}

				if (!isAuthenticated) {
					sessionStorage.setItem('redirectAfterLogin', currentLocation);

					keycloak.login({
						redirectUri: origin + redirectAfterLogin,
					});
					return;
				}

				if (!hasBasePermission) {
					router.push(Routes.Home);
					return;
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
		goToLogin,
	};
}
