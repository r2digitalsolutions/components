<script lang="ts">
	import FacetPanel from './FacetPanel.svelte';
	import {
		emptyFilterValues,
		type FilterFieldSchema,
		type FilterValues
	} from '$lib/utils/filterSchema.js';

	const schema: FilterFieldSchema[] = [
		{
			id: 'price',
			label: 'Price',
			type: 'range',
			min: 0,
			max: 300,
			unit: '€'
		},
		{
			id: 'brand',
			label: 'Brand',
			type: 'checkbox',
			options: [
				{ id: 'nike', label: 'Nike', count: 42 },
				{ id: 'adidas', label: 'Adidas', count: 31 },
				{ id: 'puma', label: 'Puma', count: 18 },
				{ id: 'asics', label: 'Asics', count: 12 },
				{ id: 'newbalance', label: 'New Balance', count: 9 },
				{ id: 'reebok', label: 'Reebok', count: 7 },
				{ id: 'hoka', label: 'Hoka', count: 3 }
			]
		},
		{
			id: 'color',
			label: 'Color',
			type: 'checkbox',
			options: [
				{ id: 'black', label: 'Black', count: 55 },
				{ id: 'white', label: 'White', count: 40 },
				{ id: 'blue', label: 'Blue', count: 22 },
				{ id: 'red', label: 'Red', count: 14 }
			]
		}
	];

	let values = $state<FilterValues>({
		...emptyFilterValues(schema),
		brand: ['nike']
	});
</script>

<div class="max-w-xs space-y-3">
	<p class="text-xs text-muted">
		One <code class="text-primary">bind:values</code> for everything — schema drives the UI.
	</p>
	<FacetPanel bind:values {schema} />
	<pre class="overflow-auto rounded-lg bg-surface-overlay p-2 text-[10px] text-muted">{JSON.stringify(values, null, 2)}</pre>
</div>
