<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import {
		PERMISSIONS_CONTEXT_KEY,
		permissions,
		type PermissionsState
	} from '$lib/utils/permissions.svelte.js';
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
	} from '$lib/utils/permissions.js';

	interface PermissionsProviderProps {
		/** Current user role ids */
		roles?: string[];
		/** Workspace permission matrix (same shape as `<PermissionsMatrix>`) */
		map?: PermissionMap;
		/**
		 * Also mirror into the global `permissions` store.
		 * @default true
		 */
		syncGlobal?: boolean;
		children?: Snippet;
	}

	let {
		roles = $bindable<string[]>([]),
		map = $bindable<PermissionMap>({}),
		syncGlobal = true,
		children
	}: PermissionsProviderProps = $props();

	const api: PermissionsState = {
		get roles() {
			return roles;
		},
		get map() {
			return map;
		},
		can(resource: string, level: PermissionLevel = 'read') {
			return canCheck(map, roles, resource, level);
		},
		hasRole(role: string) {
			return hasRole(roles, role);
		},
		hasAnyRole(required: string[]) {
			return hasAnyRole(roles, required);
		},
		hasAllRoles(required: string[]) {
			return hasAllRoles(roles, required);
		},
		check(check: PermissionCheck) {
			return checkPermission(map, roles, check);
		},
		levels(resource: string) {
			return getEffectiveLevels(map, roles, resource);
		},
		setRoles(next: string[]) {
			roles = [...next];
		},
		setMap(next: PermissionMap) {
			map = next;
		},
		configure(options: { roles?: string[]; map?: PermissionMap }) {
			if (options.map) map = options.map;
			if (options.roles) roles = [...options.roles];
		}
	};

	setContext(PERMISSIONS_CONTEXT_KEY, api);

	$effect(() => {
		if (!syncGlobal) return;
		permissions.configure({ roles, map });
	});
</script>

{#if children}
	{@render children()}
{/if}
