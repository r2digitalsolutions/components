<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import Tooltip from '$lib/components/atoms/Tooltip/Tooltip.svelte';
	import RailMark from '$lib/components/atoms/RailMark/RailMark.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';

	export type NavRailIcon = Component<{
		class?: string;
		size?: number | string;
		strokeWidth?: number | string;
	}>;

	export interface NavRailItem {
		id: string;
		label: string;
		href?: string;
		icon?: NavRailIcon;
		disabled?: boolean;
	}

	interface NavRailProps {
		items?: NavRailItem[];
		footerItems?: NavRailItem[];
		value?: string;
		class?: string;
		brand?: Snippet;
		onchange?: (id: string) => void;
	}

	let {
		items = [],
		footerItems = [],
		value = $bindable(''),
		class: className = '',
		brand,
		onchange
	}: NavRailProps = $props();

	function select(id: string, disabled?: boolean) {
		if (disabled) return;
		value = id;
		onchange?.(id);
	}

	const itemClass = (item: NavRailItem) => [
		'relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
		value === item.id
			? 'bg-surface-overlay text-primary'
			: 'text-secondary hover:bg-surface-overlay hover:text-primary',
		item.disabled && 'pointer-events-none cursor-not-allowed opacity-40'
	];
</script>

{#snippet railButton(item: NavRailItem)}
	<Tooltip content={item.label} side="right">
		<span class="relative inline-flex">
			<RailMark active={value === item.id} length="short" inset="sm" />
			{#if item.href && !item.disabled}
				<a
					href={item.href}
					aria-label={item.label}
					aria-current={value === item.id ? 'page' : undefined}
					class={itemClass(item)}
					onclick={() => select(item.id, item.disabled)}
				>
					{#if item.icon}
						<item.icon class="h-5 w-5" strokeWidth={1.75} />
					{:else}
						<span class="text-xs font-semibold">{item.label.slice(0, 1)}</span>
					{/if}
				</a>
			{:else}
				<button
					type="button"
					aria-label={item.label}
					aria-current={value === item.id ? 'page' : undefined}
					disabled={item.disabled}
					class={itemClass(item)}
					onclick={() => select(item.id, item.disabled)}
				>
					{#if item.icon}
						<item.icon class="h-5 w-5" strokeWidth={1.75} />
					{:else}
						<span class="text-xs font-semibold">{item.label.slice(0, 1)}</span>
					{/if}
				</button>
			{/if}
		</span>
	</Tooltip>
{/snippet}

<aside
	class={[
		'w-14 border-border bg-surface-elevated py-3 flex h-full shrink-0 flex-col items-center border-r',
		className
	]}
>
	{#if brand}
		<div class="mb-3 px-2 flex items-center justify-center">
			{@render brand()}
		</div>
	{/if}

	<nav class="gap-1 flex flex-1 flex-col items-center" aria-label="Rail">
		{#each items as item (item.id)}
			{@render railButton(item)}
		{/each}
	</nav>

	{#if footerItems.length > 0}
		<div class="w-8 py-2"><Divider /></div>
		<nav class="gap-1 flex flex-col items-center" aria-label="Rail footer">
			{#each footerItems as item (item.id)}
				{@render railButton(item)}
			{/each}
		</nav>
	{/if}
</aside>
