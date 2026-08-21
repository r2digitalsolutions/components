<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { DockSize } from './Dock.svelte';

	interface DockItemProps {
		as?: 'button' | 'a';
		href?: string;
		onclick?: (e: MouseEvent) => void;
		disabled?: boolean;
		active?: boolean;
		size?: DockSize;
		ariaLabel?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		as = 'button',
		href,
		onclick,
		disabled = false,
		active = false,
		size = 'mini',
		ariaLabel,
		class: className = '',
		children
	}: DockItemProps = $props();

	const sizes: Record<DockSize, string> = {
		mini: 'h-7 px-2 text-[11px]',
		sm: 'h-8 px-2.5 text-xs',
		md: 'h-9 px-3 text-sm'
	};

	const classes = $derived([
		'relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap select-none font-medium transition-all duration-150',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
		sizes[size],
		active
			? 'bg-surface-elevated text-primary shadow-sm ring-1 ring-border'
			: 'text-secondary hover:bg-surface-elevated/70 hover:text-primary',
		disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer',
		'[&[data-active]:first-child]:rounded-l-full',
		'[&[data-active]:last-child]:rounded-r-full',
		'[&[data-active]:not(:first-child):not(:last-child)]:rounded-none',
		'[&:not([data-active]):first-child:hover]:rounded-l-full',
		'[&:not([data-active]):last-child:hover]:rounded-r-full',
		'[&:not([data-active]):not(:first-child):not(:last-child):hover]:rounded-none',
		className
	]);
</script>

{#if as === 'a' || href}
	<a {href} aria-label={ariaLabel} data-active={active || undefined} class={classes}>
		{@render children?.()}
	</a>
{:else}
	<button
		type="button"
		{disabled}
		aria-label={ariaLabel}
		aria-pressed={active}
		data-active={active || undefined}
		{onclick}
		class={classes}
	>
		{@render children?.()}
	</button>
{/if}
