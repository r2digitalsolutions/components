/**
 * Reactive permissions store — current user roles + workspace PermissionMap.
 *
 * - Singleton: `import { permissions } from '@r2digisolutions/components'`
 * - Prefer `<PermissionsProvider>` in the tree for scoped values via context
 *
 * @example
 * ```ts
 * permissions.configure({
 *   roles: ['member'],
 *   map: { member: { projects: ['read', 'write'] } }
 * });
 * permissions.can('projects', 'write'); // true
 * ```
 */

import { getContext } from 'svelte';
import {
	can as canCheck,
	checkPermission,
	getEffectiveLevels,
	hasAllRoles,
	hasAnyRole,
	hasRole,
	type PermissionCheck,
	type PermissionLevel,
	type PermissionMap
} from './permissions.js';

export type { PermissionCheck, PermissionLevel, PermissionMap };

export const PERMISSIONS_CONTEXT_KEY = 'r2-permissions';

export interface PermissionsState {
	roles: string[];
	map: PermissionMap;
	can: (resource: string, level?: PermissionLevel) => boolean;
	hasRole: (role: string) => boolean;
	hasAnyRole: (roles: string[]) => boolean;
	hasAllRoles: (roles: string[]) => boolean;
	check: (check: PermissionCheck) => boolean;
	levels: (resource: string) => PermissionLevel[];
	setRoles: (roles: string[]) => void;
	setMap: (map: PermissionMap) => void;
	configure: (options: { roles?: string[]; map?: PermissionMap }) => void;
}

class PermissionsStore implements PermissionsState {
	#roles = $state<string[]>([]);
	#map = $state<PermissionMap>({});

	get roles(): string[] {
		return this.#roles;
	}

	get map(): PermissionMap {
		return this.#map;
	}

	can(resource: string, level: PermissionLevel = 'read'): boolean {
		return canCheck(this.#map, this.#roles, resource, level);
	}

	hasRole(role: string): boolean {
		return hasRole(this.#roles, role);
	}

	hasAnyRole(required: string[]): boolean {
		return hasAnyRole(this.#roles, required);
	}

	hasAllRoles(required: string[]): boolean {
		return hasAllRoles(this.#roles, required);
	}

	check(check: PermissionCheck): boolean {
		return checkPermission(this.#map, this.#roles, check);
	}

	levels(resource: string): PermissionLevel[] {
		return getEffectiveLevels(this.#map, this.#roles, resource);
	}

	setRoles(roles: string[]) {
		this.#roles = [...roles];
	}

	setMap(map: PermissionMap) {
		this.#map = map;
	}

	configure(options: { roles?: string[]; map?: PermissionMap }) {
		if (options.map) this.setMap(options.map);
		if (options.roles) this.setRoles(options.roles);
	}
}

/** Global default store (overridden in-tree by `<PermissionsProvider>`). */
export const permissions: PermissionsState = new PermissionsStore();

/**
 * Nearest `<PermissionsProvider>` API, or the global `permissions` store.
 */
export function getPermissionsContext(): PermissionsState {
	return getContext<PermissionsState | null>(PERMISSIONS_CONTEXT_KEY) ?? permissions;
}
