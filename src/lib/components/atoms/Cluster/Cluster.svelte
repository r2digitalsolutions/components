<script lang="ts">
	import type { Snippet } from 'svelte';

	type ClusterGap = 'none' | 'xs' | 'sm' | 'md' | 'lg';
	type ClusterAlign = 'start' | 'center' | 'end' | 'baseline';
	type ClusterJustify = 'start' | 'center' | 'end' | 'between';

	interface ClusterProps {
		gap?: ClusterGap;
		align?: ClusterAlign;
		justify?: ClusterJustify;
		/** When false, items stay on one row (no wrap). Default true. */
		wrap?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		gap = 'sm',
		align = 'center',
		justify = 'start',
		wrap = true,
		class: className = '',
		children
	}: ClusterProps = $props();

	const gaps: Record<ClusterGap, string> = {
		none: 'gap-0',
		xs: 'gap-1',
		sm: 'gap-2',
		md: 'gap-3',
		lg: 'gap-4'
	};

	const aligns: Record<ClusterAlign, string> = {
		start: 'items-start',
		center: 'items-center',
		end: 'items-end',
		baseline: 'items-baseline'
	};

	const justifies: Record<ClusterJustify, string> = {
		start: 'justify-start',
		center: 'justify-center',
		end: 'justify-end',
		between: 'justify-between'
	};
</script>

<div
	class={[
		'flex',
		wrap ? 'flex-wrap' : 'flex-nowrap',
		gaps[gap],
		aligns[align],
		justifies[justify],
		className
	]}
>
	{#if children}{@render children()}{/if}
</div>
