<script lang="ts">
	import FilterList from './FilterList.svelte';
	import QueryBar from '../QueryBar/QueryBar.svelte';
	import {
		emptyFilterGroup,
		type AdvancedFilterGroup,
		type FilterFieldDef
	} from '$lib/utils/advancedFilters.js';
	import { queryStringToGroup, groupToQueryString } from '$lib/utils/queryBridge.js';

	const fields: FilterFieldDef[] = [
		{ id: 'brand', label: 'Brand', type: 'text' },
		{ id: 'status', label: 'Status', type: 'select', options: [{ value: 'active', label: 'Active' }] },
		{ id: 'price', label: 'Price', type: 'number' }
	];

	let query = $state<AdvancedFilterGroup>(
		queryStringToGroup('brand:nike AND status:active', fields)
	);
	let queryString = $state(groupToQueryString(query, fields));

	function onSubmit(q: string) {
		queryString = q;
		query = queryStringToGroup(q, fields);
	}
</script>

<div class="mx-auto flex w-full max-w-xl flex-col gap-3 p-4">
	<QueryBar bind:value={queryString} {fields} onsubmit={onSubmit} />
	<FilterList bind:query bind:queryString {fields} showQueryString />
</div>
