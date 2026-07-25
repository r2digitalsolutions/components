<script module lang="ts">
	export interface SortOption {
		value: string;
		label: string;
	}

	export const DEFAULT_SORT_OPTIONS: SortOption[] = [
		{ value: 'relevance', label: 'Relevance' },
		{ value: 'price_asc', label: 'Price: low to high' },
		{ value: 'price_desc', label: 'Price: high to low' },
		{ value: 'newest', label: 'Newest' },
		{ value: 'rating', label: 'Top rated' }
	];
</script>

<script lang="ts">
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import type { SelectOption } from '$lib/components/molecules/Select/Select.svelte';

	interface SortSelectProps {
		value?: string;
		options?: SortOption[];
		label?: string;
		placeholder?: string;
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable('relevance'),
		options = DEFAULT_SORT_OPTIONS,
		label = 'Sort by',
		placeholder = 'Sort by…',
		size = 'sm',
		disabled = false,
		class: className = '',
		onchange
	}: SortSelectProps = $props();

	const selectOptions = $derived<SelectOption[]>(
		options.map((o) => ({ value: o.value, label: o.label }))
	);
</script>

<div class={['inline-flex min-w-[11rem]', className]}>
	<Select
		{label}
		{placeholder}
		{size}
		{disabled}
		options={selectOptions}
		bind:value
		onchange={(v) => onchange?.(v)}
	/>
</div>
