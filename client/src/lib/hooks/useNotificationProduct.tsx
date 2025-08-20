import { useToast } from '@chakra-ui/react';
import { NEXT_PUBLIC_API_URL } from '@lib/constants/config.constants';
import {
	deleteNotification,
	getAllNotifications,
	saveNotification,
} from '@lib/db/notificationsDB';
import { useKeycloak } from '@lib/hooks/useKeycloak';
import type { Notification } from '@lib/model/notification.model';
import { useCallback, useEffect, useState } from 'react';

const API_URL = NEXT_PUBLIC_API_URL;
export default function useNotificationProduct() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [latestNotification, setLatestNotification] =
		useState<Notification | null>(null);

	const { keycloak } = useKeycloak();
	const toast = useToast();

	useEffect(() => {
		const fetchStoredNotifications = async () => {
			const stored = await getAllNotifications();
			setNotifications(stored);
		};

		fetchStoredNotifications();

		const es = new EventSource(
			`${API_URL}/notifications/stream?userId=${keycloak?.subject}`,
			{ withCredentials: true },
		);

		const handler = (e: MessageEvent) => {
			const n: Notification = JSON.parse(e.data);

			setNotifications((prev) => {
				const alreadyExists = prev.some((notif) => notif.uuid === n.uuid);
				if (alreadyExists) return prev;

				saveNotification(n);
				setLatestNotification(n);

				return [n, ...prev];
			});
		};

		es.addEventListener('low-stock', handler);
		es.onerror = () => es.close();

		return () => {
			// biome-ignore lint/suspicious/noExplicitAny: Type is needed for event handler
			es.removeEventListener('low-stock', handler as any);
			es.close();
		};
	}, [keycloak]);

	useEffect(() => {
		if (!latestNotification) return;

		toast({
			title: `Low Stock on ${latestNotification.productName}`,
			description: `The product ${latestNotification.productName} has reached a low stock level of ${latestNotification.quantity}. Current threshold is ${latestNotification.threshold}.`,
			status: 'warning',
			duration: 5000,
			isClosable: true,
		});

		setLatestNotification(null);
	}, [latestNotification, toast]);

	const handleDeleteNotification = useCallback(async (uuid: string) => {
		await deleteNotification(uuid);
		setNotifications((prev) => prev.filter((notif) => notif.uuid !== uuid));
	}, []);

	return {
		notifications,
		handleDeleteNotification,
	};
}
