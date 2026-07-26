<script lang="ts">
	import type { Snippet } from 'svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import LockKeyhole from '@lucide/svelte/icons/lock-keyhole';

	interface UnauthorizedProps {
		title?: string;
		description?: string;
		actionLabel?: string;
		class?: string;
		icon?: Snippet;
		action?: Snippet;
		onaction?: () => void;
	}

	let {
		title = 'Sign in required',
		description = 'You need to be signed in to continue.',
		actionLabel = 'Sign in',
		class: className = '',
		icon: iconProp,
		action: actionProp,
		onaction
	}: UnauthorizedProps = $props();
</script>

<EmptyState {title} {description} class={className}>
	{#snippet icon()}
		{#if iconProp}
			{@render iconProp()}
		{:else}
			<LockKeyhole class="h-7 w-7" />
		{/if}
	{/snippet}
	{#snippet action()}
		{#if actionProp}
			{@render actionProp()}
		{:else if actionLabel}
			<Button size="sm" onclick={() => onaction?.()}>{actionLabel}</Button>
		{/if}
	{/snippet}
</EmptyState>
