<script lang="ts">
	import ChipBar from './ChipBar.svelte';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Star from '@lucide/svelte/icons/star';
	import Truck from '@lucide/svelte/icons/truck';

	let value = $state('all');
	let values = $state<string[]>(['open']);
</script>

<div class="max-w-md space-y-6">
	<section class="space-y-2">
		<h3 class="text-xs font-semibold uppercase tracking-wide text-muted">Soft (default)</h3>
		<ChipBar
			bind:value
			items={[
				{ id: 'all', label: 'All', count: 128 },
				{ id: 'nearby', label: 'Nearby', icon: MapPin, count: 24 },
				{ id: 'open', label: 'Open now', count: 18 },
				{ id: 'top', label: 'Top rated', icon: Star, count: 42 },
				{ id: 'delivery', label: 'Delivery', icon: Truck, count: 31 },
				{ id: 'price', label: '$$' }
			]}
		/>
		<p class="text-xs text-muted">Selected: <code class="text-primary">{value || 'none'}</code></p>
	</section>

	<section class="space-y-2">
		<h3 class="text-xs font-semibold uppercase tracking-wide text-muted">Multi + outline</h3>
		<ChipBar
			multi
			bind:values
			variant="outline"
			size="sm"
			items={[
				{ id: 'open', label: 'Open now' },
				{ id: 'top', label: 'Top rated' },
				{ id: 'delivery', label: 'Delivery' },
				{ id: 'deals', label: 'Deals' }
			]}
		/>
	</section>

	<section class="space-y-2">
		<h3 class="text-xs font-semibold uppercase tracking-wide text-muted">Solid</h3>
		<ChipBar
			variant="solid"
			value="a"
			items={[
				{ id: 'a', label: 'For you' },
				{ id: 'b', label: 'Following' },
				{ id: 'c', label: 'Trending' }
			]}
		/>
	</section>
</div>
