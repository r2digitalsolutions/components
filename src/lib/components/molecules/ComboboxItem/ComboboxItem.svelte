<script lang="ts">
	import type { Snippet } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import { createComboboxItemController } from '$lib/components/molecules/Combobox/combobox-item.svelte.js';

	interface ComboboxItemProps {
		value: string;
		/** Used for default text and query filtering when nested in `Combobox`. */
		label?: string;
		disabled?: boolean;
		/** Extra strings matched against the parent `Combobox` query. */
		keywords?: string[];
		/**
		 * When omitted, selection comes from the parent `Combobox`.
		 * Pass explicitly when using the item standalone.
		 */
		selected?: boolean;
		/**
		 * When omitted, highlight comes from the parent `Combobox`.
		 * Pass explicitly when using the item standalone.
		 */
		highlighted?: boolean;
		/**
		 * Register this row for keyboard navigation / query filtering.
		 * Internal `Combobox` rows set this to `false` (parent already filters).
		 */
		register?: boolean;
		class?: string;
		children?: Snippet;
		leading?: Snippet;
		trailing?: Snippet;
		onclick?: () => void;
		onhighlight?: () => void;
	}

	let {
		value,
		label = '',
		disabled = false,
		keywords = [],
		selected,
		highlighted,
		register = true,
		class: className = '',
		children,
		leading,
		trailing,
		onclick,
		onhighlight
	}: ComboboxItemProps = $props();

	const item = createComboboxItemController(() => ({
		value,
		label,
		disabled,
		keywords,
		selected,
		highlighted,
		register,
		onclick
	}));
</script>

{#if item.matchesQuery}
	<button
		type="button"
		role="option"
		data-value={value}
		{disabled}
		aria-selected={item.isSelected}
		aria-disabled={disabled}
		onpointerenter={() => {
			onhighlight?.();
			item.highlight();
		}}
		onclick={item.activate}
		class={[
			'gap-2 rounded-lg px-2.5 py-2 text-sm flex w-full items-center text-left transition-colors',
			'focus-visible:ring-brand-500/30 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
			disabled && 'cursor-not-allowed opacity-40',
			!disabled &&
				(item.isHighlighted || item.isSelected
					? 'bg-brand-500 text-white'
					: 'text-primary hover:bg-surface-overlay'),
			className
		]}
	>
		{#if leading}
			<span class="flex shrink-0 items-center">{@render leading()}</span>
		{/if}

		<span class={['min-w-0 flex-1', !children && 'truncate']}>
			{#if children}
				{@render children()}
			{:else}
				{label || value}
			{/if}
		</span>

		{#if trailing}
			<span class="flex shrink-0 items-center">{@render trailing()}</span>
		{:else if item.isSelected}
			<Check class="h-4 w-4 shrink-0" strokeWidth={2.5} />
		{/if}
	</button>
{/if}
