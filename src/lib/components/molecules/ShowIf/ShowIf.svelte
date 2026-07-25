<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getPermissionsContext } from '$lib/utils/permissions.svelte.js';

	interface ShowIfProps {
		/** Exact role */
		role?: string;
		/** At least one role */
		anyRole?: string[];
		/** All roles */
		allRoles?: string[];
		/** Arbitrary boolean gate (AND-ed with role checks when both set) */
		when?: boolean;
		/** Invert the result */
		not?: boolean;
		children?: Snippet;
		fallback?: Snippet;
	}

	let {
		role,
		anyRole,
		allRoles,
		when,
		not = false,
		children,
		fallback
	}: ShowIfProps = $props();

	const perms = getPermissionsContext();

	const allowed = $derived.by(() => {
		void perms.roles;
		const parts: boolean[] = [];
		if (role) parts.push(perms.hasRole(role));
		if (anyRole?.length) parts.push(perms.hasAnyRole(anyRole));
		if (allRoles?.length) parts.push(perms.hasAllRoles(allRoles));
		if (when !== undefined) parts.push(when);
		const ok = parts.length === 0 ? Boolean(when) : parts.every(Boolean);
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
