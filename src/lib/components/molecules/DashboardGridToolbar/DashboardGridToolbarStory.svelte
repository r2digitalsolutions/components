<script lang="ts">
	import DashboardGridToolbar from './DashboardGridToolbar.svelte';

	let cols = $state(12);
	let rowHeight = $state(80);
	let gap = $state(12);
	let compact = $state(true);
	let editable = $state(true);
	let showGrid = $state(true);
	let density = $state<'comfortable' | 'default' | 'compact' | 'dense' | 'custom'>('default');
</script>

<div class="mx-auto max-w-3xl p-4">
	<DashboardGridToolbar
		bind:cols
		bind:rowHeight
		bind:gap
		bind:compact
		bind:editable
		bind:showGrid
		bind:density
		onreset={() => {
			cols = 12;
			rowHeight = 80;
			gap = 12;
			density = 'default';
		}}
	/>
</div>
