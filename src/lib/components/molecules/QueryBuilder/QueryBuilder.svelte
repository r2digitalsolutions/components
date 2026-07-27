<script lang="ts">
	import AdvancedFilters from '$lib/components/molecules/AdvancedFilters/AdvancedFilters.svelte';
	import {
		emptyFilterGroup,
		type AdvancedFilterGroup,
		type FilterFieldDef
	} from '$lib/utils/advancedFilters.js';

	export type { FilterFieldDef, AdvancedFilterGroup };

	interface QueryBuilderProps {
		fields?: FilterFieldDef[];
		query?: AdvancedFilterGroup;
		title?: string;
		applyLabel?: string;
		/** Tighter padding / smaller chrome */
		compact?: boolean;
		class?: string;
		onchange?: (query: AdvancedFilterGroup) => void;
		onapply?: (query: AdvancedFilterGroup) => void;
	}

	let {
		fields = [],
		query = $bindable(emptyFilterGroup()),
		title = 'Query builder',
		applyLabel = 'Apply',
		compact = false,
		class: className = '',
		onchange,
		onapply
	}: QueryBuilderProps = $props();
</script>

<div
	class={[
		'rounded-xl border border-border bg-surface-elevated',
		compact ? 'p-2' : 'p-3',
		className
	]}
	data-query-builder
>
	<AdvancedFilters
		bind:query
		{fields}
		{title}
		{applyLabel}
		{onchange}
		{onapply}
		class={compact ? 'text-sm' : ''}
	/>
</div>
