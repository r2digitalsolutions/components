<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface ListItem {
		id: string;
		label: string;
		description?: string;
		meta?: string;
		disabled?: boolean;
	}

	export type ListVariant = 'plain' | 'divided' | 'framed';
	export type ListSize = 'sm' | 'md';

	interface ListProps {
		items?: ListItem[];
		value?: string;
		selectable?: boolean;
		variant?: ListVariant;
		size?: ListSize;
		class?: string;
		/** Custom row renderer — receives the item */
		item?: Snippet<[ListItem]>;
		leading?: Snippet<[ListItem]>;
		trailing?: Snippet<[ListItem]>;
		onchange?: (id: string) => void;
		onclick?: (item: ListItem) => void;
	}

	let {
		items = [],
		value = $bindable(''),
		selectable = false,
		variant = 'plain',
		size = 'md',
		class: className = '',
		item: itemSnippet,
		leading,
		trailing,
		onchange,
		onclick
	}: ListProps = $props();

	function activate(row: ListItem) {
		if (row.disabled) return;
		onclick?.(row);
		if (selectable) {
			value = row.id;
			onchange?.(row.id);
		}
	}

	const pad = $derived(size === 'sm' ? 'px-3 py-2' : 'px-3.5 py-2.5');
</script>

<ul
	class={[
		'flex w-full flex-col',
		variant === 'plain' && 'gap-1',
		variant === 'divided' && 'divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface-elevated',
		variant === 'framed' && 'gap-2',
		className
	]}
	role={selectable ? 'listbox' : 'list'}
>
	{#each items as row (row.id)}
		{@const selected = selectable && value === row.id}
		<li
			role={selectable ? 'option' : 'listitem'}
			aria-selected={selectable ? selected : undefined}
			class={variant === 'framed' ? 'overflow-hidden rounded-2xl border border-border bg-surface-elevated' : ''}
		>
			{#if itemSnippet}
				<button
					type="button"
					disabled={row.disabled}
					onclick={() => activate(row)}
					class={[
						'w-full text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:ring-inset',
						variant === 'divided' || variant === 'framed'
							? 'hover:bg-surface-overlay/80'
							: selected
								? 'rounded-xl bg-brand-50 dark:bg-brand-950/40'
								: 'rounded-xl hover:bg-surface-overlay',
						selected && (variant === 'divided' || variant === 'framed') && 'bg-brand-50/80 dark:bg-brand-950/30',
						row.disabled && 'cursor-not-allowed opacity-40'
					]}
				>
					{@render itemSnippet(row)}
				</button>
			{:else}
				<button
					type="button"
					disabled={row.disabled}
					onclick={() => activate(row)}
					class={[
						'flex w-full items-start gap-3 text-left transition-colors',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
						pad,
						variant === 'plain' && 'rounded-xl',
						selected
							? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
							: 'text-primary hover:bg-surface-overlay',
						row.disabled && 'cursor-not-allowed opacity-40'
					]}
				>
					{#if leading}
						<div class="shrink-0 pt-0.5">
							{@render leading(row)}
						</div>
					{/if}
					<span class="min-w-0 flex-1">
						<span class="block text-sm font-medium">{row.label}</span>
						{#if row.description}
							<span class="mt-0.5 block text-xs text-secondary">{row.description}</span>
						{/if}
						{#if row.meta}
							<span class="mt-1 block text-[11px] text-muted">{row.meta}</span>
						{/if}
					</span>
					{#if trailing}
						<div class="shrink-0">
							{@render trailing(row)}
						</div>
					{/if}
				</button>
			{/if}
		</li>
	{/each}
</ul>
