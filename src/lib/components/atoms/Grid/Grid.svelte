<script lang="ts">
	import type { Snippet } from 'svelte';

	type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

	interface GridProps {
		cols?: GridCols;
		gap?: GridGap;
		class?: string;
		children?: Snippet;
	}

	let { cols = 3, gap = 'md', class: className = '', children }: GridProps = $props();

	const gaps: Record<GridGap, string> = {
		none: 'gap-0',
		xs: 'gap-1',
		sm: 'gap-2',
		md: 'gap-4',
		lg: 'gap-6',
		xl: 'gap-8'
	};

	const colClasses: Record<GridCols, string> = {
		1: 'grid-cols-1',
		2: 'grid-cols-2',
		3: 'grid-cols-3',
		4: 'grid-cols-4',
		5: 'grid-cols-5',
		6: 'grid-cols-6',
		7: 'grid-cols-7',
		8: 'grid-cols-8',
		9: 'grid-cols-9',
		10: 'grid-cols-10',
		11: 'grid-cols-11',
		12: 'grid-cols-12'
	};
</script>

<div class={['grid', colClasses[cols], gaps[gap], className]}>
	{#if children}{@render children()}{/if}
</div>
