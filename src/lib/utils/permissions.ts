/**
 * Pure permission helpers — RBAC checks over a `PermissionMap`
 * (compatible with `<PermissionsMatrix>`).
 *
 * Hierarchy: `admin` ⊃ `write` ⊃ `read`.
 */

export type PermissionLevel = 'read' | 'write' | 'admin';

/** roleId → resourceId → levels granted */
export type PermissionMap = Record<string, Record<string, PermissionLevel[]>>;

export const PERMISSION_LEVELS: PermissionLevel[] = ['read', 'write', 'admin'];

export const LEVEL_RANK: Record<PermissionLevel, number> = {
	read: 1,
	write: 2,
	admin: 3
};

/** True when `granted` covers `required` (admin implies write implies read). */
export function levelSatisfies(
	granted: PermissionLevel[] | readonly PermissionLevel[],
	required: PermissionLevel
): boolean {
	const need = LEVEL_RANK[required];
	return granted.some((level) => LEVEL_RANK[level] >= need);
}

/** Unique levels sorted by rank ascending. */
export function mergeLevels(
	...lists: Array<PermissionLevel[] | readonly PermissionLevel[] | undefined>
): PermissionLevel[] {
	const set = new Set<PermissionLevel>();
	for (const list of lists) {
		if (!list) continue;
		for (const level of list) set.add(level);
	}
	return PERMISSION_LEVELS.filter((l) => set.has(l));
}

export function getRoleLevels(
	map: PermissionMap,
	roleId: string,
	resource: string
): PermissionLevel[] {
	return map[roleId]?.[resource] ?? [];
}

/** Union of levels across all of the user's roles for a resource. */
export function getEffectiveLevels(
	map: PermissionMap,
	roles: string[] | readonly string[],
	resource: string
): PermissionLevel[] {
	return mergeLevels(...roles.map((roleId) => getRoleLevels(map, roleId, resource)));
}

/**
 * Can the given roles perform `level` on `resource`?
 *
 * @example
 * ```ts
 * can(map, ['member'], 'projects', 'write') // true if member has write|admin on projects
 * ```
 */
export function can(
	map: PermissionMap,
	roles: string[] | readonly string[],
	resource: string,
	level: PermissionLevel = 'read'
): boolean {
	return levelSatisfies(getEffectiveLevels(map, roles, resource), level);
}

export function hasRole(roles: string[] | readonly string[], role: string): boolean {
	return roles.includes(role);
}

export function hasAnyRole(
	roles: string[] | readonly string[],
	required: string[] | readonly string[]
): boolean {
	return required.some((r) => roles.includes(r));
}

export function hasAllRoles(
	roles: string[] | readonly string[],
	required: string[] | readonly string[]
): boolean {
	return required.every((r) => roles.includes(r));
}

export interface PermissionCheck {
	/** Resource id (e.g. `projects`) */
	resource?: string;
	/** Minimum level required (default `read`). Implies lower levels. */
	level?: PermissionLevel;
	/** Exact role */
	role?: string;
	/** At least one of these roles */
	anyRole?: string[];
	/** All of these roles */
	allRoles?: string[];
}

/**
 * Evaluate a declarative check against roles + map.
 * Resource checks and role checks are AND-ed when both are present.
 */
export function checkPermission(
	map: PermissionMap,
	roles: string[] | readonly string[],
	check: PermissionCheck
): boolean {
	const parts: boolean[] = [];

	if (check.resource) {
		parts.push(can(map, roles, check.resource, check.level ?? 'read'));
	}
	if (check.role) {
		parts.push(hasRole(roles, check.role));
	}
	if (check.anyRole?.length) {
		parts.push(hasAnyRole(roles, check.anyRole));
	}
	if (check.allRoles?.length) {
		parts.push(hasAllRoles(roles, check.allRoles));
	}

	if (parts.length === 0) return true;
	return parts.every(Boolean);
}
