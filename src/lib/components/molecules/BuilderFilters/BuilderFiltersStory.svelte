<script lang="ts">
	import BuilderFilters from './BuilderFilters.svelte';
	import {
		emptyFilterValues,
		parseFilterSchema,
		type FilterFieldSchema,
		type FilterValues
	} from '$lib/utils/filterSchema.js';

	/** Example: this JSON could come from an API */
	const schemaJson = [
		{
			id: 'price',
			label: 'Price',
			type: 'range',
			category: 'Commerce',
			min: 0,
			max: 300,
			step: 5,
			unit: '€'
		},
		{
			id: 'brand',
			label: 'Brand',
			type: 'checkbox',
			category: 'Commerce',
			limit: 4,
			options: [
				{ id: 'nike', label: 'Nike', count: 42 },
				{ id: 'adidas', label: 'Adidas', count: 31 },
				{ id: 'puma', label: 'Puma', count: 18 },
				{ id: 'asics', label: 'Asics', count: 12 },
				{ id: 'hoka', label: 'Hoka', count: 3 }
			]
		},
		{
			id: 'color',
			label: 'Color',
			type: 'checkbox',
			category: 'Commerce',
			options: [
				{ id: 'black', label: 'Black', count: 55 },
				{ id: 'white', label: 'White', count: 40 },
				{ id: 'blue', label: 'Blue', count: 22 }
			]
		},
		{
			id: 'size',
			label: 'Size',
			type: 'radio',
			category: 'Commerce',
			options: [
				{ id: 's', label: 'S' },
				{ id: 'm', label: 'M' },
				{ id: 'l', label: 'L' },
				{ id: 'xl', label: 'XL' }
			]
		},
		{
			id: 'rating',
			label: 'Minimum rating',
			type: 'rating',
			category: 'Quality',
			maxRating: 5
		},
		{
			id: 'sale',
			label: 'On sale only',
			type: 'toggle',
			category: 'Quality'
		},
		{
			id: 'condition',
			label: 'Condition',
			type: 'select',
			category: 'Quality',
			options: [
				{ id: 'new', label: 'New' },
				{ id: 'refurbished', label: 'Refurbished' },
				{ id: 'used', label: 'Used' }
			]
		}
	];

	const schema = $derived(parseFilterSchema(schemaJson) as FilterFieldSchema[]);
	let values = $state<FilterValues>(emptyFilterValues(schemaJson as FilterFieldSchema[]));
</script>

<div class="grid max-w-3xl gap-4 md:grid-cols-[16rem_1fr]">
	<BuilderFilters bind:values {schema} title="Filters" />
	<pre class="overflow-auto rounded-2xl border border-border bg-surface-overlay p-3 text-[11px] text-muted">{JSON.stringify({ schema: schemaJson, values }, null, 2)}</pre>
</div>
