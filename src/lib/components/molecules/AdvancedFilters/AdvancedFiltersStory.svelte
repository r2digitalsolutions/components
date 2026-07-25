<script lang="ts">
	import AdvancedFilters from './AdvancedFilters.svelte';
	import {
		emptyFilterGroup,
		type AdvancedFilterGroup,
		type FilterFieldDef
	} from '$lib/utils/advancedFilters.js';

	const fields: FilterFieldDef[] = [
		{
			id: 'brand',
			label: 'Brand',
			type: 'select',
			options: [
				{ value: 'nike', label: 'Nike' },
				{ value: 'adidas', label: 'Adidas' },
				{ value: 'puma', label: 'Puma' },
				{ value: 'asics', label: 'Asics' }
			]
		},
		{
			id: 'status',
			label: 'Status',
			type: 'select',
			options: [
				{ value: 'active', label: 'Active' },
				{ value: 'draft', label: 'Draft' },
				{ value: 'archived', label: 'Archived' }
			]
		},
		{
			id: 'tags',
			label: 'Tags',
			type: 'multiselect',
			options: [
				{ value: 'sale', label: 'Sale' },
				{ value: 'new', label: 'New' },
				{ value: 'limited', label: 'Limited' }
			]
		},
		{ id: 'price', label: 'Price', type: 'number' },
		{ id: 'name', label: 'Name', type: 'text' },
		{ id: 'released', label: 'Released', type: 'date' },
		{ id: 'featured', label: 'Featured', type: 'boolean' }
	];

	let query = $state<AdvancedFilterGroup>(emptyFilterGroup());
</script>

<div class="max-w-3xl space-y-3">
	<AdvancedFilters bind:query {fields} onapply={(q) => console.log('apply', q)} />
	<pre class="overflow-auto rounded-lg bg-surface-overlay p-2 text-[10px] text-muted">{JSON.stringify(query, null, 2)}</pre>
</div>
