<script lang="ts">
	import type { Snippet } from 'svelte';

	type Orientation = 'vertical' | 'horizontal' | 'both';

	interface ScrollAreaProps {
		children?: Snippet;
		maxHeight?: string | number;
		maxWidth?: string | number;
		orientation?: Orientation;
		hideScrollbar?: boolean;
		class?: string;
	}

	let {
		children,
		maxHeight,
		maxWidth,
		orientation = 'vertical',
		hideScrollbar = false,
		class: className = ''
	}: ScrollAreaProps = $props();

	const overflowClass = $derived(
		orientation === 'vertical'
			? 'overflow-x-hidden overflow-y-auto'
			: orientation === 'horizontal'
				? 'overflow-y-hidden overflow-x-auto'
				: 'overflow-auto'
	);

	const styleStr = $derived([
		maxHeight ? `max-height:${typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight}` : '',
		maxWidth ? `max-width:${typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth}` : ''
	].filter(Boolean).join(';'));
</script>

<div
	class={[
		'relative',
		overflowClass,
		hideScrollbar ? 'scrollarea-hidden' : 'scrollarea-styled',
		className
	]}
	style={styleStr || undefined}
>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.scrollarea-styled {
		scrollbar-width: thin;
		scrollbar-color: var(--border) transparent;
	}

	.scrollarea-styled::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}

	.scrollarea-styled::-webkit-scrollbar-track {
		background: transparent;
	}

	.scrollarea-styled::-webkit-scrollbar-thumb {
		background-color: var(--border);
		border-radius: 9999px;
	}

	.scrollarea-styled::-webkit-scrollbar-thumb:hover {
		background-color: var(--border-strong, color-mix(in oklch, var(--border) 150%, transparent));
	}

	.scrollarea-hidden {
		scrollbar-width: none;
	}

	.scrollarea-hidden::-webkit-scrollbar {
		display: none;
	}
</style>
