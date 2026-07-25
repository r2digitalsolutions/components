<script lang="ts">
	import type { Snippet } from 'svelte';

	type CenterAxis = 'both' | 'x' | 'y';
	type CenterAlign = 'start' | 'center' | 'end';
	type CenterPadding = 'none' | 'sm' | 'md' | 'lg';

	interface CenterProps {
		/** Center on both axes (default) or only inline / block */
		axis?: CenterAxis;
		/** Cross-axis alignment when axis is x or y */
		align?: CenterAlign;
		/** Intrinsic max width of the centered child wrapper */
		maxWidth?: string;
		padding?: CenterPadding;
		/** Min height for vertical centering */
		minHeight?: string;
		/** Stretch to fill parent height when minHeight is not set */
		fill?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		axis = 'both',
		align = 'center',
		maxWidth,
		padding = 'none',
		minHeight,
		fill = false,
		class: className = '',
		children
	}: CenterProps = $props();

	const paddings: Record<CenterPadding, string> = {
		none: 'p-0',
		sm: 'p-3',
		md: 'p-6',
		lg: 'p-10'
	};

	const alignX: Record<CenterAlign, string> = {
		start: 'justify-start',
		center: 'justify-center',
		end: 'justify-end'
	};

	const alignY: Record<CenterAlign, string> = {
		start: 'items-start',
		center: 'items-center',
		end: 'items-end'
	};
</script>

<div
	class={[
		'flex w-full',
		fill && 'h-full min-h-0',
		paddings[padding],
		axis === 'both' && 'items-center justify-center',
		axis === 'x' && [alignX[align], 'items-stretch'],
		axis === 'y' && [alignY[align], 'justify-stretch'],
		className
	]}
	style:min-height={minHeight}
>
	{#if maxWidth}
		<div class="w-full" style:max-width={maxWidth}>
			{#if children}{@render children()}{/if}
		</div>
	{:else if children}
		{@render children()}
	{/if}
</div>
