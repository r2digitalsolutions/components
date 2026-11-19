<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	export type SectionNavIcon = Component<{
		class?: string;
		size?: number | string;
		strokeWidth?: number | string;
	}>;

	export interface SectionNavItem {
		id: string;
		label: string;
		href?: string;
		icon?: SectionNavIcon;
		/** Counter at the end of the row. Hidden when 0 or empty. */
		badge?: string | number;
		/** `brand` = needs attention (filled), `neutral` = informative (grey). */
		badgeTone?: 'brand' | 'neutral';
		disabled?: boolean;
		/** Open in a new tab (e.g. public page). */
		external?: boolean;
	}

	export interface SectionNavGroup {
		id: string;
		label?: string;
		items: SectionNavItem[];
	}

	interface SectionNavProps {
		/** Section name, shown big at the top (e.g. «Escaparate»). */
		title?: string;
		/** One line under the title. */
		description?: string;
		groups?: SectionNavGroup[];
		value?: string;
		class?: string;
		/** Above the title (workspace/org switcher). */
		header?: Snippet;
		/** Pinned to the bottom (progress card, public link…). */
		footer?: Snippet;
		onchange?: (id: string) => void;
	}

	let {
		title,
		description,
		groups = [],
		value = $bindable(''),
		class: className = '',
		header,
		footer,
		onchange
	}: SectionNavProps = $props();

	function select(item: SectionNavItem) {
		if (item.disabled) return;
		if (!item.external) value = item.id;
		onchange?.(item.id);
	}

	const showBadge = (item: SectionNavItem) =>
		item.badge !== undefined && item.badge !== '' && item.badge !== 0;
</script>

{#snippet row(item: SectionNavItem)}
	{@const active = value === item.id}
	{@const cls = [
		'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
		active
			? 'bg-brand-500/12 font-semibold text-brand-700 dark:text-brand-300'
			: 'font-medium text-secondary hover:bg-surface-overlay hover:text-primary',
		item.external && 'text-brand-700 dark:text-brand-300',
		item.disabled && 'pointer-events-none opacity-40'
	]}
	{#snippet content()}
		{#if item.icon}<item.icon class="h-[18px] w-[18px] shrink-0" strokeWidth={1.85} />{/if}
		<span class="min-w-0 flex-1 truncate">{item.label}</span>
		{#if showBadge(item)}
			<span
				class={[
					'h-5 min-w-5 px-1.5 font-bold flex shrink-0 items-center justify-center rounded-full text-[11px]',
					(item.badgeTone ?? 'brand') === 'brand'
						? 'bg-brand-600 text-white'
						: 'bg-surface-overlay text-muted'
				]}>{item.badge}</span
			>
		{/if}
	{/snippet}
	{#if item.href && !item.disabled}
		<a
			href={item.href}
			class={cls}
			aria-current={active ? 'page' : undefined}
			target={item.external ? '_blank' : undefined}
			rel={item.external ? 'noopener' : undefined}
			onclick={() => select(item)}>{@render content()}</a
		>
	{:else}
		<button
			type="button"
			class={cls}
			disabled={item.disabled}
			aria-current={active ? 'page' : undefined}
			onclick={() => select(item)}>{@render content()}</button
		>
	{/if}
{/snippet}

<aside
	class={[
		'w-60 border-border bg-surface-elevated px-3 py-3.5 flex h-full shrink-0 flex-col border-r',
		className
	]}
>
	{#if header}<div class="mb-4">{@render header()}</div>{/if}
	{#if title}
		<div class="mb-3 px-2">
			<p class="text-base font-bold tracking-tight text-primary">{title}</p>
			{#if description}<p class="mt-0.5 text-xs text-muted">{description}</p>{/if}
		</div>
	{/if}
	<nav class="min-h-0 gap-3 flex flex-1 flex-col overflow-y-auto" aria-label={title ?? 'Section'}>
		{#each groups as group (group.id)}
			<div class="gap-0.5 flex flex-col">
				{#if group.label}
					<p class="px-3 pb-1 pt-2 font-semibold tracking-wider text-muted text-[11px] uppercase">
						{group.label}
					</p>
				{/if}
				{#each group.items as item (item.id)}
					{@render row(item)}
				{/each}
			</div>
		{/each}
	</nav>
	{#if footer}<div class="mt-3 gap-2 flex flex-col">{@render footer()}</div>{/if}
</aside>
