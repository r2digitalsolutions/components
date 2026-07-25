<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import type { Snippet } from 'svelte';

	interface CornerBadgeProps {
		label?: string;
		position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
		variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
		class?: string;
		children?: Snippet;
	}

	const {
		label = 'New',
		position = 'top-right',
		variant = 'primary',
		class: className = '',
		children
	}: CornerBadgeProps = $props();

	const pos = {
		'top-left': 'left-2 top-2',
		'top-right': 'right-2 top-2',
		'bottom-left': 'bottom-2 left-2',
		'bottom-right': 'bottom-2 right-2'
	};
</script>

<span class={['absolute z-10', pos[position], className]}>
	{#if children}
		{@render children()}
	{:else}
		<Badge {variant} size="sm" rounded>{label}</Badge>
	{/if}
</span>
