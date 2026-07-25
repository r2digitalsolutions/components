<script lang="ts">
	import type { Snippet } from 'svelte';

	interface MasonryGridProps {
		/** Number of columns at md+; stacks to 1 on mobile unless columns is set low */
		columns?: 2 | 3 | 4;
		gap?: 'sm' | 'md' | 'lg';
		class?: string;
		children?: Snippet;
	}

	let {
		columns = 3,
		gap = 'md',
		class: className = '',
		children
	}: MasonryGridProps = $props();

	const gapClass = {
		sm: 'gap-2',
		md: 'gap-4',
		lg: 'gap-6'
	} as const;

	const colClass = {
		2: 'columns-1 sm:columns-2',
		3: 'columns-1 sm:columns-2 lg:columns-3',
		4: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4'
	} as const;
</script>

<div class={['masonry', colClass[columns], gapClass[gap], className]}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.masonry > :global(*) {
		break-inside: avoid;
		margin-bottom: 1rem;
		display: inline-block;
		width: 100%;
	}
	.masonry.gap-2 > :global(*) {
		margin-bottom: 0.5rem;
	}
	.masonry.gap-4 > :global(*) {
		margin-bottom: 1rem;
	}
	.masonry.gap-6 > :global(*) {
		margin-bottom: 1.5rem;
	}
</style>
