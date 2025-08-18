import { Roles } from '@lib/constants/roles.constants';
import { Routes } from '@lib/constants/routes.constants';
import { useKeycloak } from '@react-keycloak/web';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export type UseAuthProps = {
	redirectAfterLogin: string;
};

const REALM_BACKEND =
	process.env.NEXT_KEYCLOAK_REALM_BACKEND || 'inventory-backend';

export default function useAuth({ redirectAfterLogin }: UseAuthProps) {
	const router = useRouter();
	const { keycloak, initialized } = useKeycloak();
	const [isAuthChecking, setIsAuthChecking] = useState(true);

	useEffect(() => {
		if (!initialized) {
			setIsAuthChecking(true);
			return;
		}

		const checkAuthAndPermissions = async () => {
			try {
				if (!keycloak.authenticated) {
					sessionStorage.setItem(
						'redirectAfterLogin',
						window.location.pathname,
					);

					keycloak.login({
						redirectUri: window.location.origin + redirectAfterLogin,
					});
					return;
				}

				const hasPermission =
					keycloak.resourceAccess?.[REALM_BACKEND]?.roles?.includes(
						Roles.Admin,
					) ||
					keycloak.resourceAccess?.[REALM_BACKEND]?.roles?.includes(
						Roles.Employee,
					);

				if (!hasPermission) {
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
	}, [initialized, keycloak, router, redirectAfterLogin]);

	const shouldFetch = !isAuthChecking && initialized && keycloak.authenticated;
	const token = keycloak.token;

	return {
		isAuthChecking,
		shouldFetch,
		token,
	};
}
