<script lang="ts">
	import FacetPanel from './FacetPanel.svelte';
	import type { CatalogPriceRange } from '$lib/utils/filterParams.js';

	let facets = $state<Record<string, string[]>>({ brand: ['nike'] });
	let price = $state<CatalogPriceRange | undefined>({ min: 40, max: 180 });
</script>

<div class="max-w-xs">
	<FacetPanel
		bind:facets
		bind:price
		priceMin={0}
		priceMax={300}
		groups={[
			{
				id: 'brand',
				title: 'Brand',
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
				title: 'Color',
				options: [
					{ id: 'black', label: 'Black', count: 55 },
					{ id: 'white', label: 'White', count: 40 },
					{ id: 'blue', label: 'Blue', count: 22 },
					{ id: 'red', label: 'Red', count: 14 }
				]
			}
		]}
	/>
	<pre class="mt-3 overflow-auto rounded-lg bg-surface-overlay p-2 text-[10px] text-muted">{JSON.stringify({ facets, price }, null, 2)}</pre>
</div>
