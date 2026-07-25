<script lang="ts">
	import AdvancedFilters from './AdvancedFilters.svelte';
	import type { AdvancedFilterClause } from '$lib/utils/filterParams.js';

	let clauses = $state<AdvancedFilterClause[]>([]);
</script>

<div class="max-w-3xl space-y-3">
	<AdvancedFilters
		bind:clauses
		fields={[
			{ id: 'brand', label: 'Brand', type: 'select', options: [
				{ value: 'nike', label: 'Nike' },
				{ value: 'adidas', label: 'Adidas' },
				{ value: 'puma', label: 'Puma' }
			]},
			{ id: 'status', label: 'Status', type: 'select', options: [
				{ value: 'active', label: 'Active' },
				{ value: 'draft', label: 'Draft' },
				{ value: 'archived', label: 'Archived' }
			]},
			{ id: 'tags', label: 'Tags', type: 'multiselect', options: [
				{ value: 'sale', label: 'Sale' },
				{ value: 'new', label: 'New' },
				{ value: 'limited', label: 'Limited' }
			]},
			{ id: 'price', label: 'Price', type: 'number' },
			{ id: 'name', label: 'Name', type: 'text' }
		]}
		onapply={(c) => console.log('apply', c)}
	/>
	<pre class="overflow-auto rounded-lg bg-surface-overlay p-2 text-[10px] text-muted">{JSON.stringify(clauses, null, 2)}</pre>
</div>
