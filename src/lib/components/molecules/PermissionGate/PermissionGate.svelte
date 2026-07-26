<script lang="ts">
	import type { Snippet } from 'svelte';
	import Can from '$lib/components/molecules/Can/Can.svelte';
	import Forbidden from '$lib/components/molecules/Forbidden/Forbidden.svelte';
	import type { PermissionLevel } from '$lib/utils/permissions.js';

	interface PermissionGateProps {
		resource?: string;
		level?: PermissionLevel;
		role?: string;
		anyRole?: string[];
		allRoles?: string[];
		not?: boolean;
		/** Override default Forbidden title */
		title?: string;
		description?: string;
		actionLabel?: string;
		class?: string;
		children?: Snippet;
		fallback?: Snippet;
		onaction?: () => void;
	}

	let {
		resource,
		level = 'read',
		role,
		anyRole,
		allRoles,
		not = false,
		title,
		description,
		actionLabel,
		class: className = '',
		children,
		fallback,
		onaction
	}: PermissionGateProps = $props();
</script>

<Can {resource} {level} {role} {anyRole} {allRoles} {not}>
	{#if children}
		{@render children()}
	{/if}
	{#snippet fallback()}
		{#if fallback}
			{@render fallback()}
		{:else}
			<Forbidden {title} {description} {actionLabel} class={className} {onaction} />
		{/if}
	{/snippet}
</Can>
