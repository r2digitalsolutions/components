<script lang="ts">
	import DashboardGrid from './DashboardGrid.svelte';
	import type { GridItem } from '$lib/utils/layoutGrid.js';

	let layout = $state<GridItem[]>([
		{ id: 'a', x: 0, y: 0, w: 4, h: 2 },
		{ id: 'b', x: 4, y: 0, w: 8, h: 2 },
		{ id: 'c', x: 0, y: 2, w: 6, h: 3 },
		{ id: 'd', x: 6, y: 2, w: 6, h: 3 }
	]);

	let editable = $state(true);
</script>

<div class="space-y-3">
	<label class="flex items-center gap-2 text-sm text-secondary">
		<input type="checkbox" bind:checked={editable} />
		Editable
	</label>
	<DashboardGrid
		bind:layout
		{editable}
		widgets={[
			{ id: 'a', title: 'Stats' },
			{ id: 'b', title: 'Chart' },
			{ id: 'c', title: 'Activity' },
			{ id: 'd', title: 'Notes' }
		]}
		onremove={(id) => (layout = layout.filter((it) => it.id !== id))}
	/>
</div>
