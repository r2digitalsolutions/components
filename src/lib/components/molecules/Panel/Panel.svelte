<script lang="ts">
	import type { Snippet } from 'svelte';
	import PanelHeader from '$lib/components/atoms/PanelHeader/PanelHeader.svelte';
	import ScrollArea from '$lib/components/atoms/ScrollArea/ScrollArea.svelte';

	export type PanelPadding = 'none' | 'sm' | 'md';

	interface PanelProps {
		title?: string;
		description?: string;
		collapsible?: boolean;
		collapsed?: boolean;
		/** Show border/surface chrome (default true) */
		chrome?: boolean;
		padding?: PanelPadding;
		/** Fill parent height (typical in editor docks) */
		fill?: boolean;
		headerVariant?: 'subtle' | 'solid' | 'ghost';
		headerSize?: 'sm' | 'md';
		class?: string;
		icon?: Snippet;
		actions?: Snippet;
		children?: Snippet;
		ontoggle?: (collapsed: boolean) => void;
	}

	let {
		title,
		description = '',
		collapsible = false,
		collapsed = $bindable(false),
		chrome = true,
		padding = 'sm',
		fill = true,
		headerVariant = 'subtle',
		headerSize = 'sm',
		class: className = '',
		icon,
		actions,
		children,
		ontoggle
	}: PanelProps = $props();

	const paddings: Record<PanelPadding, string> = {
		none: 'p-0',
		sm: 'p-2',
		md: 'p-3'
	};
</script>

<div
	class={[
		'flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface-elevated',
		chrome && 'border border-border',
		fill && 'h-full',
		className
	]}
>
	{#if title}
		<PanelHeader
			{title}
			{description}
			{collapsible}
			bind:collapsed
			variant={headerVariant}
			size={headerSize}
			{icon}
			{actions}
			ontoggle={(value) => ontoggle?.(value)}
		/>
	{/if}

	{#if !collapsed}
		<div class={['min-h-0 flex-1', fill ? 'overflow-hidden' : '']}>
			{#if fill}
				<ScrollArea class={['h-full', paddings[padding]].filter(Boolean).join(' ')}>
					{#if children}
						{@render children()}
					{/if}
				</ScrollArea>
			{:else}
				<div class={paddings[padding]}>
					{#if children}
						{@render children()}
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
