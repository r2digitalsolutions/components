<script lang="ts">
	import FacetGroup from './FacetGroup.svelte';
</script>

<div class="w-64 space-y-6 rounded-2xl border border-border bg-surface-elevated p-4">
	<FacetGroup
		id="brand"
		title="Brand"
		options={[
			{ id: 'nike', label: 'Nike', count: 42 },
			{ id: 'adidas', label: 'Adidas', count: 31 },
			{ id: 'puma', label: 'Puma', count: 18 },
			{ id: 'asics', label: 'Asics', count: 12 },
			{ id: 'newbalance', label: 'New Balance', count: 9 },
			{ id: 'reebok', label: 'Reebok', count: 7 },
			{ id: 'saucony', label: 'Saucony', count: 4 },
			{ id: 'hoka', label: 'Hoka', count: 3 }
		]}
	/>
	<FacetGroup
		id="size"
		title="Size"
		multiple={false}
		limit={10}
		options={[
			{ id: 's', label: 'S', count: 20 },
			{ id: 'm', label: 'M', count: 44 },
			{ id: 'l', label: 'L', count: 38 },
			{ id: 'xl', label: 'XL', count: 15 }
		]}
	/>
</div>
