import type { Notification } from '@lib/model/notification.model';
import { openDB } from 'idb';

const DB_NAME = 'inventory-db';
const STORE_NAME = 'notifications';

export async function getNotificationsDB() {
	return openDB(DB_NAME, 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'uuid' });
			}
		},
	});
}

export async function saveNotification(notification: Notification) {
	const db = await getNotificationsDB();
	await db.put(STORE_NAME, notification);
}

export async function getAllNotifications(): Promise<Notification[]> {
	const db = await getNotificationsDB();
	return await db.getAll(STORE_NAME);
}

export async function clearNotifications() {
	const db = await getNotificationsDB();
	await db.clear(STORE_NAME);
}

export async function deleteNotification(uuid: string) {
	const db = await getNotificationsDB();
	await db.delete(STORE_NAME, uuid);
}
