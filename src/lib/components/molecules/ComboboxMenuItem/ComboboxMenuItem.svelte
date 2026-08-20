<script lang="ts">
	import type { Snippet } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import { createComboboxItemController } from '$lib/components/molecules/Combobox/combobox-item.svelte.js';

	interface ComboboxMenuItemProps {
		value: string;
		label?: string;
		disabled?: boolean;
		keywords?: string[];
		selected?: boolean;
		highlighted?: boolean;
		register?: boolean;
		class?: string;
		children?: Snippet;
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
		onclick,
		onhighlight
	}: ComboboxMenuItemProps = $props();

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
			'rounded-lg py-1.5 pr-2 pl-8 text-sm relative flex w-full cursor-default items-center text-left outline-none select-none',
			'focus-visible:ring-brand-500/30 transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
			disabled && 'cursor-not-allowed opacity-40',
			!disabled && item.isHighlighted && 'bg-surface-overlay',
			!disabled && !item.isHighlighted && 'hover:bg-surface-overlay',
			!disabled && item.isSelected && 'font-medium text-brand-600 dark:text-brand-400',
			!disabled && !item.isSelected && 'text-primary',
			className
		]}
	>
		<span class="left-2 h-3.5 w-3.5 absolute flex items-center justify-center" aria-hidden="true">
			{#if item.isSelected}
				<Check class="h-3.5 w-3.5" strokeWidth={2.5} />
			{/if}
		</span>

		<span class={['min-w-0 flex-1', !children && 'truncate']}>
			{#if children}
				{@render children()}
			{:else}
				{label || value}
			{/if}
		</span>
	</button>
{/if}
