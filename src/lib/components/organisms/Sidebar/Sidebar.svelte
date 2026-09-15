<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';
	import RailMark from '$lib/components/atoms/RailMark/RailMark.svelte';

	export type SidebarIcon = Component<{
		class?: string;
		size?: number | string;
		strokeWidth?: number | string;
	}>;

	export interface SidebarItem {
		id: string;
		label: string;
		href?: string;
		icon?: SidebarIcon;
		disabled?: boolean;
		/** Completed step (wizard / stepper). Shows a check when not active. */
		done?: boolean;
		/** Optional short hint (e.g. warning). */
		hint?: string;
	}

	export interface SidebarGroup {
		id: string;
		label?: string;
		items: SidebarItem[];
	}

	interface SidebarProps {
		brand?: string;
		groups?: SidebarGroup[];
		value?: string;
		collapsed?: boolean;
		/** Show the collapse toggle. Default true. */
		collapsible?: boolean;
		class?: string;
		header?: Snippet;
		footer?: Snippet;
		onchange?: (id: string) => void;
	}

	let {
		brand = 'App',
		groups = [],
		value = $bindable(''),
		collapsed = $bindable(false),
		collapsible = true,
		class: className = '',
		header,
		footer,
		onchange
	}: SidebarProps = $props();

	function select(id: string, disabled?: boolean) {
		if (disabled) return;
		value = id;
		onchange?.(id);
	}

	function itemClass(item: SidebarItem) {
		const active = value === item.id;
		return [
			'relative flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
			active
				? 'bg-surface-overlay font-medium text-primary'
				: item.done
					? 'text-secondary hover:bg-surface-overlay hover:text-primary'
					: 'text-secondary hover:bg-surface-overlay hover:text-primary',
			item.disabled && 'pointer-events-none cursor-not-allowed opacity-40',
			collapsed && 'justify-center'
		];
	}
</script>

{#snippet checkIcon()}
	<svg
		class="text-brand-600 dark:text-brand-400 h-4 w-4 shrink-0"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.25"
		aria-hidden="true"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
	</svg>
{/snippet}

{#snippet itemGlyph(item: SidebarItem)}
	{#if item.done && value !== item.id}
		{@render checkIcon()}
	{:else if item.icon}
		<item.icon class="h-4 w-4 shrink-0" strokeWidth={1.75} />
	{:else}
		<span
			class={[
				'h-6 w-6 rounded-md font-semibold flex shrink-0 items-center justify-center text-[11px]',
				item.done
					? 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
					: 'bg-surface-overlay'
			]}
		>
			{item.label.slice(0, 1)}
		</span>
	{/if}
{/snippet}

{#snippet navItem(item: SidebarItem)}
	{#if item.href && !item.disabled}
		<a
			href={item.href}
			title={collapsed ? item.label : undefined}
			aria-current={value === item.id ? 'page' : undefined}
			class={itemClass(item)}
			onclick={() => select(item.id, item.disabled)}
		>
			<RailMark active={value === item.id} side="right" length="short" inset="sm" />
			{@render itemGlyph(item)}
			{#if !collapsed}
				<span class="min-w-0 flex-1 truncate">{item.label}</span>
				{#if item.hint}
					<span class="text-amber-600 dark:text-amber-400 shrink-0 text-[10px]">{item.hint}</span>
				{/if}
			{/if}
		</a>
	{:else}
		<button
			type="button"
			disabled={item.disabled}
			title={collapsed ? item.label : undefined}
			aria-current={value === item.id ? 'page' : undefined}
			aria-checked={item.done ? 'true' : undefined}
			class={itemClass(item)}
			onclick={() => select(item.id, item.disabled)}
		>
			<RailMark active={value === item.id} side="right" length="short" inset="sm" />
			{@render itemGlyph(item)}
			{#if !collapsed}
				<span class="min-w-0 flex-1 truncate">{item.label}</span>
				{#if item.hint}
					<span class="text-amber-600 dark:text-amber-400 shrink-0 text-[10px]">{item.hint}</span>
				{/if}
			{/if}
		</button>
	{/if}
{/snippet}

<aside
	class={[
		'border-border bg-surface-elevated flex h-full flex-col border-r transition-[width] duration-200',
		collapsed ? 'w-[4.25rem]' : 'w-60',
		className
	]}
>
	<div
		class={[
			'gap-2 px-3 py-4 flex items-center',
			collapsed ? 'justify-center' : header || !collapsible ? 'justify-start' : 'justify-between'
		]}
	>
		{#if header && !collapsed}
			<div class="min-w-0 flex-1">{@render header()}</div>
		{:else if !collapsed}
			<span class="text-sm font-semibold text-primary truncate">{brand}</span>
		{/if}
		{#if collapsible}
			<button
				type="button"
				onclick={() => (collapsed = !collapsed)}
				class="rounded-lg p-2 text-secondary hover:bg-surface-overlay hover:text-primary focus-visible:ring-brand-500/30 focus-visible:ring-2 focus-visible:outline-none"
				aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			>
				<svg
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					{#if collapsed}
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h10M4 18h16" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					{/if}
				</svg>
			</button>
		{/if}
	</div>

	<nav class="px-2 pb-3 flex-1 overflow-y-auto">
		{#each groups as group, gi (group.id)}
			{#if group.label && !collapsed}
				<p class="mb-1 mt-3 px-2 font-semibold tracking-wide text-muted text-[11px] uppercase">
					{group.label}
				</p>
			{:else if gi > 0}
				<div class="my-2 px-2"><Divider /></div>
			{/if}
			<ul class="gap-0.5 flex flex-col">
				{#each group.items as item (item.id)}
					<li>
						{@render navItem(item)}
					</li>
				{/each}
			</ul>
		{/each}
	</nav>

	{#if footer}
		<div class={['border-border min-w-0 border-t p-3', collapsed && 'flex justify-center']}>
			{@render footer()}
		</div>
	{/if}
</aside>
