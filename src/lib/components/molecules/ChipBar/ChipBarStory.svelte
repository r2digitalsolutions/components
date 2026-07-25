<script lang="ts">
	import ChipBar from './ChipBar.svelte';

	let value = $state('all');
</script>

<div class="max-w-sm">
	<ChipBar
		bind:value
		items={[
			{ id: 'all', label: 'All' },
			{ id: 'nearby', label: 'Nearby' },
			{ id: 'open', label: 'Open now' },
			{ id: 'top', label: 'Top rated' },
			{ id: 'price', label: '$$' },
			{ id: 'delivery', label: 'Delivery' }
		]}
	/>
</div>
