<script lang="ts">
	import MediaLayerList from './MediaLayerList.svelte';

	let selectedId = $state('2');
	let layers = $state([
		{ id: '1', name: 'Background', kind: 'image' as const, visible: true, locked: true },
		{ id: '2', name: 'Hero video', kind: 'video' as const, visible: true, locked: false },
		{ id: '3', name: 'Caption', kind: 'text' as const, visible: false, locked: false }
	]);
</script>

<div class="w-64 rounded-lg border border-border bg-surface-elevated">
	<MediaLayerList
		{layers}
		{selectedId}
		onselect={(id) => (selectedId = id)}
		ontogglevisible={(id) => {
			layers = layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l));
		}}
		ontogglelocked={(id) => {
			layers = layers.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l));
		}}
	/>
</div>
