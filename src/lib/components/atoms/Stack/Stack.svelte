<script lang="ts">
	import type { Snippet } from 'svelte';

	type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
	type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
	type StackDirection = 'vertical' | 'horizontal';

	interface StackProps {
		gap?: StackGap;
		align?: StackAlign;
		justify?: StackJustify;
		direction?: StackDirection;
		class?: string;
		children?: Snippet;
	}

	let {
		gap = 'md',
		align = 'stretch',
		justify = 'start',
		direction = 'vertical',
		class: className = '',
		children
	}: StackProps = $props();

	const gaps: Record<StackGap, string> = {
		none: 'gap-0',
		xs: 'gap-1',
		sm: 'gap-2',
		md: 'gap-4',
		lg: 'gap-6',
		xl: 'gap-8'
	};

	const aligns: Record<StackAlign, string> = {
		start: 'items-start',
		center: 'items-center',
		end: 'items-end',
		stretch: 'items-stretch',
		baseline: 'items-baseline'
	};

	const justifies: Record<StackJustify, string> = {
		start: 'justify-start',
		center: 'justify-center',
		end: 'justify-end',
		between: 'justify-between',
		around: 'justify-around',
		evenly: 'justify-evenly'
	};
</script>

<div
	class={[
		'flex',
		direction === 'vertical' ? 'flex-col' : 'flex-row',
		gaps[gap],
		aligns[align],
		justifies[justify],
		className
	]}
>
	{#if children}{@render children()}{/if}
</div>
