<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getPermissionsContext } from '$lib/utils/permissions.svelte.js';
	import type { PermissionLevel } from '$lib/utils/permissions.js';

	interface CanProps {
		/** Resource id (e.g. `projects`) */
		resource?: string;
		/** Minimum level (admin ⊃ write ⊃ read). Default `read`. */
		level?: PermissionLevel;
		/** Exact role required */
		role?: string;
		/** At least one of these roles */
		anyRole?: string[];
		/** All of these roles */
		allRoles?: string[];
		/** Invert the check */
		not?: boolean;
		children?: Snippet;
		/** Rendered when the check fails */
		fallback?: Snippet;
	}

	let {
		resource,
		level = 'read',
		role,
		anyRole,
		allRoles,
		not = false,
		children,
		fallback
	}: CanProps = $props();

	const perms = getPermissionsContext();

	const allowed = $derived.by(() => {
		// Track provider state for reactivity across context
		void perms.roles;
		void perms.map;
		const ok = perms.check({ resource, level, role, anyRole, allRoles });
		return not ? !ok : ok;
	});
</script>

{#if allowed}
	{#if children}
		{@render children()}
	{/if}
{:else if fallback}
	{@render fallback()}
{/if}
