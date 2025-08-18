export const Roles = {
	Admin: 'admin',
	Employee: 'employee',
} as const;

export type RoutesType = (typeof Roles)[keyof typeof Roles];
