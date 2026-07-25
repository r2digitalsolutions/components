<script lang="ts">
	import { onMount } from 'svelte';
	import type { Component } from 'svelte';

	export interface ChipBarItem {
		id: string;
		label: string;
		count?: number;
		disabled?: boolean;
		/** Optional Lucide (or any) icon component */
		icon?: Component;
	}

	export type ChipBarSize = 'sm' | 'md';
	export type ChipBarVariant = 'soft' | 'solid' | 'outline';

	interface ChipBarProps {
		items?: ChipBarItem[];
		value?: string;
		multi?: boolean;
		values?: string[];
		size?: ChipBarSize;
		variant?: ChipBarVariant;
		/** Fade edges only when content overflows / is scrolled */
		fade?: boolean;
		ariaLabel?: string;
		class?: string;
		onchange?: (id: string) => void;
		onchangeMulti?: (ids: string[]) => void;
	}

	let {
		items = [],
		value = $bindable(''),
		multi = false,
		values = $bindable<string[]>([]),
		size = 'md',
		variant = 'soft',
		fade = true,
		ariaLabel = 'Filters',
		class: className = '',
		onchange,
		onchangeMulti
	}: ChipBarProps = $props();

	let scroller = $state<HTMLDivElement | null>(null);
	let canScrollLeft = $state(false);
	let canScrollRight = $state(false);

	function updateFade() {
		const el = scroller;
		if (!el) {
			canScrollLeft = false;
			canScrollRight = false;
			return;
		}
		const max = el.scrollWidth - el.clientWidth;
		canScrollLeft = el.scrollLeft > 2;
		canScrollRight = max > 2 && el.scrollLeft < max - 2;
	}

	onMount(() => {
		updateFade();
		const el = scroller;
		if (!el || typeof ResizeObserver === 'undefined') return;
		const ro = new ResizeObserver(() => updateFade());
		ro.observe(el);
		return () => ro.disconnect();
	});

	$effect(() => {
		// Recompute when items change
		items;
		queueMicrotask(updateFade);
	});

	function select(id: string, disabled?: boolean) {
		if (disabled) return;
		if (multi) {
			values = values.includes(id) ? values.filter((v) => v !== id) : [...values, id];
			onchangeMulti?.(values);
			return;
		}
		value = id;
		onchange?.(id);
	}

	function active(id: string) {
		return multi ? values.includes(id) : value === id;
	}

	const sizes: Record<ChipBarSize, string> = {
		sm: 'gap-1.5 px-2.5 py-1 text-xs',
		md: 'gap-1.5 px-3 py-1.5 text-sm'
	};

	const iconSizes: Record<ChipBarSize, string> = {
		sm: 'h-3.5 w-3.5',
		md: 'h-4 w-4'
	};

	function chipClass(isActive: boolean) {
		if (variant === 'solid') {
			return isActive
				? 'border-brand-500 bg-brand-500 text-white shadow-sm'
				: 'border-border bg-surface-elevated text-secondary hover:border-border-strong hover:bg-surface-overlay hover:text-primary';
		}
		if (variant === 'outline') {
			return isActive
				? 'border-brand-500 text-brand-700 ring-1 ring-brand-500/20 dark:text-brand-300'
				: 'border-border bg-transparent text-secondary hover:border-border-strong hover:text-primary';
		}
		return isActive
			? 'border-brand-500/35 bg-brand-500/10 text-brand-700 dark:border-brand-400/30 dark:bg-brand-500/15 dark:text-brand-300'
			: 'border-border/80 bg-surface-elevated text-secondary hover:border-border-strong hover:bg-surface-overlay hover:text-primary';
	}
</script>

<div class={['relative', className]}>
	{#if fade && canScrollLeft}
		<div
			class="pointer-events-none absolute inset-y-0 left-0 z-10 w-7 bg-gradient-to-r from-surface to-transparent"
			aria-hidden="true"
		></div>
	{/if}
	{#if fade && canScrollRight}
		<div
			class="pointer-events-none absolute inset-y-0 right-0 z-10 w-7 bg-gradient-to-l from-surface to-transparent"
			aria-hidden="true"
		></div>
	{/if}

	<div
		bind:this={scroller}
		class="flex gap-2 overflow-x-auto py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		role="listbox"
		aria-label={ariaLabel}
		aria-multiselectable={multi}
		onscroll={updateFade}
	>
		{#each items as item (item.id)}
			{@const isActive = active(item.id)}
			<button
				type="button"
				role="option"
				aria-selected={isActive}
				disabled={item.disabled}
				class={[
					'inline-flex shrink-0 items-center rounded-full border font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
					sizes[size],
					chipClass(isActive)
				]}
				onclick={() => select(item.id, item.disabled)}
			>
				{#if item.icon}
					{@const Icon = item.icon}
					<Icon class={iconSizes[size]} aria-hidden="true" />
				{/if}
				<span>{item.label}</span>
				{#if item.count !== undefined}
					<span
						class={[
							'rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums',
							isActive
								? variant === 'solid'
									? 'bg-white/20 text-white'
									: 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
								: 'bg-surface-overlay text-muted'
						]}
					>
						{item.count}
					</span>
				{/if}
			</button>
		{/each}
	</div>
</div>
