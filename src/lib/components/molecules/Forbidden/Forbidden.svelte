<script lang="ts">
	import type { Snippet } from 'svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import ShieldOff from '@lucide/svelte/icons/shield-off';

	interface ForbiddenProps {
		title?: string;
		description?: string;
		actionLabel?: string;
		class?: string;
		icon?: Snippet;
		action?: Snippet;
		onaction?: () => void;
	}

	let {
		title = 'Access denied',
		description = "You don't have permission to view this resource. Contact an admin if you think this is a mistake.",
		actionLabel,
		class: className = '',
		icon: iconProp,
		action: actionProp,
		onaction
	}: ForbiddenProps = $props();
</script>

<EmptyState {title} {description} class={className}>
	{#snippet icon()}
		{#if iconProp}
			{@render iconProp()}
		{:else}
			<ShieldOff class="h-7 w-7" />
		{/if}
	{/snippet}
	{#snippet action()}
		{#if actionProp}
			{@render actionProp()}
		{:else if actionLabel}
			<Button size="sm" variant="secondary" onclick={() => onaction?.()}>{actionLabel}</Button>
		{/if}
	{/snippet}
</EmptyState>
