<script lang="ts">
	import StoreRail from './StoreRail.svelte';
	import StoreProductTile from '../StoreProductTile/StoreProductTile.svelte';
	import Package from '@lucide/svelte/icons/package';
	import Utensils from '@lucide/svelte/icons/utensils';
	import Wallet from '@lucide/svelte/icons/wallet';
	import Users from '@lucide/svelte/icons/users';
	import Briefcase from '@lucide/svelte/icons/briefcase';

	const items = [
		{ name: 'Inventario', price: '15 €/mes', icon: Package, accent: 'from-emerald-800 to-teal-600', tags: ['new'] as const },
		{ name: 'TPV', price: '29 €/mes', icon: Utensils, accent: 'from-sky-700 to-cyan-500', tags: ['featured'] as const },
		{ name: 'VeriFactu', price: '9 €/mes', icon: Wallet, accent: 'from-amber-800 to-orange-500', tags: [] as const },
		{ name: 'Portal', price: 'Gratis', icon: Users, accent: 'from-stone-700 to-neutral-500', tags: ['popular'] as const },
		{ name: 'Proyectos', price: '19 €/mes', icon: Briefcase, accent: 'from-teal-800 to-emerald-500', tags: ['new'] as const }
	];
</script>

<div class="bg-neutral-50 p-6 dark:bg-neutral-950" style="--store-bg: #fafafa; --store-bg-dark: #0a0a0a">
	<StoreRail title="Destacados" subtitle="Ejemplo de rail" wide={false}>
		{#each items as item (item.name)}
			<StoreProductTile
				name={item.name}
				priceLabel={item.price}
				icon={item.icon}
				accentClass={item.accent}
				tags={[...item.tags]}
			/>
		{/each}
	</StoreRail>
</div>
