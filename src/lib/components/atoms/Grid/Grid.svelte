<script lang="ts">
	import type { Snippet } from 'svelte';

	type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

	type GridColsConfig =
		| GridCols
		| {
				base?: GridCols;
				sm?: GridCols;
				md?: GridCols;
				lg?: GridCols;
				xl?: GridCols;
				'2xl'?: GridCols;
		  };

	interface GridProps {
		cols?: GridColsConfig;
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

	const smColClasses: Record<GridCols, string> = {
		1: 'sm:grid-cols-1',
		2: 'sm:grid-cols-2',
		3: 'sm:grid-cols-3',
		4: 'sm:grid-cols-4',
		5: 'sm:grid-cols-5',
		6: 'sm:grid-cols-6',
		7: 'sm:grid-cols-7',
		8: 'sm:grid-cols-8',
		9: 'sm:grid-cols-9',
		10: 'sm:grid-cols-10',
		11: 'sm:grid-cols-11',
		12: 'sm:grid-cols-12'
	};

	const mdColClasses: Record<GridCols, string> = {
		1: 'md:grid-cols-1',
		2: 'md:grid-cols-2',
		3: 'md:grid-cols-3',
		4: 'md:grid-cols-4',
		5: 'md:grid-cols-5',
		6: 'md:grid-cols-6',
		7: 'md:grid-cols-7',
		8: 'md:grid-cols-8',
		9: 'md:grid-cols-9',
		10: 'md:grid-cols-10',
		11: 'md:grid-cols-11',
		12: 'md:grid-cols-12'
	};

	const lgColClasses: Record<GridCols, string> = {
		1: 'lg:grid-cols-1',
		2: 'lg:grid-cols-2',
		3: 'lg:grid-cols-3',
		4: 'lg:grid-cols-4',
		5: 'lg:grid-cols-5',
		6: 'lg:grid-cols-6',
		7: 'lg:grid-cols-7',
		8: 'lg:grid-cols-8',
		9: 'lg:grid-cols-9',
		10: 'lg:grid-cols-10',
		11: 'lg:grid-cols-11',
		12: 'lg:grid-cols-12'
	};

	const xlColClasses: Record<GridCols, string> = {
		1: 'xl:grid-cols-1',
		2: 'xl:grid-cols-2',
		3: 'xl:grid-cols-3',
		4: 'xl:grid-cols-4',
		5: 'xl:grid-cols-5',
		6: 'xl:grid-cols-6',
		7: 'xl:grid-cols-7',
		8: 'xl:grid-cols-8',
		9: 'xl:grid-cols-9',
		10: 'xl:grid-cols-10',
		11: 'xl:grid-cols-11',
		12: 'xl:grid-cols-12'
	};

	const twoxlColClasses: Record<GridCols, string> = {
		1: '2xl:grid-cols-1',
		2: '2xl:grid-cols-2',
		3: '2xl:grid-cols-3',
		4: '2xl:grid-cols-4',
		5: '2xl:grid-cols-5',
		6: '2xl:grid-cols-6',
		7: '2xl:grid-cols-7',
		8: '2xl:grid-cols-8',
		9: '2xl:grid-cols-9',
		10: '2xl:grid-cols-10',
		11: '2xl:grid-cols-11',
		12: '2xl:grid-cols-12'
	};

	const resolved = $derived(typeof cols === 'number' ? { base: cols } : cols);
	const baseCols = $derived(resolved.base ?? 3);
</script>

<div
	class={[
		'grid',
		colClasses[baseCols],
		resolved.sm != null && smColClasses[resolved.sm],
		resolved.md != null && mdColClasses[resolved.md],
		resolved.lg != null && lgColClasses[resolved.lg],
		resolved.xl != null && xlColClasses[resolved.xl],
		resolved['2xl'] != null && twoxlColClasses[resolved['2xl']],
		gaps[gap],
		className
	]}
>
	{#if children}{@render children()}{/if}
</div>
