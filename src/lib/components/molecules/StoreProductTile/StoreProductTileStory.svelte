<script lang="ts">
	import StoreProductTile from './StoreProductTile.svelte';
	import Package from '@lucide/svelte/icons/package';
	import Utensils from '@lucide/svelte/icons/utensils';

	let {
		featured = false,
		installed = false,
		tags = ['new'] as ('new' | 'featured' | 'popular')[]
	} = $props();
</script>

<div class="max-w-sm p-6">
	<StoreProductTile
		name={featured ? 'TPV / POS' : 'Inventario'}
		description="Punto de venta con mesas, KDS y caja."
		priceLabel={featured ? '29 €/mes' : 'Gratis'}
		categoryLabel="Comercial"
		{featured}
		{installed}
		{tags}
		icon={featured ? Utensils : Package}
		accentClass={featured ? 'from-sky-700 via-sky-600 to-cyan-500' : 'from-emerald-800 to-teal-600'}
	/>
</div>
