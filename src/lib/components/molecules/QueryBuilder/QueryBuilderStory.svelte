<script lang="ts">
	import QueryBuilder from './QueryBuilder.svelte';
	import FilterList from '../FilterList/FilterList.svelte';
	import QueryBar from '../QueryBar/QueryBar.svelte';
	import {
		emptyFilterGroup,
		type AdvancedFilterGroup,
		type FilterFieldDef
	} from '$lib/utils/advancedFilters.js';
	import { queryStringToGroup, groupToQueryString } from '$lib/utils/queryBridge.js';

	const fields: FilterFieldDef[] = [
		{
			id: 'brand',
			label: 'Brand',
			type: 'select',
			options: [
				{ value: 'nike', label: 'Nike' },
				{ value: 'adidas', label: 'Adidas' }
			]
		},
		{ id: 'price', label: 'Price', type: 'number' },
		{
			id: 'status',
			label: 'Status',
			type: 'select',
			options: [
				{ value: 'active', label: 'Active' },
				{ value: 'draft', label: 'Draft' }
			]
		}
	];

	let query = $state<AdvancedFilterGroup>(emptyFilterGroup());
	let queryString = $state('brand:nike AND price>=100');

	$effect(() => {
		query = queryStringToGroup(queryString, fields);
	});

	function onSubmit(q: string) {
		queryString = q;
		query = queryStringToGroup(q, fields);
	}

	function onQueryChange(next: AdvancedFilterGroup) {
		query = next;
		queryString = groupToQueryString(next, fields);
	}
</script>

<div class="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
	<QueryBar bind:value={queryString} {fields} onsubmit={onSubmit} />
	<FilterList
		bind:query
		bind:queryString
		{fields}
		showQueryString
		onchange={onQueryChange}
	/>
	<QueryBuilder bind:query {fields} onchange={onQueryChange} />
</div>
