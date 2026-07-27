<script lang="ts">
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import {
		emptyFilterGroup,
		type AdvancedFilterGroup,
		type FilterFieldDef
	} from '$lib/utils/advancedFilters.js';
	import {
		groupToFilterItems,
		groupToQueryString,
		removeRuleFromGroup
	} from '$lib/utils/queryBridge.js';

	interface FilterListProps {
		fields?: FilterFieldDef[];
		query?: AdvancedFilterGroup;
		/** Optional QueryBar string mirror */
		queryString?: string;
		emptyLabel?: string;
		clearAllLabel?: string;
		showQueryString?: boolean;
		class?: string;
		onchange?: (query: AdvancedFilterGroup) => void;
		onclear?: (ruleId: string) => void;
		onclearAll?: () => void;
		onquerystring?: (value: string) => void;
	}

	let {
		fields = [],
		query = $bindable(emptyFilterGroup()),
		queryString = $bindable(''),
		emptyLabel = 'No active filters',
		clearAllLabel = 'Clear all',
		showQueryString = false,
		class: className = '',
		onchange,
		onclear,
		onclearAll,
		onquerystring
	}: FilterListProps = $props();

	const items = $derived(groupToFilterItems(query, fields));

	function syncString(next: AdvancedFilterGroup) {
		const s = groupToQueryString(next, fields);
		queryString = s;
		onquerystring?.(s);
	}

	function remove(id: string) {
		query = removeRuleFromGroup(query, id);
		syncString(query);
		onchange?.(query);
		onclear?.(id);
	}

	function clearAll() {
		query = emptyFilterGroup(query.combinator);
		syncString(query);
		onchange?.(query);
		onclearAll?.();
	}

</script>

<div
	class={['flex flex-col gap-2', className]}
	role="group"
	aria-label="Active filters"
	data-filter-list
>
	{#if items.length === 0}
		<p class="text-xs text-muted">{emptyLabel}</p>
	{:else}
		<div class="flex flex-wrap items-center gap-1.5">
			{#each items as item (item.id)}
				<span class="inline-flex items-center gap-1">
					<Chip
						size="sm"
						variant="primary"
						dismissible
						ondismiss={() => remove(item.id)}
					>
						{item.label}
					</Chip>
				</span>
			{/each}
			{#if items.length > 0}
				<Button variant="ghost" size="sm" onclick={clearAll}>{clearAllLabel}</Button>
			{/if}
		</div>
	{/if}

	{#if showQueryString && queryString}
		<code class="block truncate rounded-lg bg-surface-overlay px-2 py-1 font-mono text-[11px] text-muted">
			{queryString}
		</code>
	{/if}
</div>
