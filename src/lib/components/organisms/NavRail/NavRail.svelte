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
		/** Small counter on the icon (pending items). Hidden when 0 or empty. */
		badge?: string | number;
	}

	export type NavRailVariant = 'default' | 'solid';

	interface NavRailProps {
		items?: NavRailItem[];
		footerItems?: NavRailItem[];
		value?: string;
		/**
		 * default — neutral surface, icon-only with tooltips.
		 * solid — brand-coloured bar (workspace apps), works best with `showLabels`.
		 */
		variant?: NavRailVariant;
		/** Show the label under each icon (wider rail, no tooltip). */
		showLabels?: boolean;
		class?: string;
		brand?: Snippet;
		/** Rendered at the very bottom (avatar, account menu…). */
		footer?: Snippet;
		onchange?: (id: string) => void;
	}

	let {
		items = [],
		footerItems = [],
		value = $bindable(''),
		variant = 'default',
		showLabels = false,
		class: className = '',
		brand,
		footer,
		onchange
	}: NavRailProps = $props();

	const solid = $derived(variant === 'solid');

	function select(id: string, disabled?: boolean) {
		if (disabled) return;
		value = id;
		onchange?.(id);
	}

	const hasBadge = (item: NavRailItem) =>
		item.badge !== undefined && item.badge !== '' && item.badge !== 0;

	const itemClass = (item: NavRailItem) => {
		const active = value === item.id;
		return [
			'group relative flex items-center justify-center rounded-xl transition-colors',
			'focus-visible:outline-none focus-visible:ring-2',
			showLabels ? 'w-[4.25rem] flex-col gap-1 px-0.5 pb-1.5 pt-2' : 'h-10 w-10',
			solid
				? [
						'focus-visible:ring-white/40',
						active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
					]
				: [
						'focus-visible:ring-brand-500/30',
						active
							? 'bg-brand-500/15 text-brand-500'
							: 'text-secondary hover:bg-surface-overlay hover:text-primary'
					],
			item.disabled && 'pointer-events-none cursor-not-allowed opacity-40'
		];
	};

	const glyphClass = (item: NavRailItem) =>
		[
			'h-5 w-5',
			solid
				? 'text-current'
				: value === item.id
					? 'text-brand-500'
					: 'text-secondary group-hover:text-primary'
		].join(' ');
</script>

{#snippet inner(item: NavRailItem)}
	<span class="relative inline-flex">
		{#if item.icon}
			<item.icon class={glyphClass(item)} strokeWidth={1.75} />
		{:else}
			<span class={['text-xs font-semibold', !solid && value === item.id && 'text-brand-500']}>
				{item.label.slice(0, 1)}
			</span>
		{/if}
		{#if hasBadge(item)}
			<span
				class={[
					'-right-2.5 -top-1.5 h-4 min-w-4 px-1 font-bold absolute flex items-center justify-center rounded-full text-[9.5px] leading-none',
					solid ? 'bg-amber-400 text-amber-950' : 'bg-red-500 text-white'
				]}
			>
				{item.badge}
			</span>
		{/if}
	</span>
	{#if showLabels}
		<span class="font-semibold leading-tight max-w-full truncate text-[10.5px]">{item.label}</span>
	{/if}
{/snippet}

{#snippet railButton(item: NavRailItem)}
	{#snippet control()}
		{#if showLabels && solid && value === item.id}
			<span
				class="-left-2 bottom-3 top-3 w-1 bg-brand-200 absolute rounded-r-full"
				aria-hidden="true"
			></span>
		{/if}
		{#if item.href && !item.disabled}
			<a
				href={item.href}
				aria-label={showLabels ? undefined : item.label}
				aria-current={value === item.id ? 'page' : undefined}
				class={itemClass(item)}
				onclick={() => select(item.id, item.disabled)}
			>
				{@render inner(item)}
			</a>
		{:else}
			<button
				type="button"
				aria-label={showLabels ? undefined : item.label}
				aria-current={value === item.id ? 'page' : undefined}
				disabled={item.disabled}
				class={itemClass(item)}
				onclick={() => select(item.id, item.disabled)}
			>
				{@render inner(item)}
			</button>
		{/if}
	{/snippet}
	{#if showLabels}
		<div class="relative flex w-full justify-center">{@render control()}</div>
	{:else}
		<Tooltip content={item.label} side="right" class="relative w-full justify-center">
			{#if !solid}<RailMark active={value === item.id} length="full" class="z-10" />{/if}
			{@render control()}
		</Tooltip>
	{/if}
{/snippet}

<aside
	class={[
		'py-3 flex h-full shrink-0 flex-col items-center',
		showLabels ? 'w-[5rem]' : 'w-14',
		solid
			? 'from-brand-700 to-brand-800 text-white bg-gradient-to-b'
			: 'border-border bg-surface-elevated border-r',
		className
	]}
>
	{#if brand}
		<div class="mb-3 px-2 flex items-center justify-center">
			{@render brand()}
		</div>
	{/if}

	<nav class="gap-1 flex w-full flex-1 flex-col items-center" aria-label="Rail">
		{#each items as item (item.id)}
			{@render railButton(item)}
		{/each}
	</nav>

	{#if footerItems.length > 0}
		{#if !solid}<div class="w-8 py-2"><Divider /></div>{/if}
		<nav class="gap-1 flex w-full flex-col items-center" aria-label="Rail footer">
			{#each footerItems as item (item.id)}
				{@render railButton(item)}
			{/each}
		</nav>
	{/if}

	{#if footer}
		<div class="mt-2 flex items-center justify-center">{@render footer()}</div>
	{/if}
</aside>
