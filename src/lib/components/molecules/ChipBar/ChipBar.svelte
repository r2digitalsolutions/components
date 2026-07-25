<script lang="ts">
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
		/** Fade edges when content overflows horizontally */
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
		// soft (default)
		return isActive
			? 'border-brand-500/35 bg-brand-500/10 text-brand-700 dark:border-brand-400/30 dark:bg-brand-500/15 dark:text-brand-300'
			: 'border-border/80 bg-surface-elevated text-secondary hover:border-border-strong hover:bg-surface-overlay hover:text-primary';
	}
</script>

<div
	class={[
		'relative',
		fade &&
			'before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-6 before:bg-gradient-to-r before:from-surface before:to-transparent after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-6 after:bg-gradient-to-l after:from-surface after:to-transparent',
		className
	]}
>
	<div
		class="flex gap-2 overflow-x-auto px-0.5 py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		role="listbox"
		aria-label={ariaLabel}
		aria-multiselectable={multi}
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
