<script lang="ts">
	import type { Snippet } from 'svelte';

	export type HitAreaElement = 'button' | 'div' | 'span';

	interface HitAreaProps {
		minSize?: number;
		as?: HitAreaElement;
		children?: Snippet;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		disabled?: boolean;
		label?: string;
	}

	const {
		minSize = 44,
		as = 'button',
		children,
		class: className = '',
		onclick,
		disabled = false,
		label
	}: HitAreaProps = $props();

	const touchStyle = $derived(
		`min-width: ${minSize}px; min-height: ${minSize}px;`
	);
</script>

<svelte:element
	this={as}
	class={[
		'inline-flex shrink-0 items-center justify-center',
		as === 'button' &&
			'cursor-pointer border-none bg-transparent p-0 text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className
	]}
	style={touchStyle}
	{onclick}
	disabled={as === 'button' ? disabled : undefined}
	aria-label={as === 'button' ? label : undefined}
	role={as !== 'button' && label ? 'button' : undefined}
	tabindex={as !== 'button' && label && !disabled ? 0 : undefined}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
